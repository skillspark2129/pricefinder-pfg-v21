import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const EMAIL_KEY = "admin_login_email";
const PASSWORD_HASH_KEY = "admin_password_hash";
const NOT_CONFIGURED_MESSAGE = "Admin login is not configured in the database";
const encoder = new TextEncoder();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function matchesSecret(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < provided.length; i++) {
    difference |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return difference === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1) return false;

  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: hexToBytes(parts[2]), iterations },
    key,
    256,
  );
  return matchesSecret(bytesToHex(new Uint8Array(derived)), parts[3]);
}

async function openAdminSession(email: string, password: string) {
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const first = await anon.auth.signInWithPassword({ email, password });
  if (first.data.session) return first.data.session;

  const { data: list, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;
  const existing = list.users.find((user) => user.email?.toLowerCase() === email);

  if (existing) {
    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, { password });
    if (updateError) throw updateError;
  } else {
    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) throw createError;
  }

  const retry = await anon.auth.signInWithPassword({ email, password });
  if (retry.error || !retry.data.session) throw retry.error ?? new Error("Admin session could not be created");
  return retry.data.session;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: rows, error: settingsError } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [EMAIL_KEY, PASSWORD_HASH_KEY]);
    if (settingsError) throw settingsError;

    const settings = new Map((rows ?? []).map((row) => [row.key, row.value as string]));
    const adminEmail = settings.get(EMAIL_KEY)?.trim().toLowerCase() ?? "";
    const passwordHash = settings.get(PASSWORD_HASH_KEY) ?? "";
    if (!adminEmail || !passwordHash) {
      return jsonResponse({ error: NOT_CONFIGURED_MESSAGE }, 500);
    }

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const emailMatches = matchesSecret(email, adminEmail);
    const passwordMatches = await verifyPassword(password, passwordHash);
    if (!(emailMatches && passwordMatches)) {
      return jsonResponse({ error: "Incorrect email or password." }, 401);
    }

    const session = await openAdminSession(adminEmail, password);
    return jsonResponse({ ok: true, session });
  } catch (error) {
    console.error("admin-login failed", error);
    return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
  }
});
