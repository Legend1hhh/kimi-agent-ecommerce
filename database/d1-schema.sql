-- LuxeMarket E-Commerce Database Schema for Cloudflare D1

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    parent_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price REAL NOT NULL,
    compare_price REAL,
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    quantity INTEGER DEFAULT 0,
    weight REAL,
    images TEXT DEFAULT '[]',
    featured_image TEXT,
    category_id TEXT,
    tags TEXT DEFAULT '[]',
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    sold_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_featured INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER DEFAULT 0,
    options TEXT DEFAULT '{}',
    created_at TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product attributes table
CREATE TABLE IF NOT EXISTS product_attributes (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items TEXT DEFAULT '[]',
    coupon_code TEXT,
    discount REAL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    shipping_status TEXT DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'processing', 'shipped', 'delivered')),
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    shipping REAL NOT NULL,
    discount REAL DEFAULT 0,
    total REAL NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    coupon_code TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value REAL NOT NULL,
    min_order_amount REAL,
    max_uses INTEGER,
    uses INTEGER DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    is_verified INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    is_default INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
