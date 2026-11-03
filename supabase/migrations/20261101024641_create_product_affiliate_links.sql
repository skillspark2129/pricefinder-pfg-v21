/*
# Create per-product affiliate links

1. New Tables
- `product_affiliate_links`: one affiliate link per product per shopping platform.
  - `product_id` (uuid, references products, deleted with the product)
  - `platform` (text, one of 11 fixed platform codes)
  - `url` (text, must start with http or https)
  - `updated_at` (timestamp)
  - Primary key on (product_id, platform), so each platform has at most one link per product.

2. Security
- Anyone may read these links (they are shown on the public product page).
- Only the admin account may insert, update or delete them.
- Grants: anon and authenticated read; authenticated writes.

3. Notes
- Idempotent: safe to re-run. No existing data is changed.
*/

CREATE TABLE IF NOT EXISTS product_affiliate_links (
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN (
    'daraz', 'amazon_usa', 'amazon_uk', 'amazon_uae', 'aliexpress', 'alibaba',
    'noon', 'shein', 'ebay', 'temu', 'priceoye'
  )),
  url text NOT NULL CHECK (url ~* '^https?://'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, platform)
);

ALTER TABLE product_affiliate_links ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON product_affiliate_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON product_affiliate_links TO authenticated;

DROP POLICY IF EXISTS "public_select_product_affiliate_links" ON product_affiliate_links;
CREATE POLICY "public_select_product_affiliate_links" ON product_affiliate_links FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_product_affiliate_links" ON product_affiliate_links;
CREATE POLICY "admin_insert_product_affiliate_links" ON product_affiliate_links FOR INSERT
TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_update_product_affiliate_links" ON product_affiliate_links;
CREATE POLICY "admin_update_product_affiliate_links" ON product_affiliate_links FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_delete_product_affiliate_links" ON product_affiliate_links;
CREATE POLICY "admin_delete_product_affiliate_links" ON product_affiliate_links FOR DELETE
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');
