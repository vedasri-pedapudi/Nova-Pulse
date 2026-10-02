import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Badge, Button, StatCard } from '@/components/ui';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { ShieldAlert, Store, Package, IndianRupee, MessageSquare, XCircle, ArrowRight, X } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const PIE_COLORS = ['#dc2626', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];

const cancellationReasons = [
  { name: 'Product unavailable', value: 35, color: '#dc2626' },
  { name: 'Delivery delay', value: 27, color: '#f59e0b' },
  { name: 'Store rejected', value: 18, color: '#3b82f6' },
  { name: 'Delivery partner unavailable', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 8, color: '#64748b' },
];

const affectedStores = [
  { name: 'Quick Bakery', cancellations: 47, accuracy: 76 },
  { name: 'City Pharmacy', cancellations: 32, accuracy: 81 },
  { name: 'Green Vegetables', cancellations: 28, accuracy: 73 },
  { name: 'Star Stationery', cancellations: 19, accuracy: 77 },
  { name: 'Fresh Mart', cancellations: 15, accuracy: 82 },
];

const affectedProducts = [
  { name: 'Farm Eggs (6 pack)', failures: 31, searches: 96 },
  { name: 'Modern Bread White', failures: 24, searches: 121 },
  { name: 'Amul Milk 1L', failures: 12, searches: 148 },
  { name: 'Classmate Notebook', failures: 8, searches: 73 },
];

export function AdminCancellations({ onNavigate }: Props) {
  const [showDrilldown, setShowDrilldown] = useState(false);

  const totalCancellations = 38500 * 0.11; // ~4235
  const productUnavailableCancellations = Math.round(totalCancellations * 0.35);
  const lostRevenue = Math.round(productUnavailableCancellations * 486);
  const supportTickets = Math.round(productUnavailableCancellations * 0.6);
  const refundImpact = Math.round(lostRevenue * 0.85);

  return (
    <div>
      <PageHeader title="Cancellation Analytics" subtitle="Understand why orders fail and where the biggest impact is" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Cancellations" value="4,235" sublabel="11% of 38,500 orders" icon={<XCircle size={20} />} color="red" />
        <StatCard label="Product Unavailable" value="1,482" sublabel="35% of cancellations" icon={<Package size={20} />} color="red" />
        <StatCard label="Lost Revenue" value={`₹${(lostRevenue / 100000).toFixed(1)}L`} sublabel="Est. from cancellations" icon={<IndianRupee size={20} />} color="amber" />
        <StatCard label="Refund Impact" value={`₹${(refundImpact / 100000).toFixed(1)}L`} sublabel="Est. refund processing" icon={<IndianRupee size={20} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-600" />
            Cancellation Reasons
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cancellationReasons}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={(entry: any) => `${entry.value}%`}
                labelLine={false}
              >
                {cancellationReasons.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    cursor={entry.name === 'Product unavailable' ? 'pointer' : 'default'}
                    opacity={entry.name === 'Product unavailable' ? 1 : 0.7}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [`${value}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <Button variant="secondary" size="sm" className="w-full mt-2" onClick={() => setShowDrilldown(true)}>
            Drill into "Product Unavailable" →
          </Button>
        </Card>

        {/* Bar chart - affected stores */}
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Cancellations by Store</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={affectedStores} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="cancellations" fill="#dc2626" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Drilldown modal */}
      {showDrilldown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowDrilldown(false)}>
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-bold text-navy-900">Product Unavailable — Impact Analysis</h3>
                <p className="text-sm text-slate-500">35% of all cancellations — the #1 cause</p>
              </div>
              <button onClick={() => setShowDrilldown(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Impact stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-red-600">Affected Stores</p>
                  <p className="text-xl font-bold text-red-700">47</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="text-xs text-amber-600">Affected Products</p>
                  <p className="text-xl font-bold text-amber-700">128</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3">
                  <p className="text-xs text-amber-600">Potential Lost Orders</p>
                  <p className="text-xl font-bold text-amber-700">1,482</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Support Tickets</p>
                  <p className="text-xl font-bold text-slate-700">889</p>
                </div>
              </div>

              {/* Affected products */}
              <div>
                <h4 className="font-medium text-navy-900 mb-2 flex items-center gap-2"><Package size={16} className="text-teal-600" /> Most Affected Products</h4>
                <div className="space-y-2">
                  {affectedProducts.map((p) => (
                    <div key={p.name} className="flex items-center justify-between p-2 rounded-lg border border-slate-100">
                      <span className="text-sm text-navy-900">{p.name}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-500">{p.searches} searches</span>
                        <Badge variant="error">{p.failures} failures</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NOVA PULSE solution */}
              <div className="rounded-lg bg-teal-50 p-4">
                <h4 className="font-medium text-teal-800 mb-1">How NOVA PULSE addresses this</h4>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>• Availability confidence flags risky products before order placement</li>
                  <li>• Smart alternatives prevent cancellation when a product is unavailable</li>
                  <li>• Store inventory alerts reduce stale data and out-of-stock situations</li>
                  <li>• Target: reduce product-unavailable cancellations by 40-60%</li>
                </ul>
              </div>

              <Button variant="primary" className="w-full" onClick={() => { setShowDrilldown(false); onNavigate('admin-impact'); }}>
                View Business Impact Simulator
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
