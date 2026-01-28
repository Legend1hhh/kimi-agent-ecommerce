# LuxeMarket Database Documentation

## Overview

LuxeMarket uses Cloudflare D1, a serverless SQL database built on SQLite. This document describes the database schema, relationships, and usage patterns.

## Entity Relationship Diagram

```
users ||--o{ orders : places
users ||--o{ carts : has
users ||--o{ reviews : writes
users ||--o{ addresses : has
users ||--o{ wishlists : has
users ||--o{ admin_logs : generates

categories ||--o{ products : contains
products ||--o{ order_items : included_in
products ||--o{ reviews : has
products ||o{ product_variants : has
products ||o{ product_attributes : has
products ||--o{ wishlists : in

orders ||--o{ order_items : contains
orders ||--o{ coupons : uses

carts }o--|| users : belongs_to
```

## Tables

### users

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| email | TEXT | UNIQUE, NOT NULL | User email address |
| password | TEXT | NOT NULL | Hashed password |
| first_name | TEXT | NOT NULL | First name |
| last_name | TEXT | NOT NULL | Last name |
| phone | TEXT | | Phone number |
| avatar | TEXT | | Profile image URL |
| role | TEXT | DEFAULT 'customer' | User role (customer/admin) |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Indexes:**
- `email` (UNIQUE)

### categories

Product categories for organization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| name | TEXT | NOT NULL | Category name |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | | Category description |
| image | TEXT | | Category image URL |
| parent_id | TEXT | | Parent category ID |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Indexes:**
- `slug` (UNIQUE)

### products

Core product information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| name | TEXT | NOT NULL | Product name |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | | Full description |
| short_description | TEXT | | Brief summary |
| price | REAL | NOT NULL | Current price |
| compare_price | REAL | | Original price for sales |
| sku | TEXT | UNIQUE, NOT NULL | Stock keeping unit |
| barcode | TEXT | | Product barcode |
| quantity | INTEGER | DEFAULT 0 | Stock quantity |
| weight | REAL | | Product weight in kg |
| images | TEXT | DEFAULT '[]' | JSON array of image URLs |
| featured_image | TEXT | | Primary product image |
| category_id | TEXT | | Category reference |
| tags | TEXT | DEFAULT '[]' | JSON array of tags |
| rating | REAL | DEFAULT 0 | Average rating |
| review_count | INTEGER | DEFAULT 0 | Number of reviews |
| sold_count | INTEGER | DEFAULT 0 | Units sold |
| is_active | INTEGER | DEFAULT 1 | Product visibility |
| is_featured | INTEGER | DEFAULT 0 | Featured product flag |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Indexes:**
- `slug` (UNIQUE)
- `sku` (UNIQUE)
- `category_id`
- `is_active`

### product_variants

Product variants (size, color, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| product_id | TEXT | NOT NULL | Parent product |
| name | TEXT | NOT NULL | Variant name |
| sku | TEXT | UNIQUE, NOT NULL | Variant SKU |
| price | REAL | NOT NULL | Variant price |
| quantity | INTEGER | DEFAULT 0 | Stock quantity |
| options | TEXT | DEFAULT '{}' | JSON options object |
| created_at | TEXT | NOT NULL | Creation timestamp |

**Indexes:**
- `product_id`

### product_attributes

Product specifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| product_id | TEXT | NOT NULL | Parent product |
| name | TEXT | NOT NULL | Attribute name |
| value | TEXT | NOT NULL | Attribute value |
| created_at | TEXT | NOT NULL | Creation timestamp |

**Indexes:**
- `product_id`

### carts

User shopping carts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| user_id | TEXT | NOT NULL | Cart owner |
| items | TEXT | DEFAULT '[]' | JSON cart items |
| coupon_code | TEXT | | Applied coupon |
| discount | REAL | DEFAULT 0 | Discount amount |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Indexes:**
- `user_id`

### orders

Customer orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| order_number | TEXT | UNIQUE, NOT NULL | Human-readable order ID |
| user_id | TEXT | NOT NULL | Order owner |
| status | TEXT | DEFAULT 'pending' | Order status |
| payment_status | TEXT | DEFAULT 'pending' | Payment status |
| shipping_status | TEXT | DEFAULT 'pending' | Shipping status |
| subtotal | REAL | NOT NULL | Items total |
| tax | REAL | NOT NULL | Tax amount |
| shipping | REAL | NOT NULL | Shipping cost |
| discount | REAL | DEFAULT 0 | Discount applied |
| total | REAL | NOT NULL | Final total |
| shipping_address | TEXT | NOT NULL | JSON address |
| billing_address | TEXT | NOT NULL | JSON address |
| coupon_code | TEXT | | Applied coupon |
| tracking_number | TEXT | | Shipping tracking |
| notes | TEXT | | Customer notes |
| created_at | TEXT | NOT NULL | Order date |
| updated_at | TEXT | NOT NULL | Last update |

**Indexes:**
- `order_number` (UNIQUE)
- `user_id`
- `status`

### order_items

Individual items within an order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| order_id | TEXT | NOT NULL | Parent order |
| product_id | TEXT | NOT NULL | Product reference |
| name | TEXT | NOT NULL | Product name at time of order |
| price | REAL | NOT NULL | Price at time of order |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| created_at | TEXT | NOT NULL | Creation timestamp |

**Indexes:**
- `order_id`
- `product_id`

### coupons

Discount coupons.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| code | TEXT | UNIQUE, NOT NULL | Coupon code |
| type | TEXT | NOT NULL | 'percentage' or 'fixed' |
| value | REAL | NOT NULL | Discount value |
| min_order_amount | REAL | | Minimum order required |
| max_uses | INTEGER | | Maximum redemptions |
| uses | INTEGER | DEFAULT 0 | Current redemptions |
| start_date | TEXT | | Activation date |
| end_date | TEXT | | Expiration date |
| is_active | INTEGER | DEFAULT 1 | Active status |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Indexes:**
- `code` (UNIQUE)

### reviews

Product reviews.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| product_id | TEXT | NOT NULL | Reviewed product |
| user_id | TEXT | NOT NULL | Review author |
| rating | INTEGER | NOT NULL | 1-5 star rating |
| title | TEXT | NOT NULL | Review title |
| comment | TEXT | NOT NULL | Review content |
| images | TEXT | DEFAULT '[]' | JSON image URLs |
| is_verified | INTEGER | DEFAULT 0 | Verified purchase |
| created_at | TEXT | NOT NULL | Creation timestamp |

**Indexes:**
- `product_id`
- `user_id`

### addresses

User shipping/billing addresses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| user_id | TEXT | NOT NULL | Address owner |
| first_name | TEXT | NOT NULL | Recipient first name |
| last_name | TEXT | NOT NULL | Recipient last name |
| company | TEXT | | Company name |
| address1 | TEXT | NOT NULL | Street address |
| address2 | TEXT | | Apartment, suite, etc. |
| city | TEXT | NOT NULL | City |
| state | TEXT | NOT NULL | State/Province |
| postal_code | TEXT | NOT NULL | ZIP/Postal code |
| country | TEXT | NOT NULL | Country code |
| phone | TEXT | | Contact phone |
| is_default | INTEGER | DEFAULT 0 | Default address flag |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | NOT NULL | Last update timestamp |

**Indexes:**
- `user_id`

### wishlists

User wishlist items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| user_id | TEXT | NOT NULL | Wishlist owner |
| product_id | TEXT | NOT NULL | Wishlisted product |
| created_at | TEXT | NOT NULL | Creation timestamp |

**Indexes:**
- `user_id`
- UNIQUE(user_id, product_id)

### admin_logs

Admin action audit log.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique identifier |
| user_id | TEXT | NOT NULL | Admin user |
| action | TEXT | NOT NULL | Action performed |
| entity_type | TEXT | NOT NULL | Affected entity type |
| entity_id | TEXT | | Affected entity ID |
| details | TEXT | | JSON action details |
| ip_address | TEXT | | Admin IP address |
| created_at | TEXT | NOT NULL | Action timestamp |

**Indexes:**
- `user_id`

## Common Queries

### Get products with category

```sql
SELECT p.*, c.name as category_name, c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = 1
ORDER BY p.created_at DESC;
```

### Get order with items

```sql
SELECT o.*, oi.product_id, oi.name, oi.price, oi.quantity
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = ?;
```

### Get product reviews with user info

```sql
SELECT r.*, u.first_name, u.last_name, u.avatar
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.product_id = ?
ORDER BY r.created_at DESC;
```

### Update product rating

```sql
UPDATE products 
SET rating = (
  SELECT AVG(rating) 
  FROM reviews 
  WHERE product_id = ?
),
review_count = (
  SELECT COUNT(*) 
  FROM reviews 
  WHERE product_id = ?
)
WHERE id = ?;
```

## Migrations

To run migrations:

```bash
# Apply schema
wrangler d1 execute luxemarket-db --file=./database/d1-schema.sql

# Seed data
wrangler d1 execute luxemarket-db --file=./database/seed.sql
```

## Backup & Restore

### Export database

```bash
wrangler d1 export luxemarket-db --output=backup.sql
```

### Import database

```bash
wrangler d1 execute luxemarket-db --file=backup.sql
```

## Performance Tips

1. **Use indexes**: All foreign keys and frequently queried fields are indexed
2. **Limit results**: Always use pagination for large datasets
3. **Cache frequently accessed data**: Use Cloudflare KV for caching
4. **Optimize images**: Store optimized images in R2
5. **Use JSON columns wisely**: Store structured data that doesn't need indexing

## Limits

Cloudflare D1 limits:
- 500MB storage per database (Free tier)
- 100,000 rows read per day (Free tier)
- 50,000 rows written per day (Free tier)

For higher limits, upgrade to Workers Paid plan.

---

For more information, see [Cloudflare D1 documentation](https://developers.cloudflare.com/d1/).
