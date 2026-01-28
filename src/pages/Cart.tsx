import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, 
  Package, Tag, AlertCircle, ShoppingBag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    applyCoupon, 
    removeCoupon,
    itemCount 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    setIsApplyingCoupon(true);
    await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="pt-36 pb-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
            <p className="text-slate-500 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button size="lg" asChild>
              <Link to="/products">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-12 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-violet-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900">Shopping Cart</span>
        </nav>

        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm text-slate-500 pb-2 border-b">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            {cart.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-12 gap-4 items-center">
                    {/* Product */}
                    <div className="md:col-span-6 flex gap-4">
                      <Link to={`/products/${item.slug}`} className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/products/${item.slug}`}
                          className="font-medium text-slate-900 hover:text-violet-600 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.attributes && Object.entries(item.attributes).length > 0 && (
                          <p className="text-sm text-slate-500 mt-1">
                            {Object.entries(item.attributes).map(([key, value]) => (
                              <span key={key} className="mr-2">{key}: {value}</span>
                            ))}
                          </p>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1 mt-2 md:hidden"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex items-center justify-center">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-2 hover:bg-slate-100 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="px-3 py-2 hover:bg-slate-100 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Total */}
                    <div className="md:col-span-2 flex items-center justify-end gap-4">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 hidden md:block"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button variant="outline" asChild>
                <Link to="/products">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="ghost" onClick={clearCart} className="text-rose-500 hover:text-rose-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
                  
                  {/* Coupon */}
                  <div className="mb-6">
                    {cart.couponCode ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {cart.couponCode}
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-sm text-green-700 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tax (8%)</span>
                      <span className="font-medium">${cart.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Shipping</span>
                      <span className="font-medium">
                        {cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {cart.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Discount</span>
                        <span className="font-medium text-green-600">
                          -${cart.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg text-violet-600">
                        ${cart.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    size="lg" 
                    className="w-full mt-6 bg-violet-600 hover:bg-violet-700"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Payment Icons */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <img src="/images/payment/visa.svg" alt="Visa" className="h-6 opacity-50" />
                    <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6 opacity-50" />
                    <img src="/images/payment/amex.svg" alt="Amex" className="h-6 opacity-50" />
                    <img src="/images/payment/paypal.svg" alt="PayPal" className="h-6 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Package className="w-5 h-5 text-violet-600" />
                  <span className="text-sm">Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-violet-600" />
                  <span className="text-sm">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
