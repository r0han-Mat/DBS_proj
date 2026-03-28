-- 1. Trigger to update product stock after order item insertion
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if stock is sufficient
    IF (SELECT stock_quantity FROM products WHERE id = NEW.product_id) < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product ID %', NEW.product_id;
    END IF;

    -- Update stock quantity
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock
BEFORE INSERT ON order_item
FOR EACH ROW EXECUTE FUNCTION update_stock_after_order();


-- 2. Trigger to calculate order total amount automatically
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

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_total
AFTER INSERT OR UPDATE OR DELETE ON order_item
FOR EACH ROW EXECUTE FUNCTION calculate_order_total();
