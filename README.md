# LuxeMarket - Premium E-Commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, and Cloudflare Workers.

![LuxeMarket](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200)

## Features

### Customer Store
- 🛍️ **Product Catalog** - Browse products with filtering, sorting, and search
- 🛒 **Shopping Cart** - Add/remove items, apply coupons, persistent cart
- 💳 **Checkout** - Multi-step checkout with shipping and payment options
- 👤 **User Accounts** - Registration, login, profile management
- 📦 **Order Tracking** - View order history and track shipments
- ⭐ **Reviews** - Write and read product reviews
- ❤️ **Wishlist** - Save favorite products for later
- 🔍 **Search** - Full-text search with suggestions
- 📱 **Responsive** - Works on all devices

### Admin Dashboard
- 📊 **Analytics** - Sales reports, top products, customer insights
- 📦 **Product Management** - Add, edit, delete products
- 📋 **Order Management** - Process and fulfill orders
- 👥 **Customer Management** - View customer data
- 🏷️ **Coupon Management** - Create and manage discount codes
- ⚙️ **Settings** - Configure store settings

### Backend API
- 🔐 **Authentication** - JWT-based auth with secure password hashing
- 🛡️ **Security** - CORS, rate limiting, input validation
- 💾 **Database** - Cloudflare D1 (SQLite) for data storage
- 📁 **File Storage** - Cloudflare R2 for images and files
- ⚡ **Edge Computing** - Runs on Cloudflare's global network
- 🔄 **Caching** - Built-in caching with KV

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **Zustand** - State management

### Backend
- **Cloudflare Workers** - Serverless functions
- **D1 Database** - SQLite database
- **R2 Storage** - Object storage
- **KV** - Key-value cache
- **Jose** - JWT handling

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account
- Wrangler CLI

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/luxemarket.git
cd luxemarket
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend
npm install
```

4. **Set up environment variables**
```bash
# Frontend
cd ../frontend
cp .env.example .env.local

# Backend
cd ../backend
cp wrangler.toml.example wrangler.toml
```

5. **Run development servers**
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

## Deployment

### Deploy Backend

```bash
cd backend

# Create D1 database
wrangler d1 create luxemarket-db

# Run migrations
wrangler d1 execute luxemarket-db --file=../database/d1-schema.sql

# Deploy
wrangler deploy
```

### Deploy Frontend

```bash
cd frontend

# Build
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=luxemarket
```

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md).

## Project Structure

```
luxemarket/
├── frontend/              # Customer-facing React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
├── backend/               # Cloudflare Workers API
│   └── src/
│       ├── routes/        # API route handlers
│       ├── middlewares/   # Auth, CORS, etc.
│       ├── utils/         # Utilities
│       └── index.js       # Entry point
│
├── database/              # Database schemas
│   ├── d1-schema.sql      # Main schema
│   └── seed.sql           # Sample data
│
└── docs/                  # Documentation
    ├── deployment.md      # Deployment guide
    ├── api.md             # API documentation
    └── database.md        # Database documentation
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile

### Products
- `GET /products` - List products
- `GET /products/:slug` - Get product details
- `GET /products/featured` - Get featured products

### Cart
- `GET /cart` - Get cart
- `POST /cart/sync` - Sync cart

### Orders
- `GET /orders` - List orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details

For complete API documentation, see [docs/api.md](docs/api.md).

## Database Schema

The database uses Cloudflare D1 (SQLite) with the following main tables:

- **users** - Customer and admin accounts
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Order line items
- **carts** - Shopping carts
- **reviews** - Product reviews
- **coupons** - Discount codes

For detailed schema documentation, see [docs/database.md](docs/database.md).

## Environment Variables

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

### Backend
| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret for JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `SENDGRID_API_KEY` | SendGrid API key |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@luxemarket.com or open an issue on GitHub.

## Acknowledgments

- [Cloudflare](https://cloudflare.com) for the amazing platform
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Tailwind CSS](https://tailwindcss.com) for the styling system

---

Built with ❤️ by the LuxeMarket Team
