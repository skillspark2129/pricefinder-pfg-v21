/*
# Create price comparison schema

## Plain-English summary
Sets up the storage for PriceFinder PK: stores, products, the price each store
offers for a product, a six-month price history per product, and a newsletter
signup list.

## 1. New tables
- `stores`: the shops we compare (name, badge colour, display order).
- `products`: the items being compared (title, brand, category, images, specs,
  list price, rating, sample reviews).
- `product_offers`: one row per store per product, with that store's price,
  delivery text and stock status.
- `price_history`: one row per product per month for the price chart.
- `newsletter_subscribers`: email addresses from the footer signup form.

## 2. Security
- RLS is enabled on every table.
- Catalogue tables (stores, products, product_offers, price_history) are public
  read-only: anon and authenticated roles can SELECT, nobody can write through
  the public API.
- newsletter_subscribers allows anyone to INSERT an email; it has no SELECT
  policy, so visitors cannot read other subscribers.
- Grants match the policies exactly (no UPDATE or DELETE granted anywhere).

## 3. Important notes
1. Writes to the catalogue are made by the database owner only (seed scripts or
   future authenticated admin tooling).
2. All statements are idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS).
*/

CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  brand_color text NOT NULL DEFAULT '#101828',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  image_urls text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  sample_reviews jsonb NOT NULL DEFAULT '[]'::jsonb,
  list_price int NOT NULL CHECK (list_price > 0),
  rating numeric(2,1) NOT NULL DEFAULT 0,
  review_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  price int NOT NULL CHECK (price > 0),
  delivery_text text NOT NULL DEFAULT '',
  stock_status text NOT NULL DEFAULT 'In stock',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, store_id)
);
CREATE INDEX IF NOT EXISTS product_offers_product_id_idx ON product_offers (product_id);

CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  recorded_on date NOT NULL,
  price int NOT NULL CHECK (price > 0),
  UNIQUE (product_id, recorded_on)
);
CREATE INDEX IF NOT EXISTS price_history_product_id_idx ON price_history (product_id, recorded_on);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 5 AND 254 AND email LIKE '%@%'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON stores, products, product_offers, price_history TO anon, authenticated;
GRANT INSERT ON newsletter_subscribers TO anon, authenticated;

DROP POLICY IF EXISTS "public_select_stores" ON stores;
CREATE POLICY "public_select_stores" ON stores FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_product_offers" ON product_offers;
CREATE POLICY "public_select_product_offers" ON product_offers FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_price_history" ON price_history;
CREATE POLICY "public_select_price_history" ON price_history FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "public_insert_newsletter" ON newsletter_subscribers FOR INSERT
TO anon, authenticated WITH CHECK (char_length(email) BETWEEN 5 AND 254 AND email LIKE '%@%');
