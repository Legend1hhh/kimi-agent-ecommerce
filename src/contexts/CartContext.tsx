import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Cart, CartItem, Product } from '@/types';
import { couponApi } from '@/services/api';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, variantId?: string, attributes?: Record<string, string>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  itemCount: number;
}

const defaultCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
};

const CART_KEY = 'cart_data';

const calculateCartTotals = (items: CartItem[], discount: number = 0): Omit<Cart, 'items' | 'couponCode'> => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping - discount;

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total: Math.max(0, total),
  };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity: number = 1, variantId?: string, attributes?: Record<string, string>) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.id && item.variantId === variantId
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        newItems = [...prevCart.items];
        const existingItem = newItems[existingItemIndex];
        const newQuantity = Math.min(existingItem.quantity + quantity, existingItem.maxQuantity);

        if (newQuantity === existingItem.quantity) {
          toast.info('Maximum quantity reached');
          return prevCart;
        }

        newItems[existingItemIndex] = { ...existingItem, quantity: newQuantity };
        toast.success('Updated quantity');
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variantId || 'default'}-${Date.now()}`,
          productId: product.id,
          variantId,
          name: product.name,
          slug: product.slug,
          price: variantId
            ? product.variants.find(v => v.id === variantId)?.price || product.price
            : product.price,
          quantity: Math.min(quantity, product.quantity),
          image: product.featuredImage,
          maxQuantity: product.quantity,
          attributes,
        };

        newItems = [...prevCart.items, newItem];
        toast.success('Added to cart');
      }

      const totals = calculateCartTotals(newItems, prevCart.discount);
      return { ...prevCart, items: newItems, ...totals };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      const totals = calculateCartTotals(newItems, prevCart.discount);
      toast.success('Item removed');
      return { ...prevCart, items: newItems, ...totals };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity: Math.min(quantity, item.maxQuantity) } : item
      );

      const totals = calculateCartTotals(newItems, prevCart.discount);
      return { ...prevCart, items: newItems, ...totals };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(defaultCart);
    localStorage.removeItem(CART_KEY);
    toast.success('Cart cleared');
  }, []);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await couponApi.validate(code, cart.subtotal.toString());

      if (response.success && response.data) {
        const coupon = response.data;
        const discount =
          coupon.type === 'percentage'
            ? cart.subtotal * (coupon.value / 100)
            : coupon.value;

        const totals = calculateCartTotals(cart.items, discount);
        setCart(prev => ({ ...prev, ...totals, couponCode: code }));
        toast.success(`Coupon applied`);
        return true;
      }

      toast.error(response.message || 'Invalid coupon');
      return false;
    } catch {
      toast.error('Failed to apply coupon');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cart.subtotal, cart.items]);

  const removeCoupon = useCallback(() => {
    const totals = calculateCartTotals(cart.items, 0);
    setCart(prev => ({ ...prev, ...totals, couponCode: undefined }));
    toast.success('Coupon removed');
  }, [cart.items]);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}