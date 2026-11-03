/*
# Add affiliate link to store offers

1. Modified Tables
- `product_offers`: new nullable column `affiliate_url` (text) holding the store's affiliate link for that product.

2. Behaviour
- Existing rows are unchanged; the column is empty until an affiliate link is added.
- The product page uses the affiliate link when present and falls back to a store search link otherwise.

3. Security
- No policy or grant changes. Existing read-only access for anon and authenticated continues to apply.
*/

ALTER TABLE product_offers ADD COLUMN IF NOT EXISTS affiliate_url text;
