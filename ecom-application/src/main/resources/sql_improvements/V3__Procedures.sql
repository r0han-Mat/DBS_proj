-- 1. Procedure for Transactional Checkout
-- Moves items from cart_item to order_item, creates order, and clears cart
CREATE OR REPLACE PROCEDURE process_checkout(p_user_id BIGINT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id BIGINT;
    v_cart_count INT;
BEGIN
    -- Ensure user has items in cart
    SELECT COUNT(*) INTO v_cart_count FROM cart_item WHERE user_id = p_user_id;
    IF v_cart_count = 0 THEN
        RAISE EXCEPTION 'Cart is empty for user %', p_user_id;
    END IF;

    -- Create a new order
    INSERT INTO orders (user_id, status, total_amount, created_at, updated_at)
    VALUES (p_user_id, 'PENDING', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id INTO v_order_id;

    -- Move cart items to order items
    INSERT INTO order_item (order_id, product_id, quantity, price)
    SELECT v_order_id, product_id, quantity, price
    FROM cart_item
    WHERE user_id = p_user_id;

    -- Clear the cart
    DELETE FROM cart_item WHERE user_id = p_user_id;

    -- (Note: trg_calculate_total will automatically update orders.total_amount)
    -- (Note: trg_update_stock will automatically decrement product stock)

    COMMIT;
END;
$$;


-- 2. Function to get category-wise sales report
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
