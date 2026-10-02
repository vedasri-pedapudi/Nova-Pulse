import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import { calculateConfidence } from '@/utils/availability';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Package, Zap } from 'lucide-react';

export function StorePerformance() {
  const { currentUser, inventory, products, stores, orders } = useApp();
  const storeId = currentUser?.storeId || 'store-1';
  const store = stores.find((s) => s.id === storeId);

  const storeInventory = inventory.filter((inv) => inv.storeId === storeId);

  const metrics = useMemo(() => {
    let totalConf = 0;
    let healthy = 0;
    let stale = 0;
    let outOfStock = 0;

    storeInventory.forEach((inv) => {
      const product = products.find((p) => p.id === inv.productId);
      if (!product || !store) return;
      const conf = calculateConfidence(inv, store, product);
      totalConf += conf.total;
      if (conf.total >= 80) healthy++;
      if (inv.lastUpdatedMin > 360) stale++;
      if (inv.stock === 0) outOfStock++;
    });

    return {
      avgConfidence: storeInventory.length > 0 ? Math.round(totalConf / storeInventory.length) : 0,
      healthy,
      stale,
      outOfStock,
      total: storeInventory.length,
    };
  }, [storeInventory, products, store]);

  const storeOrders = orders.filter((o) => o.storeName === store?.name);
  const delivered = storeOrders.filter((o) => o.status === 'delivered').length;
  const cancelled = storeOrders.filter((o) => o.status === 'cancelled').length;
  const cancelRate = storeOrders.length > 0 ? Math.round((cancelled / storeOrders.length) * 100) : 0;

  const trendData = [
    { day: 'Mon', confidence: 82, orders: 12 },
    { day: 'Tue', confidence: 85, orders: 15 },
    { day: 'Wed', confidence: 87, orders: 18 },
    { day: 'Thu', confidence: 84, orders: 14 },
    { day: 'Fri', confidence: 89, orders: 22 },
    { day: 'Sat', confidence: metrics.avgConfidence, orders: storeOrders.length },
    { day: 'Sun', confidence: metrics.avgConfidence, orders: storeOrders.length },
  ];

  return (
    <div>
      <PageHeader title="Store Performance" subtitle={store?.name} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Inventory Accuracy" value={`${metrics.avgConfidence}%`} icon={<CheckCircle size={20} />} color={metrics.avgConfidence >= 85 ? 'emerald' : 'amber'} />
        <StatCard label="Orders Delivered" value={delivered} icon={<Package size={20} />} color="teal" />
        <StatCard label="Cancellation Rate" value={`${cancelRate}%`} icon={<AlertTriangle size={20} />} color={cancelRate > 10 ? 'red' : 'emerald'} />
        <StatCard label="Avg Prep Time" value={`${store?.avgPrepTime || 8} min`} icon={<Clock size={20} />} color="navy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-600" />
            Confidence Trend (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d8a85" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d8a85" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="confidence" stroke="#0d8a85" strokeWidth={2} fill="url(#confGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-teal-600" />
            Orders This Week
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="orders" fill="#1a2f52" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Inventory health breakdown */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-900 mb-4">Inventory Health Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Healthy Products</span>
              <span className="font-medium text-navy-900">{metrics.healthy} / {metrics.total}</span>
            </div>
            <ProgressBar value={metrics.healthy} max={metrics.total} color="emerald" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600 flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Stale Inventory</span>
              <span className="font-medium text-navy-900">{metrics.stale} / {metrics.total}</span>
            </div>
            <ProgressBar value={metrics.stale} max={metrics.total} color="amber" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600 flex items-center gap-2"><AlertTriangle size={14} className="text-red-500" /> Out of Stock</span>
              <span className="font-medium text-navy-900">{metrics.outOfStock} / {metrics.total}</span>
            </div>
            <ProgressBar value={metrics.outOfStock} max={metrics.total} color="red" />
          </div>
        </div>
      </Card>
    </div>
  );
}
