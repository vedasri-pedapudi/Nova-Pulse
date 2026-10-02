import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Button, Badge } from '@/components/ui';
import type { OrderStatus } from '@/types';
import { ClipboardList, Check, X, Clock } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const statusOptions: { status: OrderStatus; label: string; variant: 'info' | 'success' | 'warning' | 'error' }[] = [
  { status: 'placed', label: 'Order Placed', variant: 'info' },
  { status: 'store_confirmed', label: 'Store Confirmed', variant: 'info' },
  { status: 'preparing', label: 'Preparing', variant: 'warning' },
  { status: 'picked_up', label: 'Picked Up', variant: 'info' },
  { status: 'out_for_delivery', label: 'Out for Delivery', variant: 'info' },
  { status: 'delivered', label: 'Delivered', variant: 'success' },
  { status: 'cancelled', label: 'Cancelled', variant: 'error' },
];

export function StoreOrders({ onNavigate }: Props) {
  const { orders, updateOrderStatus, currentUser, stores } = useApp();
  const store = stores.find((s) => s.id === (currentUser?.storeId || 'store-1'));

  const storeOrders = useMemo(() => {
    return orders.filter((o) => o.storeName === store?.name);
  }, [orders, store]);

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ['placed', 'store_confirmed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered'];
    const idx = flow.indexOf(current);
    if (idx < 0 || idx >= flow.length - 1) return null;
    return flow[idx + 1];
  };

  const getBadge = (status: OrderStatus) => {
    const opt = statusOptions.find((s) => s.status === status);
    return opt ? <Badge variant={opt.variant}>{opt.label}</Badge> : <Badge>{status}</Badge>;
  };

  return (
    <div>
      <PageHeader title="Store Orders" subtitle={store?.name} />

      {storeOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardList size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No orders yet</p>
          <p className="text-sm text-slate-400 mt-1">Orders from customers will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {storeOrders.map((order) => {
            const next = nextStatus(order.status);
            return (
              <Card key={order.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-semibold text-navy-900">{order.id}</span>
                      {getBadge(order.status)}
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">
                            {item.productName}
                            {item.replacedFrom && <span className="text-teal-600 text-xs ml-2">(replaced from {item.replacedFrom})</span>}
                          </span>
                          <span className="text-slate-500">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {order.deliveryEstimateLow}–{order.deliveryEstimateHigh} min</span>
                      <span>·</span>
                      <span>₹{order.total}</span>
                      {order.cancellationsPrevented > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-teal-600 font-medium">{order.cancellationsPrevented} cancellation prevented</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <>
                        {next && (
                          <Button size="sm" variant="primary" onClick={() => updateOrderStatus(order.id, next)}>
                            <Check size={14} />
                            Advance to {statusOptions.find((s) => s.status === next)?.label}
                          </Button>
                        )}
                        <Button size="sm" variant="danger" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                          <X size={14} />
                          Reject Order
                        </Button>
                      </>
                    )}
                    {order.status === 'delivered' && (
                      <Badge variant="success"><Check size={12} /> Completed</Badge>
                    )}
                    {order.status === 'cancelled' && (
                      <Badge variant="error"><X size={12} /> Cancelled</Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
