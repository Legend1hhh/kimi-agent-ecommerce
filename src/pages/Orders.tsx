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

const statusConfig: any = {
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
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // ✅ FIX: Cloudflare API only accepts string
        const response = await ordersApi.getAll('my');

        if (response.success && response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Failed to load orders', error);
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

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
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

        {isLoading ? (
          <p>Loading...</p>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <Card key={order.id}>
                  <CardContent className="p-6">

                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <Badge className={status.color}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {status.label}
                      </Badge>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between items-center">
                      <span>{order.items.length} items</span>
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <Button size="sm" asChild>
                        <Link to={`/orders/${order.id}`}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Link>
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-10 h-10 mx-auto mb-4 text-slate-400" />
              <p>No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}