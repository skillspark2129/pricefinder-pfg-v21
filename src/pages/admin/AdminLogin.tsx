import { Eye, EyeOff, Fingerprint, Loader2, LogIn } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LOGO_URL, APP_NAME } from '@/lib/constants';
import {
  ADMIN_NOT_CONFIGURED_MESSAGE,
  verifyAdminCredentials,
  getFingerprintId,
  isAdminSignedIn,
  startAdminSession,
} from '@/lib/adminAuth';
import { isFingerprintSupported, verifyFingerprint } from '@/lib/webauthn';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fingerprintId, setFingerprintId] = useState<string | null>(null);

  useEffect(() => {
    if (isFingerprintSupported()) setFingerprintId(getFingerprintId());
  }, []);

  if (isAdminSignedIn()) {
    return <Navigate to="/admin/products" replace />;
  }

  const handleSkip = () => {
    startAdminSession();
    navigate('/admin/products', { replace: true });
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const valid = await verifyAdminCredentials(email.trim(), password);
      if (!valid) {
        setError('Incorrect email or password.');
        return;
      }
      startAdminSession();
      navigate('/admin/products', { replace: true });
    } catch (err) {
      console.error('Admin login failed', err);
      setError(
        err instanceof Error && err.message === ADMIN_NOT_CONFIGURED_MESSAGE
          ? ADMIN_NOT_CONFIGURED_MESSAGE
          : 'Sign in is temporarily unavailable. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleFingerprint = async () => {
    if (!fingerprintId) return;
    setError(null);
    setBusy(true);
    try {
      const verified = await verifyFingerprint(fingerprintId);
      if (!verified) {
        setError('Fingerprint sign-in failed. Use your password instead.');
        return;
      }
      startAdminSession();
      navigate('/admin/products', { replace: true });
    } catch (err) {
      console.error('Fingerprint sign-in failed', err);
      setError('Fingerprint sign-in was cancelled or failed. Use your password instead.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-ink-50 via-white to-primary-50 px-4 py-12 dark:from-ink-900 dark:via-ink-900 dark:to-ink-800">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/30" />
      <div className="card relative w-full max-w-md animate-fade-up p-8 shadow-xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <img src={LOGO_URL} alt={`${APP_NAME} logo`} className="h-16 w-16 rounded-2xl object-cover shadow-md" />
          <h1 className="mt-5 text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{APP_NAME} management console</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Sign in
          </button>
        </form>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/40"
        >
          Skip Login - Go to Dashboard
        </button>

        {fingerprintId && (
          <>
            <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
              <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
              or
              <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
            </div>
            <button
              type="button"
              onClick={handleFingerprint}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-ink-300 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-600 disabled:opacity-60 dark:border-ink-600"
            >
              <Fingerprint className="h-5 w-5" />
              Login with Fingerprint / Face ID
            </button>
          </>
        )}
      </div>
    </div>
  );
}
