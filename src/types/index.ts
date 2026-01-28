export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  weight?: number;
  images: string[];
  featuredImage: string;
  categoryId: string;
  category: Category;
  tags: string[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  options: Record<string, string>;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
  attributes?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  uses: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
