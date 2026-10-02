import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, StatCard, Badge, ProgressBar } from '@/components/ui';
import { calculateConfidence } from '@/utils/availability';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { Users, ShoppingCart, IndianRupee, Repeat, XCircle, Clock, MessageSquare, Zap, Activity, TrendingDown } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: Props) {
  const { stores, inventory, products, cancellationsPrevented, alternativesRecommended, inventoryMismatchesPrevented } = useApp();

  const businessHealth = useMemo(() => {
    let totalConf = 0;
    let count = 0;
    inventory.forEach((inv) => {
      const product = products.find((p) => p.id === inv.productId);
      const store = stores.find((s) => s.id === inv.storeId);
      if (!product || !store) return;
      const conf = calculateConfidence(inv, store, product);
      totalConf += conf.total;
      count++;
    });
    const inventoryReliability = count > 0 ? Math.round(totalConf / count) : 0;

    return [
      { metric: 'Inventory Reliability', value: inventoryReliability, max: 100 },
      { metric: 'Cancellation Risk', value: 100 - 11, max: 100 },
      { metric: 'Delivery Reliability', value: 100 - 13, max: 100 },
      { metric: 'Customer Retention', value: 27, max: 100 },
      { metric: 'Store Health', value: 82, max: 100 },
    ];
  }, [inventory, products, stores]);

  const radarData = businessHealth.map((b) => ({ metric: b.metric, value: b.value }));

  const revenueData = [
    { month: 'Apr', revenue: 21.8, orders: 32100 },
    { month: 'May', revenue: 22.5, orders: 33800 },
    { month: 'Jun', revenue: 23.1, orders: 35200 },
    { month: 'Jul', revenue: 24.3, orders: 36400 },
    { month: 'Aug', revenue: 25.2, orders: 37100 },
    { month: 'Sep', revenue: 26.1, orders: 38500 },
  ];

  return (
    <div>
      <PageHeader
        title="Business Intelligence Center"
        subtitle="NOVA PULSE — Unified view of NOVA CART operations"
      />

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Monthly Active Users" value="46,000" sublabel="120K registered" icon={<Users size={20} />} color="navy" trend="up" trendValue="3.2% MoM" />
        <StatCard label="Monthly Orders" value="38,500" sublabel="Avg order ₹486" icon={<ShoppingCart size={20} />} color="teal" trend="up" trendValue="4.1% MoM" />
        <StatCard label="Monthly Revenue" value="₹26.1L" sublabel="₹21.8L → ₹26.1L" icon={<IndianRupee size={20} />} color="emerald" trend="up" trendValue="19.7% in 6mo" />
        <StatCard label="Repeat Purchase Rate" value="27%" sublabel="Was 41%" icon={<Repeat size={20} />} color="red" trend="down" trendValue="-14pp in 6mo" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Cancellation Rate" value="11%" sublabel="Was 6%" icon={<XCircle size={20} />} color="red" trend="down" trendValue="+5pp in 6mo" />
        <StatCard label="Avg Delivery Time" value="37 min" sublabel="Was 29 min" icon={<Clock size={20} />} color="amber" trend="down" trendValue="+8 min in 6mo" />
        <StatCard label="Support Tickets" value="5,900" sublabel="Was 3,100" icon={<MessageSquare size={20} />} color="amber" trend="down" trendValue="+90% in 6mo" />
        <StatCard label="Promo Spend" value="₹17L" sublabel="Was ₹9.5L" icon={<TrendingDown size={20} />} color="amber" trend="down" trendValue="+79% in 6mo" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-navy-900 mb-4">Revenue & Orders Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d8a85" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d8a85" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a2f52" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a2f52" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#0d8a85" strokeWidth={2} fill="url(#revGrad)" name="Revenue (Lakh ₹)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#1a2f52" strokeWidth={2} fill="url(#ordGrad)" name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Business Health</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name="Score" dataKey="value" stroke="#0d8a85" fill="#0d8a85" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Problems prevented */}
      <Card className="p-5 mb-6 bg-gradient-to-r from-navy-900 to-navy-800 border-0">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-teal-400" />
          Problems Prevented Before Support
          <Badge variant="info" size="sm">Simulated / Demo Values</Badge>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-navy-800/50 p-4">
            <p className="text-3xl font-bold text-teal-400">{inventoryMismatchesPrevented}</p>
            <p className="text-sm text-navy-200 mt-1">Inventory mismatches prevented</p>
          </div>
          <div className="rounded-lg bg-navy-800/50 p-4">
            <p className="text-3xl font-bold text-teal-400">{alternativesRecommended}</p>
            <p className="text-sm text-navy-200 mt-1">Alternative recommendations</p>
          </div>
          <div className="rounded-lg bg-navy-800/50 p-4">
            <p className="text-3xl font-bold text-teal-400">{cancellationsPrevented}</p>
            <p className="text-sm text-navy-200 mt-1">Potential cancellations prevented</p>
          </div>
        </div>
      </Card>

      {/* Unified system visualization */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-teal-600" />
          Unified Intelligence Layer
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['Customer App', 'Store Dashboard', 'Order System', 'Inventory', 'Delivery Tracking', 'Support', 'Analytics'].map((sys) => (
            <div key={sys} className="flex items-center gap-2">
              <Badge variant="neutral" size="md">{sys}</Badge>
              <span className="text-teal-400">→</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-white font-bold">
              <Zap size={16} /> NOVA PULSE
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          Previously fragmented systems now viewed through a common intelligence layer
        </p>
      </Card>
    </div>
  );
}
