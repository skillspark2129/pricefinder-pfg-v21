/*
# Create AI trending alerts and admin settings

1. New Tables
- `trending_alerts`: products the admin should add affiliate links for.
  - `id` (uuid, primary key)
  - `name` (text)
  - `trend_score` (integer, 0 to 100)
  - `affiliate_url` (text, optional, filled in by the admin)
  - `status` (text, 'pending' or 'published')
  - `sort_order` (integer)
  - `created_at` (timestamp)
- `settings`: key and value pairs for admin configuration, such as the admin WhatsApp number.
  - `key` (text, primary key)
  - `value` (text)
  - `updated_at` (timestamp)

2. Seed data
- Five starting trending products are inserted into `trending_alerts`, only if the table is empty.

3. Security
- Row level security is enabled on both tables.
- Only the admin account (matched on the signed-in email) can read or change these tables.
- Grants: authenticated gets SELECT, INSERT, UPDATE and DELETE on both tables. anon gets nothing.

4. Notes
- Creation and seeding are idempotent, so re-running this migration is safe.
- No existing data is changed or removed.
*/

CREATE TABLE IF NOT EXISTS trending_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 150),
  trend_score integer NOT NULL CHECK (trend_score BETWEEN 0 AND 100),
  affiliate_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY CHECK (char_length(key) BETWEEN 1 AND 100),
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trending_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON trending_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON settings TO authenticated;

DROP POLICY IF EXISTS "admin_select_trending_alerts" ON trending_alerts;
CREATE POLICY "admin_select_trending_alerts" ON trending_alerts FOR SELECT
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_insert_trending_alerts" ON trending_alerts;
CREATE POLICY "admin_insert_trending_alerts" ON trending_alerts FOR INSERT
TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_update_trending_alerts" ON trending_alerts;
CREATE POLICY "admin_update_trending_alerts" ON trending_alerts FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_delete_trending_alerts" ON trending_alerts;
CREATE POLICY "admin_delete_trending_alerts" ON trending_alerts FOR DELETE
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_select_settings" ON settings;
CREATE POLICY "admin_select_settings" ON settings FOR SELECT
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_insert_settings" ON settings;
CREATE POLICY "admin_insert_settings" ON settings FOR INSERT
TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_delete_settings" ON settings;
CREATE POLICY "admin_delete_settings" ON settings FOR DELETE
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

INSERT INTO trending_alerts (name, trend_score, sort_order)
SELECT v.name, v.score, v.sort_order
FROM (VALUES
  ('Infinix Hot 50', 95, 1),
  ('iPhone 15', 92, 2),
  ('AirPods Pro 2nd Gen', 90, 3),
  ('Samsung A15', 88, 4),
  ('Audionic Airbuds', 85, 5)
) AS v(name, score, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM trending_alerts);
