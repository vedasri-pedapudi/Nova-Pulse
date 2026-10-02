import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Badge, StatCard, ProgressBar } from '@/components/ui';
import { calculateConfidence, formatLastUpdated } from '@/utils/availability';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Activity, CheckCircle, AlertTriangle, XCircle, X, Store, Package } from 'lucide-react';

export function AdminInventoryReliability() {
  const { stores, inventory, products } = useApp();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const storeReliability = useMemo(() => {
    return stores.map((store) => {
      const storeInv = inventory.filter((inv) => inv.storeId === store.id);
      let totalConf = 0;
      let stale = 0;
      let outOfStock = 0;
      let mismatches = 0;

      storeInv.forEach((inv) => {
        const product = products.find((p) => p.id === inv.productId);
        if (!product) return;
        const conf = calculateConfidence(inv, store, product);
        totalConf += conf.total;
        if (inv.lastUpdatedMin > 360) stale++;
        if (inv.stock === 0) outOfStock++;
        if (inv.recentCancellations > 0) mismatches++;
      });

      const accuracy = storeInv.length > 0 ? Math.round(totalConf / storeInv.length) : 0;
      return { store, storeInv, accuracy, stale, outOfStock, mismatches, total: storeInv.length };
    }).sort((a, b) => b.accuracy - a.accuracy);
  }, [stores, inventory, products]);

  const accurate = storeReliability.filter((s) => s.accuracy >= 85).length;
  const atRisk = storeReliability.filter((s) => s.accuracy >= 70 && s.accuracy < 85).length;
  const critical = storeReliability.filter((s) => s.accuracy < 70).length;

  const chartData = storeReliability.map((s) => ({
    name: s.store.name.length > 15 ? s.store.name.slice(0, 15) + '…' : s.store.name,
    accuracy: s.accuracy,
    full: s.store.name,
  }));

  const selectedStoreData = selectedStore ? storeReliability.find((s) => s.store.id === selectedStore) : null;

  return (
    <div>
      <PageHeader title="Inventory Reliability" subtitle="Accuracy across all partner stores" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Accurate Stores" value={accurate} sublabel="85%+ accuracy" icon={<CheckCircle size={20} />} color="emerald" />
        <StatCard label="At-Risk Stores" value={atRisk} sublabel="70-84% accuracy" icon={<AlertTriangle size={20} />} color="amber" />
        <StatCard label="Critical Stores" value={critical} sublabel="Below 70%" icon={<XCircle size={20} />} color="red" />
        <StatCard label="Total Products" value={inventory.length} sublabel="Across all stores" icon={<Package size={20} />} color="navy" />
      </div>

      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-navy-900 mb-4">Inventory Accuracy by Store</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-15} textAnchor="end" height={60} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              formatter={(value: any) => [`${value}%`, 'Accuracy']}
            />
            <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => (
                <Bar key={i} fill={d.accuracy >= 85 ? '#059669' : d.accuracy >= 70 ? '#f59e0b' : '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Store breakdown table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-navy-900">Store Inventory Details</h3>
          <p className="text-xs text-slate-400 mt-0.5">Click a store to see its inventory issues</p>
        </div>
        <div className="divide-y divide-slate-100">
          {storeReliability.map(({ store, accuracy, stale, outOfStock, mismatches, total }) => (
            <div
              key={store.id}
              className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => setSelectedStore(store.id)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700 flex-shrink-0">
                <Store size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-900">{store.name}</p>
                <p className="text-xs text-slate-400">{store.area} · {store.category}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs">
                <span className="text-slate-500">{total} products</span>
                {stale > 0 && <Badge variant="warning">{stale} stale</Badge>}
                {outOfStock > 0 && <Badge variant="error">{outOfStock} out of stock</Badge>}
                {mismatches > 0 && <Badge variant="warning">{mismatches} mismatches</Badge>}
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${accuracy >= 85 ? 'text-emerald-600' : accuracy >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{accuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Store detail modal */}
      {selectedStoreData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedStore(null)}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-bold text-navy-900">{selectedStoreData.store.name}</h3>
                <p className="text-sm text-slate-500">{selectedStoreData.store.area} · {selectedStoreData.store.category}</p>
              </div>
              <button onClick={() => setSelectedStore(null)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Accuracy</p>
                  <p className={`text-xl font-bold ${selectedStoreData.accuracy >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedStoreData.accuracy}%</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Total Products</p>
                  <p className="text-xl font-bold text-navy-900">{selectedStoreData.total}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Stale</p>
                  <p className="text-xl font-bold text-amber-600">{selectedStoreData.stale}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Out of Stock</p>
                  <p className="text-xl font-bold text-red-600">{selectedStoreData.outOfStock}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-navy-900 mb-2">Inventory Issues</h4>
                <div className="space-y-2">
                  {selectedStoreData.storeInv.map((inv) => {
                    const product = products.find((p) => p.id === inv.productId);
                    if (!product) return null;
                    const conf = calculateConfidence(inv, selectedStoreData.store, product);
                    const hasIssue = inv.stock === 0 || inv.lastUpdatedMin > 360 || conf.total < 55;
                    if (!hasIssue) return null;
                    return (
                      <div key={inv.productId} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                        <div>
                          <p className="text-sm font-medium text-navy-900">{product.name}</p>
                          <p className="text-xs text-slate-400">
                            Stock: {inv.stock} · Updated {formatLastUpdated(inv.lastUpdatedMin)}
                          </p>
                        </div>
                        <Badge variant={conf.total < 30 ? 'error' : 'warning'}>{conf.total}%</Badge>
                      </div>
                    );
                  })}
                  {selectedStoreData.storeInv.every((inv) => {
                    const product = products.find((p) => p.id === inv.productId);
                    if (!product) return true;
                    const conf = calculateConfidence(inv, selectedStoreData.store, product);
                    return inv.stock !== 0 && inv.lastUpdatedMin <= 360 && conf.total >= 55;
                  }) && (
                    <p className="text-sm text-slate-400 text-center py-4">No issues found!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
