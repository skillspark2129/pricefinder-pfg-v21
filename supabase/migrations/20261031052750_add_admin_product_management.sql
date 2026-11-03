/*
# Admin product management

1. Modified tables
- `products`: new column `commission_percent` (integer, default 10, 0 to 100) recording the affiliate commission the admin expects.

2. Security
- Catalog reads stay public (anon and authenticated).
- INSERT, UPDATE and DELETE on `products` and `product_offers` are allowed only to the `authenticated` role when the signed-in email is the admin email.
- Grants: SELECT, INSERT, UPDATE, DELETE on those two tables to `authenticated` only. Anonymous visitors cannot write.
- `stores` stays read-only for everyone.

3. Notes
- Deleting a product cascades to its offers and price history (existing foreign keys).
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS commission_percent integer NOT NULL DEFAULT 10;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_commission_percent_range'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_commission_percent_range CHECK (commission_percent BETWEEN 0 AND 100);
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_offers TO authenticated;

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_insert_product_offers" ON product_offers;
CREATE POLICY "admin_insert_product_offers" ON product_offers FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_update_product_offers" ON product_offers;
CREATE POLICY "admin_update_product_offers" ON product_offers FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');

DROP POLICY IF EXISTS "admin_delete_product_offers" ON product_offers;
CREATE POLICY "admin_delete_product_offers" ON product_offers FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'baithakotbattagram1@gmail.com');
