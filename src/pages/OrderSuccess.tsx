import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ordersApi } from '@/services/api';
import type { Order } from '@/types';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      try {
        const response = await ordersApi.getById(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="pt-36 pb-12 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-slate-200 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-12 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500">
              Thank you for your purchase. We've sent a confirmation email to your inbox.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Order Details */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-500">Order Number</p>
                  <p className="text-xl font-bold">{order?.orderNumber || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Order Date</p>
                  <p className="font-medium">
                    {order?.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Items */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">Order Items</h3>
                {order?.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span>${order?.subtotal.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span>${order?.tax.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span>${order?.shipping.toFixed(2) || '0.00'}</span>
                </div>
                {order?.discount && order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-violet-600">
                    ${order?.total.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="text-slate-600">
                  <p>{order?.shippingAddress.firstName} {order?.shippingAddress.lastName}</p>
                  <p>{order?.shippingAddress.address1}</p>
                  {order?.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.postalCode}
                  </p>
                  <p>{order?.shippingAddress.country}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-10 h-10 text-violet-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Track Your Order</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Monitor your order status and get real-time updates
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/orders">
                    View Orders
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-10 h-10 text-violet-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Need Help?</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Contact our support team for any questions
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/products">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
