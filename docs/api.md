# LuxeMarket API Documentation

## Base URL

```
Production: https://luxemarket-api.your-domain.com
Staging: https://luxemarket-api-staging.your-domain.com
```

## Authentication

Most endpoints require authentication via Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by calling `/auth/login` or `/auth/register`.

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login
Login existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

#### GET /auth/profile
Get current user profile. (Auth required)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "avatar": "https://...",
    "role": "customer",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /auth/profile
Update user profile. (Auth required)

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321"
}
```

#### PUT /auth/change-password
Change password. (Auth required)

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Products

#### GET /products
Get all products with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 12) |
| category | string | Filter by category slug |
| search | string | Search query |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| featured | boolean | Show featured only |
| sort | string | Sort: featured, newest, price-low, price-high, rating |

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [ ...products ],
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

#### GET /products/featured
Get featured products.

#### GET /products/new-arrivals
Get new arrival products.

#### GET /products/:slug
Get single product by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod-uuid",
    "name": "Product Name",
    "slug": "product-slug",
    "description": "Full description...",
    "shortDescription": "Short description",
    "price": 99.99,
    "comparePrice": 129.99,
    "sku": "SKU-001",
    "quantity": 50,
    "images": ["https://..."],
    "featuredImage": "https://...",
    "category": { ... },
    "attributes": [...],
    "variants": [...],
    "rating": 4.5,
    "reviewCount": 128
  }
}
```

#### GET /products/:id/related
Get related products.

### Categories

#### GET /categories
Get all categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "...",
      "image": "https://...",
      "productCount": 25
    }
  ]
}
```

#### GET /categories/:slug
Get category by slug.

#### GET /categories/tree
Get categories as tree structure.

### Cart

#### GET /cart
Get user's cart. (Auth required)

#### POST /cart/sync
Sync cart with server. (Auth required)

**Request:**
```json
{
  "items": [
    {
      "productId": "prod-uuid",
      "quantity": 2,
      "variantId": "variant-uuid"
    }
  ],
  "couponCode": "WELCOME10",
  "discount": 10.00
}
```

#### DELETE /cart
Clear cart. (Auth required)

### Orders

#### GET /orders
Get user's orders. (Auth required)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |

#### GET /orders/:id
Get order details. (Auth required)

#### POST /orders
Create new order. (Auth required)

**Request:**
```json
{
  "items": [
    {
      "productId": "prod-uuid",
      "quantity": 2,
      "variantId": "variant-uuid"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "isDefault": false
  },
  "billingAddress": { ... },
  "shippingMethodId": "standard",
  "couponCode": "WELCOME10",
  "notes": "Please leave at door"
}
```

#### POST /orders/:id/cancel
Cancel an order. (Auth required)

### Coupons

#### POST /coupons/validate
Validate a coupon code. (Auth required)

**Request:**
```json
{
  "code": "WELCOME10",
  "orderAmount": 100.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "coupon-uuid",
    "code": "WELCOME10",
    "type": "percentage",
    "value": 10,
    "minOrderAmount": 50
  }
}
```

### Reviews

#### GET /reviews/product/:productId
Get reviews for a product.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |

#### POST /reviews
Create a review. (Auth required)

**Request:**
```json
{
  "productId": "prod-uuid",
  "rating": 5,
  "title": "Great product!",
  "comment": "I love this product...",
  "images": ["https://..."]
}
```

#### GET /reviews/my
Get user's reviews. (Auth required)

### Analytics (Admin Only)

#### GET /analytics/dashboard
Get dashboard statistics. (Admin only)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | day, week, month, year |

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": 15000.00,
    "orders": 150,
    "customers": 45,
    "products": 120,
    "chartData": [...]
  }
}
```

#### GET /analytics/top-products
Get top selling products. (Admin only)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of products (default: 10) |

#### GET /analytics/top-customers
Get top customers. (Admin only)

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting

API requests are rate-limited:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Webhooks

### Stripe Webhook

Endpoint: `POST /webhooks/stripe`

Events handled:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## SDK & Libraries

### JavaScript/TypeScript

```typescript
// Example API client
const api = {
  async getProducts(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products?${query}`);
    return res.json();
  },
  
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
};
```

---

For more information, visit the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/).
