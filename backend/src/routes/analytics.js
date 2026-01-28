import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Get dashboard stats
router.get('/dashboard', async (context) => {
  const { url, env, user } = context;
  
  try {
    // Check if user is admin
    if (user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }
    
    const searchParams = url.searchParams;
    const period = searchParams.get('period') || 'month';
    
    // Get date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    // Get total revenue
    const revenueResult = await env.DB.prepare(`
      SELECT COALESCE(SUM(total), 0) as total
      FROM orders
      WHERE created_at >= ? AND status != 'cancelled'
    `).bind(startDate.toISOString()).first();
    
    // Get total orders
    const ordersResult = await env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM orders
      WHERE created_at >= ? AND status != 'cancelled'
    `).bind(startDate.toISOString()).first();
    
    // Get total customers
    const customersResult = await env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM users
      WHERE role = 'customer' AND created_at >= ?
    `).bind(startDate.toISOString()).first();
    
    // Get total products
    const productsResult = await env.DB.prepare(`
      SELECT COUNT(*) as total FROM products WHERE is_active = 1
    `).first();
    
    // Get chart data (daily revenue for the period)
    const { results: chartData } = await env.DB.prepare(`
      SELECT 
        date(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE created_at >= ? AND status != 'cancelled'
      GROUP BY date(created_at)
      ORDER BY date
    `).bind(startDate.toISOString()).all();
    
    return successResponse({
      revenue: revenueResult?.total || 0,
      orders: ordersResult?.total || 0,
      customers: customersResult?.total || 0,
      products: productsResult?.total || 0,
      chartData: chartData.map(row => ({
        date: row.date,
        orders: row.orders,
        revenue: row.revenue
      }))
    });
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return errorResponse('Failed to fetch dashboard stats', 500);
  }
});

// Get top products
router.get('/top-products', async (context) => {
  const { url, env, user } = context;
  
  try {
    if (user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }
    
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    
    const { results } = await env.DB.prepare(`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.featured_image,
        p.price,
        SUM(oi.quantity) as total_sold,
        SUM(oi.price * oi.quantity) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT ?
    `).bind(limit).all();
    
    return successResponse(results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      image: row.featured_image,
      price: row.price,
      totalSold: row.total_sold,
      totalRevenue: row.total_revenue
    })));
    
  } catch (error) {
    console.error('Get top products error:', error);
    return errorResponse('Failed to fetch top products', 500);
  }
});

// Get top customers
router.get('/top-customers', async (context) => {
  const { url, env, user } = context;
  
  try {
    if (user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }
    
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    
    const { results } = await env.DB.prepare(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(o.id) as total_orders,
        SUM(o.total) as total_spent
      FROM users u
      JOIN orders o ON u.id = o.user_id
      WHERE o.status != 'cancelled'
      GROUP BY u.id
      ORDER BY total_spent DESC
      LIMIT ?
    `).bind(limit).all();
    
    return successResponse(results.map(row => ({
      id: row.id,
      name: `${row.first_name} ${row.last_name}`,
      email: row.email,
      totalOrders: row.total_orders,
      totalSpent: row.total_spent
    })));
    
  } catch (error) {
    console.error('Get top customers error:', error);
    return errorResponse('Failed to fetch top customers', 500);
  }
});

export default router;
