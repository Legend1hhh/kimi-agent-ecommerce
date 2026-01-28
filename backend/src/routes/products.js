import { Router, errorResponse, successResponse } from '../utils/router';

const router = new Router();

// Get all products
router.get('/', async (context) => {
  const { url, env } = context;
  
  try {
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const offset = (page - 1) * limit;
    
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'featured';
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    
    const params = [];
    
    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }
    
    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (minPrice) {
      query += ` AND p.price >= ?`;
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(parseFloat(maxPrice));
    }
    
    if (featured === 'true') {
      query += ` AND p.is_featured = 1`;
    }
    
    // Sorting
    const sortOptions = {
      'featured': 'p.is_featured DESC, p.created_at DESC',
      'newest': 'p.created_at DESC',
      'price-low': 'p.price ASC',
      'price-high': 'p.price DESC',
      'rating': 'p.rating DESC',
      'bestselling': 'p.sold_count DESC'
    };
    
    query += ` ORDER BY ${sortOptions[sort] || sortOptions.featured}`;
    
    // Count total
    const countQuery = query.replace('SELECT p.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(*) as total');
    const countResult = await env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult?.total || 0;
    
    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const { results } = await env.DB.prepare(query).bind(...params).all();
    
    // Format products
    const products = results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      price: row.price,
      comparePrice: row.compare_price,
      sku: row.sku,
      quantity: row.quantity,
      images: JSON.parse(row.images || '[]'),
      featuredImage: row.featured_image,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      },
      rating: row.rating,
      reviewCount: row.review_count,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    return successResponse({
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    return errorResponse('Failed to fetch products', 500);
  }
});

// Get featured products
router.get('/featured', async (context) => {
  const { env } = context;
  
  try {
    const { results } = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1 AND p.is_featured = 1
      ORDER BY p.created_at DESC
      LIMIT 8
    `).all();
    
    const products = results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      price: row.price,
      comparePrice: row.compare_price,
      sku: row.sku,
      quantity: row.quantity,
      images: JSON.parse(row.images || '[]'),
      featuredImage: row.featured_image,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      },
      rating: row.rating,
      reviewCount: row.review_count,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      createdAt: row.created_at
    }));
    
    return successResponse(products);
    
  } catch (error) {
    console.error('Get featured products error:', error);
    return errorResponse('Failed to fetch featured products', 500);
  }
});

// Get new arrivals
router.get('/new-arrivals', async (context) => {
  const { env } = context;
  
  try {
    const { results } = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.created_at DESC
      LIMIT 4
    `).all();
    
    const products = results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      price: row.price,
      comparePrice: row.compare_price,
      sku: row.sku,
      quantity: row.quantity,
      images: JSON.parse(row.images || '[]'),
      featuredImage: row.featured_image,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      },
      rating: row.rating,
      reviewCount: row.review_count,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      isNew: true,
      createdAt: row.created_at
    }));
    
    return successResponse(products);
    
  } catch (error) {
    console.error('Get new arrivals error:', error);
    return errorResponse('Failed to fetch new arrivals', 500);
  }
});

// Get product by slug
router.get('/:slug', async (context) => {
  const { params, env } = context;
  
  try {
    const row = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.is_active = 1
    `).bind(params.slug).first();
    
    if (!row) {
      return errorResponse('Product not found', 404);
    }
    
    // Get variants
    const { results: variants } = await env.DB.prepare(`
      SELECT * FROM product_variants WHERE product_id = ?
    `).bind(row.id).all();
    
    // Get attributes
    const { results: attributes } = await env.DB.prepare(`
      SELECT * FROM product_attributes WHERE product_id = ?
    `).bind(row.id).all();
    
    const product = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      price: row.price,
      comparePrice: row.compare_price,
      sku: row.sku,
      barcode: row.barcode,
      quantity: row.quantity,
      weight: row.weight,
      images: JSON.parse(row.images || '[]'),
      featuredImage: row.featured_image,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        description: row.category_description
      },
      tags: JSON.parse(row.tags || '[]'),
      attributes: attributes.map(a => ({ name: a.name, value: a.value })),
      variants: variants.map(v => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        quantity: v.quantity,
        options: JSON.parse(v.options || '{}')
      })),
      rating: row.rating,
      reviewCount: row.review_count,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    return successResponse(product);
    
  } catch (error) {
    console.error('Get product error:', error);
    return errorResponse('Failed to fetch product', 500);
  }
});

// Get related products
router.get('/:id/related', async (context) => {
  const { params, env } = context;
  
  try {
    // Get product category first
    const product = await env.DB.prepare(
      'SELECT category_id FROM products WHERE id = ?'
    ).bind(params.id).first();
    
    if (!product) {
      return errorResponse('Product not found', 404);
    }
    
    const { results } = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
      ORDER BY p.created_at DESC
      LIMIT 4
    `).bind(product.category_id, params.id).all();
    
    const products = results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: row.price,
      comparePrice: row.compare_price,
      sku: row.sku,
      quantity: row.quantity,
      featuredImage: row.featured_image,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      },
      rating: row.rating,
      reviewCount: row.review_count
    }));
    
    return successResponse(products);
    
  } catch (error) {
    console.error('Get related products error:', error);
    return errorResponse('Failed to fetch related products', 500);
  }
});

export default router;
