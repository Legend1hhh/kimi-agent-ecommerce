-- Seed data for LuxeMarket E-Commerce

-- Admin user (password: admin123)
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) VALUES
('admin-001', 'admin@luxemarket.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User', 'admin', datetime('now'), datetime('now'));

-- Categories
INSERT INTO categories (id, name, slug, description, image, created_at, updated_at) VALUES
('cat-001', 'Electronics', 'electronics', 'Latest gadgets and electronic devices', 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400', datetime('now'), datetime('now')),
('cat-002', 'Fashion', 'fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', datetime('now'), datetime('now')),
('cat-003', 'Home & Living', 'home-living', 'Everything for your home', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400', datetime('now'), datetime('now')),
('cat-004', 'Sports & Outdoors', 'sports-outdoors', 'Gear for an active lifestyle', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', datetime('now'), datetime('now')),
('cat-005', 'Beauty & Health', 'beauty-health', 'Personal care and wellness products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', datetime('now'), datetime('now')),
('cat-006', 'Books & Media', 'books-media', 'Books, movies, and entertainment', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', datetime('now'), datetime('now'));

-- Products
INSERT INTO products (id, name, slug, description, short_description, price, compare_price, sku, quantity, images, featured_image, category_id, is_featured, rating, review_count, created_at, updated_at) VALUES
('prod-001', 'Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones', 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Features comfortable over-ear design and built-in microphone for calls.', 'Premium wireless headphones with ANC', 149.99, 199.99, 'WH-001', 50, '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"]', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'cat-001', 1, 4.5, 128, datetime('now'), datetime('now')),

('prod-002', 'Smart Watch Pro', 'smart-watch-pro', 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50 meters.', 'Advanced fitness tracking smartwatch', 299.99, 349.99, 'SW-001', 35, '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"]', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'cat-001', 1, 4.8, 256, datetime('now'), datetime('now')),

('prod-003', 'Minimalist Leather Backpack', 'minimalist-leather-backpack', 'Handcrafted genuine leather backpack with laptop compartment, multiple pockets, and adjustable straps. Perfect for work or travel.', 'Handcrafted genuine leather backpack', 189.99, NULL, 'BP-001', 25, '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"]', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 'cat-002', 1, 4.6, 89, datetime('now'), datetime('now')),

('prod-004', 'Designer Sunglasses', 'designer-sunglasses', 'UV400 protection sunglasses with polarized lenses and premium acetate frames. Comes with protective case and cleaning cloth.', 'UV400 polarized sunglasses', 129.99, 179.99, 'SG-001', 40, '["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"]', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', 'cat-002', 0, 4.3, 67, datetime('now'), datetime('now')),

('prod-005', 'Modern Table Lamp', 'modern-table-lamp', 'Elegant table lamp with adjustable brightness and USB charging port. Features energy-efficient LED bulb and touch controls.', 'Elegant lamp with USB charging', 79.99, NULL, 'TL-001', 60, '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"]', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 'cat-003', 1, 4.7, 156, datetime('now'), datetime('now')),

('prod-006', 'Ceramic Coffee Mug Set', 'ceramic-coffee-mug-set', 'Set of 4 handcrafted ceramic mugs in assorted colors. Microwave and dishwasher safe. Perfect for your morning coffee.', 'Set of 4 handcrafted ceramic mugs', 39.99, 49.99, 'CM-001', 100, '["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600"]', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600', 'cat-003', 0, 4.9, 312, datetime('now'), datetime('now')),

('prod-007', 'Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick, non-slip yoga mat with alignment lines. Made from eco-friendly TPE material. Includes carrying strap.', 'Extra thick non-slip yoga mat', 49.99, NULL, 'YM-001', 75, '["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"]', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', 'cat-004', 1, 4.8, 203, datetime('now'), datetime('now')),

('prod-008', 'Running Shoes', 'running-shoes', 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Available in multiple colors.', 'Lightweight responsive running shoes', 119.99, 149.99, 'RS-001', 45, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'cat-004', 1, 4.5, 178, datetime('now'), datetime('now')),

('prod-009', 'Organic Skincare Set', 'organic-skincare-set', 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Made with natural organic ingredients.', 'Complete organic skincare routine', 89.99, NULL, 'SS-001', 30, '["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"]', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', 'cat-005', 1, 4.7, 145, datetime('now'), datetime('now')),

('prod-010', 'Bestseller Novel Collection', 'bestseller-novel-collection', 'Collection of 5 bestselling novels from award-winning authors. Perfect for book lovers.', '5 bestselling novels collection', 59.99, 79.99, 'BK-001', 20, '["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600"]', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 'cat-006', 0, 4.6, 89, datetime('now'), datetime('now'));

-- Coupons
INSERT INTO coupons (id, code, type, value, min_order_amount, max_uses, uses, start_date, end_date, is_active, created_at, updated_at) VALUES
('coupon-001', 'WELCOME10', 'percentage', 10, 50, 1000, 0, datetime('now'), datetime('now', '+1 year'), 1, datetime('now'), datetime('now')),
('coupon-002', 'SAVE20', 'percentage', 20, 100, 500, 0, datetime('now'), datetime('now', '+6 months'), 1, datetime('now'), datetime('now')),
('coupon-003', 'FLAT50', 'fixed', 50, 200, 200, 0, datetime('now'), datetime('now', '+3 months'), 1, datetime('now'), datetime('now'));
