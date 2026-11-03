/*
# Create complaint and contact messages inbox

1. New Tables
- `messages`: one row per complaint or contact request from the public contact page.
  - `id` (uuid, primary key)
  - `name` (text, 1 to 100 characters)
  - `whatsapp` (text, the sender's WhatsApp number, 7 to 20 characters)
  - `message` (text, the complaint or message, 1 to 2000 characters)
  - `product_link` (text, optional link to a product, up to 500 characters)
  - `status` (text, either 'pending' or 'solved', defaults to 'pending')
  - `created_at` (timestamp, defaults to now)

2. Security
- Row level security is enabled on `messages`.
- Visitors (anonymous and signed in) may only INSERT, and only with status 'pending'.
- Only the admin account may read, update or delete messages.
- Grants: anon and authenticated get INSERT; authenticated gets SELECT, UPDATE and DELETE.

3. Notes
- Creation is idempotent, so re-running this migration is safe.
- No existing data is changed or removed.
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 7 AND 20),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  product_link text CHECK (product_link IS NULL OR char_length(product_link) <= 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'solved')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_status_idx ON messages (status);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON messages TO authenticated;

DROP POLICY IF EXISTS "visitors_insert_pending_messages" ON messages;
CREATE POLICY "visitors_insert_pending_messages" ON messages FOR INSERT
TO anon, authenticated WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "admin_select_messages" ON messages;
CREATE POLICY "admin_select_messages" ON messages FOR SELECT
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_update_messages" ON messages;
CREATE POLICY "admin_update_messages" ON messages FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_delete_messages" ON messages;
CREATE POLICY "admin_delete_messages" ON messages FOR DELETE
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');
