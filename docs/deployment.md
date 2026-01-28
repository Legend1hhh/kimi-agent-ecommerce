# LuxeMarket Deployment Guide

This guide will walk you through deploying the LuxeMarket e-commerce platform to Cloudflare.

## Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) 18+ installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

## Project Structure

```
ecommerce-cloudflare/
├── frontend/           # Customer-facing React app
├── backend/            # Cloudflare Workers API
├── database/           # SQL schemas and seed data
└── docs/              # Documentation
```

## Step 1: Deploy the Backend API

### 1.1 Create D1 Database

```bash
cd backend

# Create a new D1 database
wrangler d1 create luxemarket-db

# Note the database_id from the output and update wrangler.toml
```

### 1.2 Update wrangler.toml

Edit `backend/wrangler.toml` and update:
- `database_id` with the ID from step 1.1
- `JWT_SECRET` with a secure random string

```toml
[[d1_databases]]
binding = "DB"
database_name = "luxemarket-db"
database_id = "your-actual-database-id"

[vars]
JWT_SECRET = "your-super-secret-jwt-key-min-32-chars"
```

### 1.3 Run Database Migrations

```bash
# Create tables
wrangler d1 execute luxemarket-db --file=../database/d1-schema.sql

# Seed with sample data
wrangler d1 execute luxemarket-db --file=../database/seed.sql
```

### 1.4 Create R2 Storage Bucket

```bash
# Create R2 bucket for file storage
wrangler r2 bucket create luxemarket-storage
```

### 1.5 Deploy the API

```bash
# Deploy to production
wrangler deploy --env production

# Or deploy to staging first
wrangler deploy --env staging
```

Your API will be available at: `https://luxemarket-api.your-subdomain.workers.dev`

## Step 2: Deploy the Frontend

### 2.1 Update Environment Variables

Create `frontend/.env.production`:

```env
VITE_API_URL=https://luxemarket-api.your-subdomain.workers.dev
```

### 2.2 Build the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 2.3 Deploy to Cloudflare Pages

#### Option A: Using Wrangler

```bash
# Deploy to Pages
wrangler pages deploy dist --project-name=luxemarket-frontend
```

#### Option B: Using Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. In Cloudflare Dashboard, go to **Pages** > **Create a project**
3. Connect your Git repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `frontend`
5. Add environment variable:
   - `VITE_API_URL` = your API URL
6. Click **Save and Deploy**

### 2.4 Configure Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to your project
2. Click **Custom domains**
3. Add your domain (e.g., `luxemarket.com`)
4. Follow the DNS configuration instructions

## Step 3: Post-Deployment Configuration

### 3.1 Set Up Stripe for Payments (Optional)

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add to Wrangler secrets:

```bash
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_PUBLISHABLE_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
```

### 3.2 Configure Email Service (Optional)

For order confirmations and notifications:

```bash
# Add SendGrid API key
wrangler secret put SENDGRID_API_KEY

# Or Resend API key
wrangler secret put RESEND_API_KEY
```

### 3.3 Set Up Analytics

Add Google Analytics or Cloudflare Web Analytics to track:
- Page views
- Conversion rates
- User behavior

## Step 4: Admin Dashboard Setup

The admin dashboard is included in the frontend. To access it:

1. Create an admin user in the database:

```sql
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
VALUES (
  'admin-001',
  'admin@yourdomain.com',
  '$2a$10$YourHashedPassword', -- Use bcrypt hash
  'Admin',
  'User',
  'admin',
  datetime('now'),
  datetime('now')
);
```

2. Access the admin panel at: `https://your-domain.com/admin`

## Environment Variables Reference

### Backend (Wrangler Secrets)

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `STRIPE_SECRET_KEY` | Stripe API secret key | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | No |
| `SENDGRID_API_KEY` | SendGrid API key for emails | No |
| `RESEND_API_KEY` | Resend API key for emails | No |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |

## Troubleshooting

### Database Connection Issues

```bash
# Verify database exists
wrangler d1 list

# Check database schema
wrangler d1 execute luxemarket-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### API Not Responding

```bash
# Check logs
wrangler tail

# Verify deployment
wrangler deploy --dry-run
```

### CORS Errors

Update `backend/src/middlewares/cors.js` with your frontend domain:

```javascript
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-frontend-domain.com',
  // ...
};
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Enable Cloudflare WAF
- [ ] Set up DDoS protection
- [ ] Regular security audits

## Scaling Considerations

### Database
- D1 has read replication across Cloudflare's edge
- Consider caching frequently accessed data in KV
- Use pagination for large datasets

### Storage
- R2 has no egress fees
- Use image optimization for product photos
- Implement CDN caching

### API
- Workers auto-scale based on demand
- Use caching headers for static responses
- Implement request deduplication

## Monitoring & Logging

1. Set up Cloudflare Analytics
2. Configure custom metrics
3. Set up alerting for errors
4. Monitor database performance

## Backup Strategy

1. Regular D1 database exports:
```bash
wrangler d1 export luxemarket-db --output=backup.sql
```

2. R2 bucket versioning for files

3. Store backups in multiple locations

## Support

For issues and questions:
- Check Cloudflare documentation: https://developers.cloudflare.com/
- Review Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- D1 documentation: https://developers.cloudflare.com/d1/

---

**Note:** Remember to update all placeholder values (your-subdomain, your-domain, etc.) with your actual values before deployment.
