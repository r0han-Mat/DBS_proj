-- 1. Create Audit Log Table
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

-- 2. Trigger for Product Price/Name Audit
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

CREATE TRIGGER trg_product_audit
AFTER UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION audit_product_changes();
