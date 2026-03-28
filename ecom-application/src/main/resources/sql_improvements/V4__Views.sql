-- 1. Simple View: High-level Customer Overview
-- Joins user_table with addresses to provide a clean list for shipping
CREATE OR REPLACE VIEW view_customer_shipping_details AS
SELECT 
    u.id AS user_id,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    a.street,
    a.city,
    a.state,
    a.zipcode,
    a.country
FROM user_table u
JOIN addresses a ON u.address_id = a.id;


-- 2. Simple View: Active Product Inventory
-- Shows current stock and calculated total value of assets per product
CREATE OR REPLACE VIEW view_inventory_value AS
SELECT 
    id,
    name,
    category,
    stock_quantity,
    price,
    (stock_quantity * price) AS total_value
FROM products
WHERE active = true;


-- 3. Materialized View: Sales Performance by Category
-- Aggregates total revenue and order counts per category
-- Concept: Used for heavy reports where real-time accuracy isn't critical
CREATE MATERIALIZED VIEW mv_category_sales_stats AS
SELECT 
    p.category,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(oi.quantity) AS total_items_sold,
    SUM(oi.quantity * oi.price) AS total_revenue
FROM products p
JOIN order_item oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
GROUP BY p.category;

-- Note: Use 'REFRESH MATERIALIZED VIEW mv_category_sales_stats;' to update data
