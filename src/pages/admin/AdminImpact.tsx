import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Target, TrendingUp, TrendingDown, Sparkles, Zap } from 'lucide-react';

export function AdminImpact() {
  const { cancellationsPrevented, alternativesRecommended, inventoryMismatchesPrevented } = useApp();

  const [inventoryAccuracy, setInventoryAccuracy] = useState(82);
  const [altAdoption, setAltAdoption] = useState(70);

  const projections = useMemo(() => {
    // Calculate projected improvements based on sliders
    const improvedCancelRate = 11 - (11 * 0.35 * (inventoryAccuracy - 82) / 18 + 11 * 0.25 * (altAdoption - 70) / 30);
    const targetCancelRate = Math.max(5, Math.round(improvedCancelRate * 10) / 10);

    const improvedRepeatRate = 27 + (27 * 0.3 * (inventoryAccuracy - 82) / 18);
    const targetRepeatRate = Math.min(45, Math.round(improvedRepeatRate));

    const improvedSupportTickets = Math.round(5900 * (1 - 0.4 * (inventoryAccuracy - 82) / 18 - 0.2 * (altAdoption - 70) / 30));
    const targetSupport = Math.max(3500, improvedSupportTickets);

    const revenueImpact = Math.round((38500 * (1 - targetCancelRate / 100)) * 486 / 100000);

    return { targetCancelRate, targetRepeatRate, targetSupport, revenueImpact };
  }, [inventoryAccuracy, altAdoption]);

  const comparisonData = [
    { metric: 'Cancellation Rate', baseline: 11, target: projections.targetCancelRate, unit: '%', lowerIsBetter: true },
    { metric: 'Repeat Purchase Rate', baseline: 27, target: projections.targetRepeatRate, unit: '%', lowerIsBetter: false },
    { metric: 'Support Tickets', baseline: 5900, target: projections.targetSupport, unit: '', lowerIsBetter: true },
    { metric: 'Inventory Accuracy', baseline: 82, target: inventoryAccuracy, unit: '%', lowerIsBetter: false },
  ];

  return (
    <div>
      <PageHeader
        title="Business Impact Simulator"
        subtitle="Prototype scenario — adjust controls to see illustrative target impact"
        action={<Badge variant="warning" size="md">Prototype Scenario / Target Impact</Badge>}
      />

      {/* Warning */}
      <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> These are illustrative projections based on prototype-level logic, not real achieved results. The simulator demonstrates business reasoning — how improving inventory reliability and alternative adoption can affect key metrics.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Controls */}
        <Card className="p-5 lg:col-span-1">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <Target size={18} className="text-teal-600" />
            Simulation Controls
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Inventory Accuracy Target</label>
                <span className="text-sm font-bold text-teal-600">{inventoryAccuracy}%</span>
              </div>
              <input
                type="range"
                min={82}
                max={100}
                value={inventoryAccuracy}
                onChange={(e) => setInventoryAccuracy(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Current: 82%</span>
                <span>Best: 100%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Alternative Adoption Rate</label>
                <span className="text-sm font-bold text-teal-600">{altAdoption}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={100}
                value={altAdoption}
                onChange={(e) => setAltAdoption(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Pilot: 70%</span>
                <span>Full: 100%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-teal-50 p-3">
            <p className="text-xs text-teal-700">
              Higher inventory accuracy reduces product-unavailable cancellations. Higher alternative adoption means more at-risk orders are saved instead of cancelled.
            </p>
          </div>
        </Card>

        {/* Comparison chart */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-navy-900 mb-4">Baseline vs Target Impact</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any, name: any) => {
                  const item = comparisonData.find((d) => name === 'Baseline' ? d.baseline === value : d.target === value);
                  return [`${value.toLocaleString()}${item?.unit || ''}`, name];
                }}
              />
              <Bar dataKey="baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Baseline" />
              <Bar dataKey="target" fill="#0d8a85" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {comparisonData.map((item) => {
          const improvement = item.lowerIsBetter
            ? item.baseline - item.target
            : item.target - item.baseline;
          const isPositive = item.lowerIsBetter ? improvement > 0 : improvement > 0;
          return (
            <Card key={item.metric} className="p-4">
              <p className="text-sm text-slate-500 mb-2">{item.metric}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-slate-400 line-through">{item.baseline.toLocaleString()}{item.unit}</span>
                <span className="text-slate-300">→</span>
                <span className={`text-xl font-bold ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>{item.target.toLocaleString()}{item.unit}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {isPositive ? (
                  <TrendingUp size={14} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={14} className="text-amber-500" />
                )}
                <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {improvement > 0 ? '+' : ''}{improvement.toLocaleString()}{item.unit} {item.lowerIsBetter ? 'reduction' : 'improvement'}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Live demo metrics */}
      <Card className="p-5 mb-6 bg-gradient-to-r from-navy-900 to-navy-800 border-0">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-teal-400" />
          <h3 className="text-white font-semibold">Live Prototype Activity</h3>
          <Badge variant="info" size="sm">Updates in real-time</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-navy-800/50 p-4">
            <p className="text-sm text-navy-200">Cancellations Prevented (this session)</p>
            <p className="text-3xl font-bold text-teal-400 mt-1">{cancellationsPrevented - 71}</p>
            <p className="text-xs text-navy-300 mt-1">From {cancellationsPrevented} total (including simulated baseline)</p>
          </div>
          <div className="rounded-lg bg-navy-800/50 p-4">
            <p className="text-sm text-navy-200">Alternatives Recommended (this session)</p>
            <p className="text-3xl font-bold text-teal-400 mt-1">{alternativesRecommended - 86}</p>
            <p className="text-xs text-navy-300 mt-1">From {alternativesRecommended} total</p>
          </div>
          <div className="rounded-lg bg-navy-800/50 p-4">
            <p className="text-sm text-navy-200">Inventory Mismatches Prevented (this session)</p>
            <p className="text-3xl font-bold text-teal-400 mt-1">{inventoryMismatchesPrevented - 124}</p>
            <p className="text-xs text-navy-300 mt-1">From {inventoryMismatchesPrevented} total</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-navy-800/50 p-3">
          <p className="text-xs text-navy-200">
            <Zap size={12} className="inline text-teal-400 mr-1" />
            Est. revenue protected from prevented cancellations: <span className="font-bold text-teal-400">₹{((cancellationsPrevented - 71) * 486).toLocaleString()}</span> (at avg order value ₹486)
          </p>
        </div>
      </Card>

      <Card className="p-4 bg-slate-50">
        <p className="text-xs text-slate-500">
          These projections use simplified rule-based models. Real-world impact would depend on store adoption rates, inventory update frequency, and customer behavior. The simulator is designed to show business reasoning, not to guarantee outcomes.
        </p>
      </Card>
    </div>
  );
}
