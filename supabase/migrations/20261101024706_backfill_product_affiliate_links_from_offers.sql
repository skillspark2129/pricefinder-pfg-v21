/*
# Backfill Daraz and PriceOye links into per-product links

1. Changed Data
- Copies each existing Daraz and PriceOye affiliate link from the store offers into `product_affiliate_links`, so products that already sell on those stores show their buy buttons.

2. Notes
- Idempotent: rows that already exist are left unchanged.
- Offers themselves are not modified.
*/

INSERT INTO product_affiliate_links (product_id, platform, url)
SELECT o.product_id,
       CASE s.name WHEN 'Daraz' THEN 'daraz' ELSE 'priceoye' END,
       o.affiliate_url
FROM product_offers o
JOIN stores s ON s.id = o.store_id
WHERE s.name IN ('Daraz', 'PriceOye')
  AND o.affiliate_url ~* '^https?://'
ON CONFLICT (product_id, platform) DO NOTHING;
