import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Get cart
router.get('/', async (context) => {
  const { env, user } = context;
  
  try {
    const cart = await env.DB.prepare(`
      SELECT * FROM carts WHERE user_id = ?
    `).bind(user.userId).first();
    
    if (!cart) {
      return successResponse({
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0
      });
    }
    
    const items = JSON.parse(cart.items || '[]');
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 15;
    const discount = cart.discount || 0;
    const total = subtotal + tax + shipping - discount;
    
    return successResponse({
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      couponCode: cart.coupon_code
    });
    
  } catch (error) {
    console.error('Get cart error:', error);
    return errorResponse('Failed to fetch cart', 500);
  }
});

// Sync cart
router.post('/sync', async (context) => {
  const { request, env, user } = context;
  
  try {
    const { items, couponCode, discount } = await request.json();
    
    const existingCart = await env.DB.prepare(
      'SELECT id FROM carts WHERE user_id = ?'
    ).bind(user.userId).first();
    
    if (existingCart) {
      await env.DB.prepare(`
        UPDATE carts SET items = ?, coupon_code = ?, discount = ?, updated_at = ?
        WHERE user_id = ?
      `).bind(
        JSON.stringify(items),
        couponCode || null,
        discount || 0,
        new Date().toISOString(),
        user.userId
      ).run();
    } else {
      await env.DB.prepare(`
        INSERT INTO carts (id, user_id, items, coupon_code, discount, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        user.userId,
        JSON.stringify(items),
        couponCode || null,
        discount || 0,
        new Date().toISOString(),
        new Date().toISOString()
      ).run();
    }
    
    return successResponse(null, 'Cart synced successfully');
    
  } catch (error) {
    console.error('Sync cart error:', error);
    return errorResponse('Failed to sync cart', 500);
  }
});

// Clear cart
router.delete('/', async (context) => {
  const { env, user } = context;
  
  try {
    await env.DB.prepare(
      'DELETE FROM carts WHERE user_id = ?'
    ).bind(user.userId).run();
    
    return successResponse(null, 'Cart cleared successfully');
    
  } catch (error) {
    console.error('Clear cart error:', error);
    return errorResponse('Failed to clear cart', 500);
  }
});

export default router;
