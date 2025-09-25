-- Add test orders for immediate testing
INSERT INTO orders (user_id, total_amount, status, created_at) VALUES 
(3, 115.00, 'pending', NOW()),
(3, 85.00, 'preparing', NOW() - INTERVAL '5 minutes'),
(3, 45.00, 'ready', NOW() - INTERVAL '10 minutes');

-- Get the order IDs
DO $$
DECLARE
    pending_order_id INTEGER;
    preparing_order_id INTEGER;
    ready_order_id INTEGER;
BEGIN
    SELECT id INTO pending_order_id FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO preparing_order_id FROM orders WHERE status = 'preparing' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO ready_order_id FROM orders WHERE status = 'ready' ORDER BY created_at DESC LIMIT 1;

    -- Add items for pending order
    INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES 
    (pending_order_id, 1, 2, 50.00),  -- 2x Veg Sandwich
    (pending_order_id, 3, 1, 15.00);  -- 1x Masala Chai

    -- Add items for preparing order
    INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES 
    (preparing_order_id, 6, 1, 85.00);  -- 1x Veg Thali

    -- Add items for ready order
    INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES 
    (ready_order_id, 5, 2, 12.00),  -- 2x Samosa
    (ready_order_id, 8, 1, 20.00);  -- 1x Cold Drink
END $$;