import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Badge, ProgressBar, Button } from '@/components/ui';
import { Rocket, Wrench, Users, BarChart3, CheckCircle, IndianRupee, ArrowRight } from 'lucide-react';

const phases = [
  {
    phase: 1,
    title: 'Inventory Intelligence',
    duration: 'Month 1-2',
    cost: 6,
    icon: <BarChart3 size={20} />,
    color: 'bg-navy-700',
    items: [
      'Deploy availability confidence algorithm to all 620 stores',
      'Integrate with existing order and inventory databases',
      'Build real-time inventory freshness tracking',
      'Establish confidence thresholds (high/medium/low)',
    ],
    deliverable: 'All stores showing availability confidence scores in customer app',
  },
  {
    phase: 2,
    title: 'Store Workflow Integration',
    duration: 'Month 2-3',
    cost: 7,
    icon: <Wrench size={20} />,
    color: 'bg-teal-600',
    items: [
      'Launch smart inventory alerts (only products needing attention)',
      'Simplify store dashboard for quick inventory updates',
      'Add demand insights for store owners',
      'Reduce manual inventory effort by 60%',
    ],
    deliverable: 'Store inventory accuracy improved from 82% to target 90%+',
  },
  {
    phase: 3,
    title: 'Customer Smart Alternatives',
    duration: 'Month 3-4',
    cost: 6,
    icon: <Users size={20} />,
    color: 'bg-emerald-600',
    items: [
      'Deploy smart alternative recommendation engine',
      'Integrate alternatives into cart verification flow',
      'Add "simulate availability issue" for customer confidence',
      'Track and display "cancellation prevented" metrics',
    ],
    deliverable: 'Product-unavailable cancellations reduced by 40-60%',
  },
  {
    phase: 4,
    title: 'Analytics & Optimization',
    duration: 'Month 5-6',
    cost: 6,
    icon: <Rocket size={20} />,
    color: 'bg-amber-600',
    items: [
      'Launch unified business intelligence dashboard',
      'Connect all fragmented systems through NOVA PULSE layer',
      'Add business impact simulator for leadership',
      'Optimize confidence algorithm based on 6 months of data',
    ],
    deliverable: 'All systems unified — data flows seamlessly across customer, store, and admin',
  },
];

export function AdminPlan() {
  const totalCost = phases.reduce((sum, p) => sum + p.cost, 0);

  return (
    <div>
      <PageHeader
        title="Implementation Plan"
        subtitle="Software/data intervention within ₹25 lakh budget — no physical infrastructure expansion"
      />

      {/* Budget overview */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-navy-900 to-navy-800 border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <IndianRupee size={20} className="text-teal-400" />
              Budget Allocation
            </h3>
            <p className="text-navy-200 text-sm mt-1">Total: ₹{totalCost}L of ₹25L maximum — ₹{25 - totalCost}L buffer</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-teal-400">₹{totalCost}L</p>
              <p className="text-xs text-navy-300">Allocated</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-navy-300">₹{25 - totalCost}L</p>
              <p className="text-xs text-navy-300">Buffer</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={totalCost} max={25} color="teal" showLabel />
        </div>
      </Card>

      {/* What this does NOT include */}
      <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
        <h4 className="text-sm font-medium text-amber-800 mb-2">This plan does NOT depend on:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-amber-700">
          <span>✗ Massive physical infrastructure expansion</span>
          <span>✗ Hundreds of new employees</span>
          <span>✗ Opening warehouses across cities</span>
          <span>✗ Unsustainable customer discounts</span>
        </div>
      </Card>

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <Card key={phase.phase} className="p-5">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${phase.color} flex-shrink-0`}>
                {phase.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h3 className="font-bold text-navy-900 text-lg">Phase {phase.phase}: {phase.title}</h3>
                  <Badge variant="neutral">{phase.duration}</Badge>
                  <Badge variant="info">₹{phase.cost}L</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-3">
                  {phase.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700">
                  <strong>Deliverable:</strong> {phase.deliverable}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="p-6 mt-6">
        <h3 className="font-semibold text-navy-900 mb-3">Why This Works Within Budget</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p>NOVA PULSE is a <strong className="text-navy-900">software and data intervention</strong> — it uses the existing NOVA CART infrastructure (620 stores, existing apps, existing databases) and adds an intelligence layer on top.</p>
          <p>The main costs are: software development (₹18L), data integration (₹4L), and training/change management for store partners (₹2L). No physical expansion, no new warehouses, no unsustainable discounts.</p>
          <p className="text-teal-700 font-medium mt-3">The solution targets the root cause: unreliable inventory. By making every order more reliable, it reduces cancellations, refunds, and support tickets — improving growth quality without spending more on acquisition.</p>
        </div>
      </Card>
    </div>
  );
}
