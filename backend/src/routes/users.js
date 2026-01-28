import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Get all users (admin only)
router.get('/', async (context) => {
  const { url, env, user } = context;
  
  try {
    if (user.role !== 'admin') {
      return errorResponse('Admin access required', 403);
    }
    
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    
    const countResult = await env.DB.prepare(
      'SELECT COUNT(*) as total FROM users WHERE role = ?'
    ).bind('customer').first();
    
    const total = countResult?.total || 0;
    
    const { results } = await env.DB.prepare(`
      SELECT id, email, first_name, last_name, phone, avatar, created_at
      FROM users
      WHERE role = 'customer'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    const users = results.map(row => ({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      avatar: row.avatar,
      createdAt: row.created_at
    }));
    
    return successResponse({
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    return errorResponse('Failed to fetch users', 500);
  }
});

// Get user by ID
router.get('/:id', async (context) => {
  const { params, env, user } = context;
  
  try {
    // Users can only view their own profile unless admin
    if (user.role !== 'admin' && user.userId !== params.id) {
      return errorResponse('Access denied', 403);
    }
    
    const row = await env.DB.prepare(`
      SELECT id, email, first_name, last_name, phone, avatar, role, created_at
      FROM users WHERE id = ?
    `).bind(params.id).first();
    
    if (!row) {
      return errorResponse('User not found', 404);
    }
    
    return successResponse({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      avatar: row.avatar,
      role: row.role,
      createdAt: row.created_at
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse('Failed to fetch user', 500);
  }
});

export default router;
