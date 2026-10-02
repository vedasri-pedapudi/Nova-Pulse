import { useState } from 'react';
import { useApp, generateOrderId } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Button, Badge } from '@/components/ui';
import { CheckCircle, Package, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export function OrderConfirmation({ onNavigate }: Props) {
  const { orders } = useApp();
  const [orderId] = useState(() => {
    const latest = orders[0];
    return latest?.id || generateOrderId();
  });
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div>
        <PageHeader title="Order Confirmation" />
        <Card className="p-12 text-center">
          <p className="text-slate-500">Order not found.</p>
          <Button className="mt-4" onClick={() => onNavigate('customer-dashboard')}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Order Confirmation" />

      <Card className="p-8 text-center mb-6 animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-navy-900">Order Placed Successfully!</h2>
        <p className="text-slate-500 mt-1">Order ID: <span className="font-mono font-semibold text-navy-700">{order.id}</span></p>

        {order.cancellationsPrevented > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm text-teal-700">
            <Sparkles size={16} />
            {order.cancellationsPrevented} potential cancellation prevented by smart alternatives
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Package size={18} className="text-teal-600" />
            Order Items
          </h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-navy-900">{item.productName}</p>
                  <p className="text-xs text-slate-500">{item.storeName}</p>
                  {item.replacedFrom && (
                    <p className="text-[10px] text-teal-600 mt-0.5">Replaced from: {item.replacedFrom}</p>
                  )}
                </div>
                <span className="font-medium text-navy-900">₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-bold text-navy-900">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-teal-600" />
            Delivery Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Store</span>
              <span className="font-medium text-navy-900">{order.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Est. Delivery</span>
              <span className="font-medium text-navy-900">{order.deliveryEstimateLow}–{order.deliveryEstimateHigh} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <Badge variant="info">{order.status.replace('_', ' ')}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment</span>
              <span className="font-medium text-navy-900">Simulated (no charge)</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="primary" size="lg" onClick={() => onNavigate('customer-tracking')}>
          <MapPin size={18} />
          Track Order
        </Button>
        <Button variant="outline" size="lg" onClick={() => onNavigate('customer-search')}>
          Continue Shopping
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
