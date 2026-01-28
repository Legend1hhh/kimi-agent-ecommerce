import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Validate coupon
router.post('/validate', async (context) => {
  const { request, env } = context;
  
  try {
    const { code, orderAmount } = await request.json();
    
    if (!code) {
      return errorResponse('Coupon code is required');
    }
    
    const coupon = await env.DB.prepare(`
      SELECT * FROM coupons 
      WHERE code = ? 
      AND is_active = 1
      AND (start_date IS NULL OR start_date <= date('now'))
      AND (end_date IS NULL OR end_date >= date('now'))
    `).bind(code).first();
    
    if (!coupon) {
      return errorResponse('Invalid or expired coupon code');
    }
    
    if (coupon.max_uses && coupon.uses >= coupon.max_uses) {
      return errorResponse('Coupon has reached maximum uses');
    }
    
    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
      return errorResponse(`Minimum order amount of $${coupon.min_order_amount} required`);
    }
    
    return successResponse({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.min_order_amount,
      maxUses: coupon.max_uses,
      uses: coupon.uses
    });
    
  } catch (error) {
    console.error('Validate coupon error:', error);
    return errorResponse('Failed to validate coupon', 500);
  }
});

export default router;
