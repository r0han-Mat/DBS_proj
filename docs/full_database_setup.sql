-- ==========================================
-- FULL E-COMMERCE DATABASE SETUP SCRIPT
-- ==========================================

-- -----------------------------------------------------------------------------
-- 1. BASE TABLES CREATION
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zipcode VARCHAR(20),
    country VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user_table (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    address_id INT REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    stock_quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_table(id),
    status VARCHAR(50) DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_item (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_item (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_table(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. DUMMY DATA INSERTION
-- -----------------------------------------------------------------------------

-- Insert Addresses
INSERT INTO addresses (street, city, state, zipcode, country) VALUES 
('123 Tech Lane', 'San Francisco', 'CA', '94105', 'USA'),
('456 Market St', 'New York', 'NY', '10001', 'USA'),
('789 Maple Ave', 'Toronto', 'ON', 'M5V 2H1', 'Canada');

-- Insert Users
INSERT INTO user_table (first_name, last_name, email, address_id) VALUES 
('Alice', 'Smith', 'alice@example.com', 1),
('Bob', 'Jones', 'bob@example.com', 2),
('Charlie', 'Brown', 'charlie@example.com', 3);

-- Insert Products
INSERT INTO products (name, category, stock_quantity, price, active) VALUES 
('Quantum Laptop', 'Electronics', 50, 1499.99, true),
('Mechanical Keyboard', 'Electronics', 120, 129.50, true),
('Office Chair', 'Furniture', 30, 249.00, true),
('Coffee Mug', 'Accessories', 200, 14.99, true);

-- Insert Cart Items (Simulating an active cart for Alice)
INSERT INTO cart_item (user_id, product_id, quantity, price) VALUES 
(1, 1, 1, 1499.99),
(1, 4, 2, 14.99);

-- -----------------------------------------------------------------------------
-- 3. AUDIT LOGGING (From V1)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50),
    action VARCHAR(20),
    record_id BIGINT,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION audit_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (table_name, action, record_id, old_data, new_data)
        VALUES ('products', 'UPDATE', OLD.id, row_to_json(OLD), row_to_json(NEW));
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log (table_name, action, record_id, old_data)
        VALUES ('products', 'DELETE', OLD.id, row_to_json(OLD));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_product_audit ON products;
CREATE TRIGGER trg_product_audit
AFTER UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION audit_product_changes();

-- -----------------------------------------------------------------------------
-- 4. BUSINESS LOGIC TRIGGERS (From V2)
-- -----------------------------------------------------------------------------

-- Trigger for stock deduction
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT stock_quantity FROM products WHERE id = NEW.product_id) < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product ID %', NEW.product_id;
    END IF;

    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_stock ON order_item;
CREATE TRIGGER trg_update_stock
BEFORE INSERT ON order_item
FOR EACH ROW EXECUTE FUNCTION update_stock_after_order();


-- Trigger for order total calculation
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id BIGINT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_order_id := OLD.order_id;
    ELSE
        v_order_id := NEW.order_id;
    END IF;

    UPDATE orders
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM order_item
        WHERE order_id = v_order_id
    )
    WHERE id = v_order_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_total ON order_item;
CREATE TRIGGER trg_calculate_total
AFTER INSERT OR UPDATE OR DELETE ON order_item
FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

-- -----------------------------------------------------------------------------
-- 5. STORED PROCEDURES & FUNCTIONS (From V3)
-- -----------------------------------------------------------------------------

-- Checkout procedure
CREATE OR REPLACE PROCEDURE process_checkout(p_user_id BIGINT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id BIGINT;
    v_cart_count INT;
BEGIN
    -- Check if cart is empty
    SELECT COUNT(*) INTO v_cart_count FROM cart_item WHERE user_id = p_user_id;
    IF v_cart_count = 0 THEN
        RAISE EXCEPTION 'Cart is empty for user %', p_user_id;
    END IF;

    -- Create a new order
    INSERT INTO orders (user_id, status, total_amount, created_at, updated_at)
    VALUES (p_user_id, 'PENDING', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id INTO v_order_id;

    -- Move items from cart to order
    INSERT INTO order_item (order_id, product_id, quantity, price)
    SELECT v_order_id, product_id, quantity, price
    FROM cart_item
    WHERE user_id = p_user_id;

    -- Clear cart
    DELETE FROM cart_item WHERE user_id = p_user_id;

    COMMIT;
END;
$$;

-- Revenue by category function
CREATE OR REPLACE FUNCTION get_revenue_by_category(p_category VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    v_revenue DECIMAL;
BEGIN
    SELECT COALESCE(SUM(oi.quantity * oi.price), 0)
    INTO v_revenue
    FROM order_item oi
    JOIN products p ON oi.product_id = p.id
    WHERE p.category = p_category;

    RETURN v_revenue;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 6. VIEWS AND MATERIALIZED VIEWS (From V4)
-- -----------------------------------------------------------------------------

-- Shipping detail view
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

-- Inventory value view
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

-- Sales stats materialized view
DROP MATERIALIZED VIEW IF EXISTS mv_category_sales_stats;
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

-- ==========================================
-- TEST QUERIES (RUN MANUALLY)
-- ==========================================
/*
-- ---------------------------------------------------------
-- TEST 1: E2E Checkout Flow (Tests Procedures + Triggers)
-- ---------------------------------------------------------
-- 1a. View initial state
SELECT * FROM cart_item WHERE user_id = 1;
SELECT stock_quantity FROM products WHERE id IN (1, 4);

-- 1b. Execute the checkout procedure
CALL process_checkout(1);

-- 1c. Verify order creation and triggers (stock deduction & total calculation)
SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC LIMIT 1;
SELECT * FROM order_item WHERE order_id = (SELECT MAX(id) FROM orders WHERE user_id = 1);
SELECT stock_quantity FROM products WHERE id IN (1, 4); -- Should be reduced

-- ---------------------------------------------------------
-- TEST 2: Constraints and Exception Handling
-- ---------------------------------------------------------
-- 2a. Attempt to order more items than exist in stock
-- Create a new cart entry for Bob (user_id = 2) for 500 mechanical keyboards
INSERT INTO cart_item (user_id, product_id, quantity, price) VALUES (2, 2, 500, 129.50);
-- The following should FAIL with 'Insufficient stock' error when run
-- CALL process_checkout(2); 

-- ---------------------------------------------------------
-- TEST 3: Audit Logging and JSONB Extraction
-- ---------------------------------------------------------
-- 3a. Update a product price
UPDATE products SET price = 1399.99 WHERE id = 1;

-- 3b. Delete a product
DELETE FROM products WHERE id = 3;

-- 3c. View nicely formatted audit logs extracting old and new JSON details natively
SELECT 
    table_name, 
    action, 
    changed_at,
    old_data->>'price' AS old_price,
    new_data->>'price' AS new_price,
    old_data->>'name' AS deleted_item_name
FROM audit_log 
ORDER BY changed_at DESC;

-- ---------------------------------------------------------
-- TEST 4: Materialized Views and Window Functions
-- ---------------------------------------------------------
-- 4a. Refresh the materialized view after our new sales
REFRESH MATERIALIZED VIEW mv_category_sales_stats;
SELECT * FROM mv_category_sales_stats;

-- 4b. Complex Window Query: Rank top selling products within their category
WITH ProductRevenue AS (
    SELECT 
        p.id, 
        p.name, 
        p.category, 
        SUM(oi.quantity * oi.price) AS total_revenue
    FROM products p
    JOIN order_item oi ON p.id = oi.product_id
    GROUP BY p.id, p.name, p.category
)
SELECT 
    name, 
    category, 
    total_revenue,
    RANK() OVER (PARTITION BY category ORDER BY total_revenue DESC) as rank_in_category,
    SUM(total_revenue) OVER (PARTITION BY category) as total_category_sales
FROM ProductRevenue
ORDER BY category, rank_in_category;
*/
