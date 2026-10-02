import { useMemo } from 'react';
import { PageHeader } from '@/components/Layout';
import { Card, ProgressBar, Badge } from '@/components/ui';
import { demandData } from '@/data/mockData';
import { Search, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const PIE_COLORS = ['#0d8a85', '#2ec9be', '#5fe0d0', '#97eee0', '#cbf7ef'];

export function StoreDemand() {
  const searchData = useMemo(() => {
    return demandData.map((d) => ({
      name: d.productName.length > 15 ? d.productName.slice(0, 15) + '…' : d.productName,
      searches: d.searches,
      unavailable: d.unavailableCount,
      full: d.productName,
    }));
  }, []);

  const unavailableData = useMemo(() => {
    return demandData
      .filter((d) => d.unavailableCount > 5)
      .map((d) => ({ name: d.productName, value: d.unavailableCount }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  return (
    <div>
      <PageHeader title="Product Demand Insights" subtitle="What customers are searching for — and what's frequently unavailable" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Search chart */}
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Search size={18} className="text-teal-600" />
            Customers Are Searching For
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={searchData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [`${value} searches`, 'Searches']}
              />
              <Bar dataKey="searches" fill="#0d8a85" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Unavailable chart */}
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            Frequently Unavailable
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={unavailableData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                dataKey="value"
                label={(entry: any) => `${entry.name.slice(0, 12)}`}
                labelLine={false}
              >
                {unavailableData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [`${value} times unavailable`, 'Unavailable']}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Demand table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-navy-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-600" />
            Demand vs Availability Gap
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {demandData.map((d) => {
            const gap = d.unavailableCount / d.searches * 100;
            return (
              <div key={d.productName} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900">{d.productName}</p>
                  <p className="text-xs text-slate-400">{d.category}</p>
                </div>
                <div className="text-center w-24">
                  <p className="text-sm font-semibold text-navy-900">{d.searches}</p>
                  <p className="text-xs text-slate-400">searches</p>
                </div>
                <div className="w-32">
                  <ProgressBar value={d.searches - d.unavailableCount} max={d.searches} color={gap > 15 ? 'red' : 'emerald'} />
                </div>
                <div className="text-center w-20">
                  <Badge variant={gap > 15 ? 'error' : 'success'}>{d.unavailableCount}</Badge>
                  <p className="text-xs text-slate-400 mt-0.5">unavailable</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 mt-4 bg-slate-50">
        <p className="text-sm text-slate-500 flex items-center gap-2">
          <Package size={16} className="text-teal-600" />
          Use these insights to prioritize which products to stock. High search volume with high unavailability = lost orders.
        </p>
      </Card>
    </div>
  );
}
