import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    error: 'bg-red-50 text-red-700 ring-red-200',
    info: 'bg-teal-50 text-teal-700 ring-teal-200',
    neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  };
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1' };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

interface ConfidenceBadgeProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceBadge({ confidence, size = 'md' }: ConfidenceBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  if (confidence >= 80) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 ${sizes[size]}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {confidence}% Confidence
      </span>
    );
  } else if (confidence >= 55) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 ${sizes[size]}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {confidence}% Confidence
      </span>
    );
  } else {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 font-semibold text-red-700 ring-1 ring-inset ring-red-200 ${sizes[size]}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        {confidence}% Confidence
      </span>
    );
  }
}

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-white ring-1 ring-slate-200/70 shadow-sm ${hoverable ? 'transition-all hover:shadow-md hover:ring-slate-300 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'navy' | 'teal' | 'emerald' | 'amber' | 'red' | 'slate';
}

export function StatCard({ label, value, sublabel, icon, trend, trendValue, color = 'navy' }: StatCardProps) {
  const colorClasses = {
    navy: 'bg-navy-50 text-navy-700',
    teal: 'bg-teal-50 text-teal-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        </div>
      )}
    </Card>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }: ButtonProps) {
  const variants = {
    primary: 'bg-navy-800 text-white hover:bg-navy-700 shadow-sm',
    secondary: 'bg-teal-600 text-white hover:bg-teal-500 shadow-sm',
    outline: 'bg-white text-navy-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-sm',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'emerald' | 'amber' | 'red' | 'teal' | 'navy';
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, color = 'teal', className = '', showLabel = false }: ProgressBarProps) {
  const colors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    teal: 'bg-teal-500',
    navy: 'bg-navy-700',
  };
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs font-medium text-slate-500 min-w-[3rem] text-right">{Math.round(pct)}%</span>}
    </div>
  );
}
