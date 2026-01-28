import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Search, Filter, Eye, 
  Truck, CheckCircle, Clock, XCircle, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ordersApi } from '@/services/api';
import type { Order } from '@/types';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-violet-100 text-violet-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-slate-100 text-slate-700', icon: RotateCcw },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await ordersApi.getAll({ page: 1, limit: 20 });
        if (response.success && response.data) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pt-36 pb-12 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-violet-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900">My Orders</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">My Orders</h1>
            <p className="text-slate-500">Track and manage your orders</p>
          </div>
          <Button asChild>
            <Link to="/products">
              <Package className="w-4 h-4 mr-2" />
              Shop Now
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Order Number</p>
                          <p className="font-semibold">{order.orderNumber}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div>
                          <p className="text-sm text-slate-500">Order Date</p>
                          <p className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div>
                          <p className="text-sm text-slate-500">Total</p>
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <Badge className={`${status.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    {/* Items */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="hidden sm:block">
                            <p className="font-medium line-clamp-1">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-500 font-medium">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Package className="w-4 h-4" />
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'shipped' && (
                          <Button variant="outline" size="sm">
                            <Truck className="w-4 h-4 mr-2" />
                            Track Order
                          </Button>
                        )}
                        <Button size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
              <p className="text-slate-500 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'You haven\'t placed any orders yet'}
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
