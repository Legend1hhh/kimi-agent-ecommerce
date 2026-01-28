import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Get all orders (for user)
router.get('/', async (context) => {
  const { url, env, user } = context;
  
  try {
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    
    // Count total
    const countResult = await env.DB.prepare(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?'
    ).bind(user.userId).first();
    
    const total = countResult?.total || 0;
    
    // Get orders
    const { results } = await env.DB.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(user.userId, limit, offset).all();
    
    // Get order items for each order
    const orders = await Promise.all(results.map(async (order) => {
      const { results: items } = await env.DB.prepare(`
        SELECT oi.*, p.slug, p.images
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).bind(order.id).all();
      
      return {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        shippingStatus: order.shipping_status,
        items: items.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          quantity: item.quantity,
          image: JSON.parse(item.images || '[]')[0] || ''
        })),
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        discount: order.discount,
        total: order.total,
        trackingNumber: order.tracking_number,
        createdAt: order.created_at
      };
    }));
    
    return successResponse({
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    return errorResponse('Failed to fetch orders', 500);
  }
});

// Get order by ID
router.get('/:id', async (context) => {
  const { params, env, user } = context;
  
  try {
    const order = await env.DB.prepare(`
      SELECT * FROM orders WHERE id = ? AND user_id = ?
    `).bind(params.id, user.userId).first();
    
    if (!order) {
      return errorResponse('Order not found', 404);
    }
    
    // Get order items
    const { results: items } = await env.DB.prepare(`
      SELECT oi.*, p.slug, p.images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).bind(params.id).all();
    
    // Parse shipping address
    const shippingAddress = JSON.parse(order.shipping_address);
    
    return successResponse({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      shippingStatus: order.shipping_status,
      items: items.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        image: JSON.parse(item.images || '[]')[0] || ''
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      shippingAddress,
      trackingNumber: order.tracking_number,
      notes: order.notes,
      createdAt: order.created_at
    });
    
  } catch (error) {
    console.error('Get order error:', error);
    return errorResponse('Failed to fetch order', 500);
  }
});

// Create order
router.post('/', async (context) => {
  const { request, env, user } = context;
  
  try {
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      shippingMethodId, 
      couponCode,
      notes 
    } = await request.json();
    
    // Validate items
    if (!items || items.length === 0) {
      return errorResponse('No items in order');
    }
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await env.DB.prepare(
        'SELECT id, name, price, quantity, images FROM products WHERE id = ?'
      ).bind(item.productId).first();
      
      if (!product) {
        return errorResponse(`Product not found: ${item.productId}`);
      }
      
      if (product.quantity < item.quantity) {
        return errorResponse(`Insufficient stock for ${product.name}`);
      }
      
      const price = product.price;
      subtotal += price * item.quantity;
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        price,
        quantity: item.quantity,
        images: product.images
      });
    }
    
    // Calculate tax and shipping
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 15;
    
    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await env.DB.prepare(
        'SELECT * FROM coupons WHERE code = ? AND is_active = 1'
      ).bind(couponCode).first();
      
      if (coupon && coupon.uses < coupon.max_uses) {
        if (coupon.type === 'percentage') {
          discount = subtotal * (coupon.value / 100);
        } else {
          discount = coupon.value;
        }
        
        // Update coupon uses
        await env.DB.prepare(
          'UPDATE coupons SET uses = uses + 1 WHERE id = ?'
        ).bind(coupon.id).run();
      }
    }
    
    const total = subtotal + tax + shipping - discount;
    
    // Generate order number
    const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
    
    // Create order
    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await env.DB.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, status, payment_status, shipping_status,
        subtotal, tax, shipping, discount, total,
        shipping_address, billing_address, coupon_code, notes, created_at
      ) VALUES (?, ?, ?, 'pending', 'pending', 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      orderNumber,
      user.userId,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      JSON.stringify(shippingAddress),
      JSON.stringify(billingAddress),
      couponCode || null,
      notes || null,
      now
    ).run();
    
    // Create order items
    for (const item of orderItems) {
      await env.DB.prepare(`
        INSERT INTO order_items (id, order_id, product_id, name, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        orderId,
        item.productId,
        item.name,
        item.price,
        item.quantity
      ).run();
      
      // Update product quantity
      await env.DB.prepare(`
        UPDATE products SET quantity = quantity - ? WHERE id = ?
      `).bind(item.quantity, item.productId).run();
    }
    
    return successResponse({
      order: {
        id: orderId,
        orderNumber,
        total,
        status: 'pending'
      }
    }, 'Order created successfully');
    
  } catch (error) {
    console.error('Create order error:', error);
    return errorResponse('Failed to create order', 500);
  }
});

// Cancel order
router.post('/:id/cancel', async (context) => {
  const { params, env, user } = context;
  
  try {
    const order = await env.DB.prepare(`
      SELECT * FROM orders WHERE id = ? AND user_id = ?
    `).bind(params.id, user.userId).first();
    
    if (!order) {
      return errorResponse('Order not found', 404);
    }
    
    if (order.status !== 'pending') {
      return errorResponse('Order cannot be cancelled');
    }
    
    // Update order status
    await env.DB.prepare(`
      UPDATE orders SET status = 'cancelled', updated_at = ? WHERE id = ?
    `).bind(new Date().toISOString(), params.id).run();
    
    // Restore product quantities
    const { results: items } = await env.DB.prepare(`
      SELECT * FROM order_items WHERE order_id = ?
    `).bind(params.id).all();
    
    for (const item of items) {
      await env.DB.prepare(`
        UPDATE products SET quantity = quantity + ? WHERE id = ?
      `).bind(item.quantity, item.product_id).run();
    }
    
    return successResponse(null, 'Order cancelled successfully');
    
  } catch (error) {
    console.error('Cancel order error:', error);
    return errorResponse('Failed to cancel order', 500);
  }
});

export default router;
