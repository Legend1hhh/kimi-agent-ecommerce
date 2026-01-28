import type { 
  User, Product, Category, Cart, Order, Coupon, Review, 
  Address, ShippingMethod, ApiResponse, PaginatedResponse, 
  PaginationParams 
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yourstore.com';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchWithAuth<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) =>
    fetchWithAuth<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchWithAuth<void>('/auth/logout', {
      method: 'POST',
    }),

  getProfile: () =>
    fetchWithAuth<User>('/auth/profile'),

  updateProfile: (data: Partial<User>) =>
    fetchWithAuth<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchWithAuth<void>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  forgotPassword: (email: string) =>
    fetchWithAuth<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    fetchWithAuth<void>(`/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// Products API
export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return fetchWithAuth<PaginatedResponse<Product>>(`/products?${queryParams}`);
  },

  getBySlug: (slug: string) =>
    fetchWithAuth<Product>(`/products/${slug}`),

  getById: (id: string) =>
    fetchWithAuth<Product>(`/products/id/${id}`),

  getFeatured: () =>
    fetchWithAuth<Product[]>('/products/featured'),

  getNewArrivals: () =>
    fetchWithAuth<Product[]>('/products/new-arrivals'),

  getRelated: (productId: string) =>
    fetchWithAuth<Product[]>(`/products/${productId}/related`),
};

// Categories API
export const categoriesApi = {
  getAll: () =>
    fetchWithAuth<Category[]>('/categories'),

  getBySlug: (slug: string) =>
    fetchWithAuth<Category>(`/categories/${slug}`),

  getTree: () =>
    fetchWithAuth<Category[]>('/categories/tree'),
};

// Cart API (for server-side cart sync)
export const cartApi = {
  get: () =>
    fetchWithAuth<Cart>('/cart'),

  sync: (cart: Cart) =>
    fetchWithAuth<Cart>('/cart/sync', {
      method: 'POST',
      body: JSON.stringify(cart),
    }),

  clear: () =>
    fetchWithAuth<void>('/cart', {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersApi = {
  getAll: (params?: PaginationParams) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return fetchWithAuth<PaginatedResponse<Order>>(`/orders?${queryParams}`);
  },

  getById: (id: string) =>
    fetchWithAuth<Order>(`/orders/${id}`),

  getByNumber: (orderNumber: string) =>
    fetchWithAuth<Order>(`/orders/number/${orderNumber}`),

  create: (data: {
    items: { productId: string; quantity: number; variantId?: string }[];
    shippingAddress: Address;
    billingAddress: Address;
    shippingMethodId: string;
    paymentMethodId?: string;
    couponCode?: string;
    notes?: string;
  }) =>
    fetchWithAuth<{ order: Order; clientSecret?: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancel: (id: string) =>
    fetchWithAuth<Order>(`/orders/${id}/cancel`, {
      method: 'POST',
    }),

  track: (orderNumber: string) =>
    fetchWithAuth<{ status: string; trackingNumber?: string; events: any[] }>(
      `/orders/track/${orderNumber}`
    ),
};

// Coupon API
export const couponApi = {
  validate: (code: string, orderAmount: number) =>
    fetchWithAuth<Coupon>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount }),
    }),
};

// Reviews API
export const reviewsApi = {
  getByProduct: (productId: string, params?: PaginationParams) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return fetchWithAuth<PaginatedResponse<Review>>(`/reviews/product/${productId}?${queryParams}`);
  },

  create: (data: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }) =>
    fetchWithAuth<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyReviews: () =>
    fetchWithAuth<Review[]>('/reviews/my'),
};

// Address API
export const addressApi = {
  getAll: () =>
    fetchWithAuth<Address[]>('/addresses'),

  create: (data: Omit<Address, 'id'>) =>
    fetchWithAuth<Address>('/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Address>) =>
    fetchWithAuth<Address>(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchWithAuth<void>(`/addresses/${id}`, {
      method: 'DELETE',
    }),

  setDefault: (id: string) =>
    fetchWithAuth<Address>(`/addresses/${id}/default`, {
      method: 'PUT',
    }),
};

// Shipping API
export const shippingApi = {
  getMethods: () =>
    fetchWithAuth<ShippingMethod[]>('/shipping/methods'),

  calculate: (data: {
    items: { productId: string; quantity: number }[];
    address: Address;
  }) =>
    fetchWithAuth<{ methods: ShippingMethod[] }>('/shipping/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Payment API
export const paymentApi = {
  createPaymentIntent: (orderId: string) =>
    fetchWithAuth<{ clientSecret: string }>(`/payments/intent`, {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),

  confirmPayment: (paymentIntentId: string) =>
    fetchWithAuth<void>(`/payments/confirm`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    }),

  getMethods: () =>
    fetchWithAuth<any[]>('/payments/methods'),

  addMethod: (data: {
    type: string;
    token: string;
    isDefault?: boolean;
  }) =>
    fetchWithAuth<void>('/payments/methods', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  removeMethod: (id: string) =>
    fetchWithAuth<void>(`/payments/methods/${id}`, {
      method: 'DELETE',
    }),
};

// Wishlist API
export const wishlistApi = {
  getAll: () =>
    fetchWithAuth<{ id: string; product: Product }[]>('/wishlist'),

  add: (productId: string) =>
    fetchWithAuth<void>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  remove: (productId: string) =>
    fetchWithAuth<void>(`/wishlist/${productId}`, {
      method: 'DELETE',
    }),

  check: (productId: string) =>
    fetchWithAuth<{ isInWishlist: boolean }>(`/wishlist/check/${productId}`),
};

// Search API
export const searchApi = {
  search: (query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
  }) => {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    return fetchWithAuth<{
      products: Product[];
      categories: Category[];
      suggestions: string[];
    }>(`/search?${params}`);
  },

  getSuggestions: (query: string) =>
    fetchWithAuth<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`),
};

// Analytics API (for admin)
export const analyticsApi = {
  getDashboard: (period: 'day' | 'week' | 'month' | 'year' = 'month') =>
    fetchWithAuth<{
      revenue: number;
      orders: number;
      customers: number;
      products: number;
      chartData: any[];
    }>(`/analytics/dashboard?period=${period}`),

  getSales: (params: { startDate: string; endDate: string }) =>
    fetchWithAuth<any[]>('/analytics/sales', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getTopProducts: (limit: number = 10) =>
    fetchWithAuth<any[]>(`/analytics/top-products?limit=${limit}`),

  getTopCustomers: (limit: number = 10) =>
    fetchWithAuth<any[]>(`/analytics/top-customers?limit=${limit}`),
};
