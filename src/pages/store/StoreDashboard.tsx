import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, StatCard, Badge, ProgressBar, Button } from '@/components/ui';
import { calculateConfidence, formatLastUpdated } from '@/utils/availability';
import { Package, AlertTriangle, Clock, TrendingDown, CheckCircle, ClipboardList, ArrowRight, Zap } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export function StoreDashboard({ onNavigate }: Props) {
  const { currentUser, inventory, products, stores, orders } = useApp();
  const storeId = currentUser?.storeId || 'store-1';
  const store = stores.find((s) => s.id === storeId);

  const storeInventory = inventory.filter((inv) => inv.storeId === storeId);

  const metrics = useMemo(() => {
    let requiringAttention = 0;
    let lowStock = 0;
    let potentialUnavailable = 0;
    let accuracySum = 0;

    storeInventory.forEach((inv) => {
      const product = products.find((p) => p.id === inv.productId);
      if (!product || !store) return;
      const conf = calculateConfidence(inv, store, product);
      accuracySum += conf.total;
      if (conf.total < 55) requiringAttention++;
      if (inv.stock <= 2 && inv.stock > 0) lowStock++;
      if (inv.stock === 0) potentialUnavailable++;
    });

    const accuracy = storeInventory.length > 0 ? Math.round(accuracySum / storeInventory.length) : 0;
    return { requiringAttention, lowStock, potentialUnavailable, accuracy };
  }, [storeInventory, products, store]);

  const storeOrders = orders.filter((o) => o.storeName === store?.name);
  const pendingOrders = storeOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <div>
      <PageHeader title="Store Dashboard" subtitle={store ? `${store.name} · ${store.area}` : ''} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Inventory Accuracy" value={`${metrics.accuracy}%`} icon={<CheckCircle size={20} />} color={metrics.accuracy >= 85 ? 'emerald' : 'amber'} />
        <StatCard label="Requires Attention" value={metrics.requiringAttention} icon={<AlertTriangle size={20} />} color="amber" />
        <StatCard label="Low Stock" value={metrics.lowStock} icon={<Package size={20} />} color="red" />
        <StatCard label="Potential Unavailable" value={metrics.potentialUnavailable} icon={<TrendingDown size={20} />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-teal-600" />
            Today's Orders
          </h3>
          <p className="text-3xl font-bold text-navy-900">{storeOrders.length}</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="warning">{pendingOrders.length} pending</Badge>
            <Badge variant="success">{storeOrders.filter((o) => o.status === 'delivered').length} delivered</Badge>
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => onNavigate('store-orders')}>
            View Orders <ArrowRight size={14} />
          </Button>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-teal-600" />
            Avg Preparation Time
          </h3>
          <p className="text-3xl font-bold text-navy-900">{store?.avgPrepTime || 8} min</p>
          <div className="mt-3">
            <ProgressBar value={store?.avgPrepTime || 8} max={20} color="teal" showLabel />
          </div>
          <p className="text-xs text-slate-400 mt-2">Target: under 10 min</p>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-teal-600" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button variant="primary" size="sm" className="w-full" onClick={() => onNavigate('store-inventory')}>
              <Package size={16} /> Update Inventory
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('store-alerts')}>
              <AlertTriangle size={16} /> View Alerts ({metrics.requiringAttention})
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate('store-demand')}>
              <TrendingDown size={16} /> Demand Insights
            </Button>
          </div>
        </Card>
      </div>

      {/* Products requiring attention */}
      <Card className="p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy-900">Products Requiring Verification</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('store-inventory')}>
            View all <ArrowRight size={14} />
          </Button>
        </div>
        {metrics.requiringAttention === 0 ? (
          <div className="text-center py-6">
            <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
            <p className="text-sm text-slate-500">All products are up to date!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {storeInventory.filter((inv) => {
              const product = products.find((p) => p.id === inv.productId);
              if (!product || !store) return false;
              const conf = calculateConfidence(inv, store, product);
              return conf.total < 55;
            }).slice(0, 5).map((inv) => {
              const product = products.find((p) => p.id === inv.productId);
              if (!product || !store) return null;
              const conf = calculateConfidence(inv, store, product);
              return (
                <div key={inv.productId} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate('store-inventory')}>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{product.name}</p>
                    <p className="text-xs text-slate-500">Stock: {inv.stock} · Updated {formatLastUpdated(inv.lastUpdatedMin)}</p>
                  </div>
                  <Badge variant={conf.total < 30 ? 'error' : 'warning'}>{conf.total}%</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
