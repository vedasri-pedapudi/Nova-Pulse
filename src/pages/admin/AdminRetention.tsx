import { PageHeader } from '@/components/Layout';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList,
} from 'recharts';
import { Users, ShoppingCart, Repeat, TrendingUp, ArrowDown } from 'lucide-react';

const funnelData = [
  { name: 'New Users', value: 120000, fill: '#1a2f52' },
  { name: 'First Order', value: 64800, fill: '#2d4570' },
  { name: 'Second Order (30 days)', value: 20088, fill: '#4a6fa8' },
  { name: 'Third Order', value: 10848, fill: '#0d8a85' },
  { name: 'Repeat Customers', value: 7811, fill: '#14ada6' },
];

const conversionData = [
  { stage: 'Registration → First Order', rate: 54, color: '#1a2f52' },
  { stage: 'First → Second Order', rate: 31, color: '#4a6fa8' },
  { stage: 'Second → Third Order', rate: 54, color: '#0d8a85' },
  { stage: '3+ Orders → Repeat', rate: 72, color: '#14ada6' },
];

export function AdminRetention() {
  return (
    <div>
      <PageHeader
        title="Customer Retention Dashboard"
        subtitle="Baseline metrics from NOVA CART case data"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="First Order Conversion" value="54%" sublabel="Of new users" icon={<Users size={20} />} color="navy" />
        <StatCard label="Second Order (30 days)" value="31%" sublabel="Drop-off is severe" icon={<ShoppingCart size={20} />} color="amber" />
        <StatCard label="Repeat Purchase Rate" value="27%" sublabel="Was 41% — declining" icon={<Repeat size={20} />} color="red" trend="down" trendValue="-14pp in 6mo" />
        <StatCard label="3+ Orders → Repeat" value="72%" sublabel="High loyalty after 3rd order" icon={<TrendingUp size={20} />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Funnel */}
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Retention Funnel</h3>
          <ResponsiveContainer width="100%" height={320}>
            <FunnelChart>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [value.toLocaleString(), 'Users']}
              />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="#1e293b" stroke="none" fontSize={12} dataKey="name" />
                <LabelList position="center" fill="#fff" stroke="none" fontSize={11} dataKey="value" formatter={(v: any) => v.toLocaleString()} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion rates */}
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Stage Conversion Rates</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={conversionData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 10, fill: '#64748b' }} width={130} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [`${value}%`, 'Conversion']}
              />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {conversionData.map((d, i) => (
                  <Bar key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Key insight */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-navy-900 mb-4">Key Insight: The 3-Order Threshold</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-700">31%</p>
              <p className="text-xs text-amber-600">2nd order rate</p>
            </div>
            <ArrowDown size={20} className="text-slate-300 rotate-[-90deg]" />
            <div className="rounded-lg bg-emerald-100 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-emerald-700">72%</p>
              <p className="text-xs text-emerald-600">repeat after 3rd</p>
            </div>
          </div>
          <div className="flex-1 text-sm text-slate-600">
            <p>The biggest drop-off is between the 1st and 2nd order. Once a customer reaches 3 orders, they're highly likely to continue. <strong className="text-navy-900">Reliable first experiences</strong> are critical to crossing this threshold.</p>
            <p className="mt-2 text-teal-700">NOVA PULSE targets this by making first and second orders more reliable — fewer cancellations means more customers reaching the 3-order loyalty point.</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-slate-50">
        <p className="text-xs text-slate-500">
          <Badge variant="neutral" size="sm">Baseline Metrics</Badge> These are the NOVA CART case's current figures, not achieved results. Target improvements are shown in the Business Impact Simulator.
        </p>
      </Card>
    </div>
  );
}
