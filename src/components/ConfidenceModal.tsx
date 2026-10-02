import type { ConfidenceBreakdown } from '@/types';
import { Check, AlertTriangle, X } from 'lucide-react';

interface ConfidenceModalProps {
  breakdown: ConfidenceBreakdown;
  productName: string;
  onClose: () => void;
}

export function ConfidenceModal({ breakdown, productName, onClose }: ConfidenceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-navy-900">Why {breakdown.total}%?</h3>
            <p className="text-sm text-slate-500">{productName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-600">Availability Confidence</span>
            <span className={`text-2xl font-bold ${breakdown.total >= 80 ? 'text-emerald-600' : breakdown.total >= 55 ? 'text-amber-600' : 'text-red-600'}`}>
              {breakdown.total}%
            </span>
          </div>

          <div className="space-y-2">
            {breakdown.factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                {factor.positive ? (
                  <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className={factor.positive ? 'text-slate-700' : 'text-amber-700'}>{factor.label}</span>
                  <span className="text-slate-400 block text-xs mt-0.5">{factor.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-navy-50 px-4 py-3 text-xs text-navy-600">
            <p className="font-medium mb-1">How this is calculated</p>
            <p>Availability Confidence combines inventory freshness (30%), stock level (30%), store reliability (20%), recent order availability (20%), minus stale inventory risk. This is a rule-based estimate, not a machine learning model.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
