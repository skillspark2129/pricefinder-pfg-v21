/*
# Create affiliate platform links and real product ratings

1. New Tables
- `affiliate_links`: one row per shopping platform where the site earns affiliate commission.
  - `platform` (text, primary key, one of 11 fixed platform codes)
  - `label` (text, display name)
  - `url` (text, empty until the admin saves an affiliate link; must start with http or https)
  - `updated_at` (timestamp)
- `product_ratings`: one 1 to 5 star rating per visitor per product.
  - `id` (uuid, primary key)
  - `product_id` (uuid, references products, deleted with the product)
  - `visitor_id` (text, random id stored in the visitor's browser)
  - `stars` (smallint, 1 to 5)
  - `created_at` (timestamp)

2. New View
- `product_rating_stats`: average rating and rating count per product. It exposes only these aggregates, never individual visitor rows.

3. Security
- `affiliate_links`: anyone may read (the links are shown on the public product page). Only the admin account may insert, update or delete.
- `product_ratings`: anyone may insert a rating. Individual rows are not readable by visitors. A visitor can rate a product once, enforced by a unique constraint.
- Grants: anon and authenticated read `affiliate_links` and `product_rating_stats`; anon and authenticated insert `product_ratings`; authenticated manages `affiliate_links`.

4. Notes
- Creation and seeding are idempotent, so re-running this migration is safe.
- No existing data is changed or removed.
*/

CREATE TABLE IF NOT EXISTS affiliate_links (
  platform text PRIMARY KEY CHECK (platform IN (
    'daraz', 'amazon_usa', 'amazon_uk', 'amazon_uae', 'aliexpress', 'alibaba',
    'noon', 'shein', 'ebay', 'temu', 'priceoye'
  )),
  label text NOT NULL,
  url text NOT NULL DEFAULT '' CHECK (url = '' OR url ~* '^https?://'),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO affiliate_links (platform, label) VALUES
  ('daraz', 'Daraz (PK)'),
  ('amazon_usa', 'Amazon USA (.com)'),
  ('amazon_uk', 'Amazon UK (.co.uk)'),
  ('amazon_uae', 'Amazon UAE (.ae)'),
  ('aliexpress', 'AliExpress'),
  ('alibaba', 'Alibaba (B2B bulk orders)'),
  ('noon', 'Noon'),
  ('shein', 'Shein'),
  ('ebay', 'eBay'),
  ('temu', 'Temu'),
  ('priceoye', 'PriceOye')
ON CONFLICT (platform) DO NOTHING;

ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON affiliate_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON affiliate_links TO authenticated;

DROP POLICY IF EXISTS "public_select_affiliate_links" ON affiliate_links;
CREATE POLICY "public_select_affiliate_links" ON affiliate_links FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_affiliate_links" ON affiliate_links;
CREATE POLICY "admin_insert_affiliate_links" ON affiliate_links FOR INSERT
TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_update_affiliate_links" ON affiliate_links;
CREATE POLICY "admin_update_affiliate_links" ON affiliate_links FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_delete_affiliate_links" ON affiliate_links;
CREATE POLICY "admin_delete_affiliate_links" ON affiliate_links FOR DELETE
TO authenticated USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

CREATE TABLE IF NOT EXISTS product_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  visitor_id text NOT NULL CHECK (char_length(visitor_id) BETWEEN 8 AND 100),
  stars smallint NOT NULL CHECK (stars BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_ratings_one_per_visitor UNIQUE (product_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS product_ratings_product_id_idx ON product_ratings (product_id);

ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON product_ratings TO anon, authenticated;

DROP POLICY IF EXISTS "visitors_insert_product_ratings" ON product_ratings;
CREATE POLICY "visitors_insert_product_ratings" ON product_ratings FOR INSERT
TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE VIEW product_rating_stats AS
SELECT
  product_id,
  round(avg(stars)::numeric, 1) AS average_rating,
  count(*)::int AS rating_count
FROM product_ratings
GROUP BY product_id;

GRANT SELECT ON product_rating_stats TO anon, authenticated;
