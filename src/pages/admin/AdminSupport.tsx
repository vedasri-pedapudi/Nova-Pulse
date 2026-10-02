import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { MessageSquare, ShieldCheck, Zap, Sparkles, AlertTriangle } from 'lucide-react';

const PIE_COLORS = ['#dc2626', '#f59e0b', '#0d8a85', '#8b5cf6', '#3b82f6', '#64748b'];

const ticketData = [
  { name: 'Refund status', value: 29, color: '#dc2626' },
  { name: 'Delayed delivery', value: 24, color: '#f59e0b' },
  { name: 'Missing/unavailable products', value: 19, color: '#0d8a85' },
  { name: 'Coupon problems', value: 13, color: '#8b5cf6' },
  { name: 'Incorrect orders', value: 9, color: '#3b82f6' },
  { name: 'Other', value: 6, color: '#64748b' },
];

export function AdminSupport() {
  const { inventoryMismatchesPrevented, alternativesRecommended, cancellationsPrevented } = useApp();

  const preventableTickets = [
    { name: 'Refund status', preventable: 60, color: '#dc2626' },
    { name: 'Missing/unavailable', preventable: 85, color: '#0d8a85' },
    { name: 'Delayed delivery', preventable: 30, color: '#f59e0b' },
    { name: 'Incorrect orders', preventable: 20, color: '#3b82f6' },
  ];

  return (
    <div>
      <PageHeader title="Support Ticket Analytics" subtitle="Where support burden comes from — and what NOVA PULSE can prevent" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Monthly Tickets" value="5,900" sublabel="Was 3,100 — up 90%" icon={<MessageSquare size={20} />} color="red" />
        <StatCard label="Refund-Related" value="1,711" sublabel="29% of tickets" icon={<AlertTriangle size={20} />} color="amber" />
        <StatCard label="Availability-Related" value="1,121" sublabel="19% of tickets" icon={<AlertTriangle size={20} />} color="amber" />
        <StatCard label="Est. Preventable" value="2,380" sublabel="~40% of total" icon={<ShieldCheck size={20} />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Support Ticket Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ticketData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                label={(entry: any) => `${entry.value}%`} labelLine={false}>
                {ticketData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value: any) => [`${value}%`, '']} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Preventable Portion by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={preventableTickets} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} width={120} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(value: any) => [`${value}% preventable`, '']} />
              <Bar dataKey="preventable" radius={[0, 4, 4, 0]}>
                {preventableTickets.map((d, i) => (
                  <Bar key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Problems prevented */}
      <Card className="p-5 mb-6 bg-gradient-to-r from-navy-900 to-navy-800 border-0">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-teal-400" />
          <h3 className="text-white font-semibold">Problems Prevented Before Support</h3>
          <Badge variant="info" size="sm">Simulated / Demo Values</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-navy-800/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-teal-400" />
              <span className="text-sm text-navy-200">Inventory mismatches prevented</span>
            </div>
            <p className="text-3xl font-bold text-teal-400">{inventoryMismatchesPrevented}</p>
            <ProgressBar value={inventoryMismatchesPrevented} max={200} color="teal" className="mt-2" />
          </div>
          <div className="rounded-lg bg-navy-800/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-teal-400" />
              <span className="text-sm text-navy-200">Alternative recommendations</span>
            </div>
            <p className="text-3xl font-bold text-teal-400">{alternativesRecommended}</p>
            <ProgressBar value={alternativesRecommended} max={150} color="teal" className="mt-2" />
          </div>
          <div className="rounded-lg bg-navy-800/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-teal-400" />
              <span className="text-sm text-navy-200">Potential cancellations prevented</span>
            </div>
            <p className="text-3xl font-bold text-teal-400">{cancellationsPrevented}</p>
            <ProgressBar value={cancellationsPrevented} max={120} color="teal" className="mt-2" />
          </div>
        </div>
        <p className="text-xs text-navy-300 mt-4">
          These metrics update in real-time as customers use smart alternatives and stores update inventory. Every prevented cancellation is a support ticket that was never created.
        </p>
      </Card>
    </div>
  );
}
