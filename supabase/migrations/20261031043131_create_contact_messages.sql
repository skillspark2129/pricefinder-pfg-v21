/*
# Create contact_messages table

Plain-English summary
- Stores messages sent through the public Contact page so the site owner can read them.
- Visitors can submit a message but cannot read, edit or delete anyone's messages.

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key, generated automatically)
  - `name` (text, required, 1 to 100 characters)
  - `email` (text, required, 3 to 254 characters, basic email shape check)
  - `message` (text, required, 1 to 2000 characters)
  - `created_at` (timestamp, set automatically)

2. Security
- Row level security is enabled on `contact_messages`.
- The `anon` and `authenticated` roles are granted INSERT only. There is no SELECT, UPDATE or DELETE grant, so the public app cannot read stored messages.
- A single INSERT policy allows public submissions. It is intentionally open because the Contact form has no sign-in. Length and format checks in the table guard the content.

3. Notes
- The site owner reads messages directly from the database dashboard.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);
