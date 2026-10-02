import { useEffect, useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Button, Badge } from '@/components/ui';
import type { OrderStatus } from '@/types';
import { MapPin, Package, Store as StoreIcon, ChefHat, Bike, Home, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const statusFlow: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', icon: <Package size={18} />, desc: 'Your order has been received' },
  { status: 'store_confirmed', label: 'Store Confirmed', icon: <StoreIcon size={18} />, desc: 'Store has confirmed availability' },
  { status: 'preparing', label: 'Preparing', icon: <ChefHat size={18} />, desc: 'Your items are being packed' },
  { status: 'picked_up', label: 'Picked Up', icon: <Package size={18} />, desc: 'Delivery partner has collected your order' },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: <Bike size={18} />, desc: 'Your order is on the way' },
  { status: 'delivered', label: 'Delivered', icon: <Home size={18} />, desc: 'Order delivered successfully' },
];

export function OrderTracking({ onNavigate }: Props) {
  const { orders, updateOrderStatus } = useApp();
  const [tick, setTick] = useState(0);

  const order = orders[0];

  useEffect(() => {
    if (!order) return;
    const currentIndex = statusFlow.findIndex((s) => s.status === order.status);
    if (currentIndex < statusFlow.length - 1) {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, statusFlow[currentIndex + 1].status);
        setTick((t) => t + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [order, tick, updateOrderStatus]);

  const currentIndex = useMemo(() => {
    if (!order) return 0;
    return statusFlow.findIndex((s) => s.status === order.status);
  }, [order]);

  if (!order) {
    return (
      <div>
        <PageHeader title="Order Tracking" />
        <Card className="p-12 text-center">
          <p className="text-slate-500">No active order to track.</p>
          <Button className="mt-4" onClick={() => onNavigate('customer-search')}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Order Tracking" subtitle={`Order ${order.id}`} />

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-slate-500">Estimated Delivery</p>
            <p className="text-2xl font-bold text-navy-900">{order.deliveryEstimateLow}–{order.deliveryEstimateHigh} min</p>
          </div>
          <div className="text-right">
            <Badge variant={order.status === 'delivered' ? 'success' : 'info'} size="md">
              {order.status.replace(/_/g, ' ')}
            </Badge>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 justify-end">
              <Clock size={12} />
              {order.status === 'delivered' ? 'Delivered' : 'In progress'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-navy-900 mb-6">Order Progress</h3>
        <div className="relative">
          {statusFlow.map((step, i) => {
            const isComplete = i < currentIndex;
            const isCurrent = i === currentIndex;
            const isFuture = i > currentIndex;
            return (
              <div key={step.status} className="flex gap-4 pb-8 last:pb-0 relative">
                {i < statusFlow.length - 1 && (
                  <div className={`absolute left-[18px] top-10 bottom-0 w-0.5 ${isComplete ? 'bg-teal-500' : 'bg-slate-200'}`} />
                )}
                <div className={`flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0 z-10 transition-all ${
                  isComplete ? 'bg-teal-500 text-white' :
                  isCurrent ? 'bg-navy-800 text-white ring-4 ring-navy-100' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {isComplete ? <CheckCircle size={18} /> : step.icon}
                </div>
                <div className={`pt-1 ${isFuture ? 'opacity-50' : ''}`}>
                  <p className={`text-sm font-medium ${isCurrent ? 'text-navy-900' : isComplete ? 'text-teal-700' : 'text-slate-500'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  {isCurrent && order.status !== 'delivered' && (
                    <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
                      <Clock size={12} className="animate-pulse" />
                      In progress...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-navy-900 mb-4">Order Summary</h3>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium text-navy-900">{item.productName}</span>
                {item.replacedFrom && (
                  <span className="text-xs text-teal-600 ml-2">(replaced)</span>
                )}
              </div>
              <span className="text-slate-600">₹{item.price}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-bold text-navy-900">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </Card>

      <div className="mt-6 flex gap-3 justify-center">
        <Button variant="outline" onClick={() => onNavigate('customer-orders')}>
          View All Orders
          <ArrowRight size={16} />
        </Button>
        {order.status === 'delivered' && (
          <Button variant="primary" onClick={() => onNavigate('customer-feedback')}>
            Leave Feedback
          </Button>
        )}
      </div>
    </div>
  );
}
