import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Button, Badge } from '@/components/ui';
import { Package, ArrowRight, Sparkles, Clock } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function OrderHistory({ onNavigate }: Props) {
  const { orders } = useApp();

  return (
    <div>
      <PageHeader title="Order History" subtitle="All your past orders" />

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No orders yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Place your first order to see it here.</p>
          <Button onClick={() => onNavigate('customer-search')}>Browse Products</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-navy-900">{order.id}</span>
                    <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'info'}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock size={12} />
                    {formatDate(order.placedAt)}
                    <span className="text-slate-300">·</span>
                    {order.items.length} items
                    <span className="text-slate-300">·</span>
                    {order.deliveryEstimateLow}–{order.deliveryEstimateHigh} min
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs bg-slate-50 text-slate-600 rounded-md px-2 py-0.5">
                        {item.productName}
                        {item.replacedFrom && <span className="text-teal-600 ml-1">↻</span>}
                      </span>
                    ))}
                  </div>
                  {order.cancellationsPrevented > 0 && (
                    <p className="text-xs text-teal-600 mt-2 flex items-center gap-1">
                      <Sparkles size={12} />
                      {order.cancellationsPrevented} cancellation prevented by smart alternatives
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-bold text-navy-900">₹{order.total}</p>
                    <p className="text-xs text-slate-400">{order.storeName}</p>
                  </div>
                  {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                    <Button size="sm" variant="outline" onClick={() => onNavigate('customer-tracking')}>
                      Track
                      <ArrowRight size={14} />
                    </Button>
                  ) : order.status === 'delivered' ? (
                    <Button size="sm" variant="ghost" onClick={() => onNavigate('customer-feedback')}>
                      Feedback
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
