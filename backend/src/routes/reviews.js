import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Get reviews by product
router.get('/product/:productId', async (context) => {
  const { params, url, env } = context;
  
  try {
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    
    // Count total
    const countResult = await env.DB.prepare(
      'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?'
    ).bind(params.productId).first();
    
    const total = countResult?.total || 0;
    
    // Get reviews
    const { results } = await env.DB.prepare(`
      SELECT r.*, u.first_name, u.last_name, u.avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(params.productId, limit, offset).all();
    
    const reviews = results.map(row => ({
      id: row.id,
      productId: row.product_id,
      userId: row.user_id,
      userName: `${row.first_name} ${row.last_name}`,
      userAvatar: row.avatar,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      images: JSON.parse(row.images || '[]'),
      isVerified: row.is_verified,
      createdAt: row.created_at
    }));
    
    return successResponse({
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Get reviews error:', error);
    return errorResponse('Failed to fetch reviews', 500);
  }
});

// Create review
router.post('/', async (context) => {
  const { request, env, user } = context;
  
  try {
    const { productId, rating, title, comment, images } = await request.json();
    
    // Validation
    if (!productId || !rating || !title || !comment) {
      return errorResponse('Please provide all required fields');
    }
    
    if (rating < 1 || rating > 5) {
      return errorResponse('Rating must be between 1 and 5');
    }
    
    // Check if user has purchased the product
    const hasPurchased = await env.DB.prepare(`
      SELECT 1 FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
      LIMIT 1
    `).bind(user.userId, productId).first();
    
    // Create review
    const reviewId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await env.DB.prepare(`
      INSERT INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      reviewId,
      productId,
      user.userId,
      rating,
      title,
      comment,
      JSON.stringify(images || []),
      hasPurchased ? 1 : 0,
      now
    ).run();
    
    // Update product rating
    const { results: ratingData } = await env.DB.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count
      FROM reviews WHERE product_id = ?
    `).bind(productId).all();
    
    await env.DB.prepare(`
      UPDATE products SET rating = ?, review_count = ? WHERE id = ?
    `).bind(
      ratingData[0].avg_rating,
      ratingData[0].count,
      productId
    ).run();
    
    return successResponse({
      id: reviewId,
      productId,
      rating,
      title,
      comment,
      isVerified: hasPurchased ? 1 : 0,
      createdAt: now
    }, 'Review created successfully');
    
  } catch (error) {
    console.error('Create review error:', error);
    return errorResponse('Failed to create review', 500);
  }
});

// Get my reviews
router.get('/my', async (context) => {
  const { env, user } = context;
  
  try {
    const { results } = await env.DB.prepare(`
      SELECT r.*, p.name as product_name, p.slug as product_slug, p.featured_image
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `).bind(user.userId).all();
    
    const reviews = results.map(row => ({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      productSlug: row.product_slug,
      productImage: row.featured_image,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      createdAt: row.created_at
    }));
    
    return successResponse(reviews);
    
  } catch (error) {
    console.error('Get my reviews error:', error);
    return errorResponse('Failed to fetch reviews', 500);
  }
});

export default router;
