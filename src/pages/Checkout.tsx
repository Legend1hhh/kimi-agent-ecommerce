import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Shield, AlertCircle, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi } from '@/services/api';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId,
        })),
        shippingAddress: {
          id: 'temp-' + Date.now(),
          ...shippingAddress,
          isDefault: false,
        },
        billingAddress: sameAsShipping 
          ? { id: 'temp-' + Date.now(), ...shippingAddress, isDefault: false }
          : { id: 'temp-' + Date.now(), ...shippingAddress, isDefault: false },
        shippingMethodId: shippingMethod,
        couponCode: cart.couponCode,
      };

      const response = await ordersApi.create(orderData);

      if (response.success && response.data) {
        clearCart();
        navigate(`/order-success/${response.data.order.id}`);
      } else {
        toast.error(response.message || 'Failed to create order');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 15, days: '3-5 business days' },
    { id: 'express', name: 'Express Shipping', price: 25, days: '1-2 business days' },
    { id: 'free', name: 'Free Shipping', price: 0, days: '5-7 business days' },
  ];

  const selectedShipping = shippingMethods.find(m => m.id === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const finalTotal = cart.total + shippingCost - cart.shipping;

  return (
    <div className="pt-36 pb-12 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <span>Cart</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Checkout</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-400">Confirmation</span>
        </nav>

        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-bold">1</span>
                    </div>
                    <h2 className="text-lg font-bold">Contact Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-bold">2</span>
                    </div>
                    <h2 className="text-lg font-bold">Shipping Address</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        value={shippingAddress.address1}
                        onChange={(e) => handleInputChange('address1', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                      <Input
                        id="address2"
                        value={shippingAddress.address2}
                        onChange={(e) => handleInputChange('address2', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <select
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        required
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-bold">3</span>
                    </div>
                    <h2 className="text-lg font-bold">Shipping Method</h2>
                  </div>
                  
                  <RadioGroup 
                    value={shippingMethod} 
                    onValueChange={setShippingMethod}
                    className="space-y-3"
                  >
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          shippingMethod === method.id 
                            ? 'border-violet-600 bg-violet-50' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-slate-500">{method.days}</p>
                          </div>
                        </div>
                        <span className="font-medium">
                          {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-bold">4</span>
                    </div>
                    <h2 className="text-lg font-bold">Payment</h2>
                  </div>
                  
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required={paymentMethod === 'card'}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date *</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required={paymentMethod === 'card'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            required={paymentMethod === 'card'}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          required={paymentMethod === 'card'}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="paypal" className="mt-4">
                      <div className="text-center py-8">
                        <p className="text-slate-600 mb-4">
                          You will be redirected to PayPal to complete your payment.
                        </p>
                        <img 
                          src="/images/payment/paypal.svg" 
                          alt="PayPal" 
                          className="h-10 mx-auto"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="cod" className="mt-4">
                      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <p className="text-sm text-amber-700">
                          Cash on delivery is available for orders under $500.
                          Additional fee of $5 may apply.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex items-center gap-2 mt-4">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
                    
                    {/* Items */}
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span>${cart.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tax</span>
                        <span>${cart.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Shipping</span>
                        <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                      </div>
                      {cart.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Discount</span>
                          <span className="text-green-600">-${cart.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-violet-600">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-6 bg-violet-600 hover:bg-violet-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Complete Order - ${finalTotal.toFixed(2)}
                        </span>
                      )}
                    </Button>

                    {/* Security Badges */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Shield className="w-4 h-4" />
                        Secure
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Lock className="w-4 h-4" />
                        Encrypted
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
