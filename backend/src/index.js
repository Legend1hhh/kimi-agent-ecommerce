import { Router } from './utils/router';
import { corsHeaders, handleCORS } from './middlewares/cors';
import { authMiddleware } from './middlewares/auth';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import couponRoutes from './routes/coupons';
import reviewRoutes from './routes/reviews';
import analyticsRoutes from './routes/analytics';

// Create router
const router = new Router();

// Global middleware
router.use(handleCORS);

// Public routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/reviews', reviewRoutes);

// Protected routes
router.use('/users', authMiddleware, userRoutes);
router.use('/cart', authMiddleware, cartRoutes);
router.use('/orders', authMiddleware, orderRoutes);
router.use('/coupons', authMiddleware, couponRoutes);
router.use('/analytics', authMiddleware, analyticsRoutes);

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ 
    success: false, 
    message: 'Not Found' 
  }), { 
    status: 404, 
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders
    } 
  });
});

// Main handler
export default {
  async fetch(request, env, ctx) {
    try {
      return await router.handle(request, env, ctx);
    } catch (error) {
      console.error('Unhandled error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Internal Server Error' 
      }), { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      });
    }
  }
};
