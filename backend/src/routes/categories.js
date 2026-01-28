import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Get all categories
router.get('/', async (context) => {
  const { env } = context;
  
  try {
    const { results } = await env.DB.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();
    
    const categories = results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image,
      parentId: row.parent_id,
      productCount: row.product_count
    }));
    
    return successResponse(categories);
    
  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
});

// Get category by slug
router.get('/:slug', async (context) => {
  const { params, env } = context;
  
  try {
    const row = await env.DB.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      WHERE c.slug = ?
      GROUP BY c.id
    `).bind(params.slug).first();
    
    if (!row) {
      return errorResponse('Category not found', 404);
    }
    
    return successResponse({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image,
      parentId: row.parent_id,
      productCount: row.product_count
    });
    
  } catch (error) {
    console.error('Get category error:', error);
    return errorResponse('Failed to fetch category', 500);
  }
});

// Get category tree
router.get('/tree', async (context) => {
  const { env } = context;
  
  try {
    const { results } = await env.DB.prepare(`
      SELECT * FROM categories ORDER BY parent_id, name
    `).all();
    
    // Build tree structure
    const categories = results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      image: row.image,
      parentId: row.parent_id,
      children: []
    }));
    
    const tree = [];
    const map = {};
    
    categories.forEach(cat => {
      map[cat.id] = cat;
    });
    
    categories.forEach(cat => {
      if (cat.parentId && map[cat.parentId]) {
        map[cat.parentId].children.push(cat);
      } else {
        tree.push(cat);
      }
    });
    
    return successResponse(tree);
    
  } catch (error) {
    console.error('Get category tree error:', error);
    return errorResponse('Failed to fetch category tree', 500);
  }
});

export default router;
