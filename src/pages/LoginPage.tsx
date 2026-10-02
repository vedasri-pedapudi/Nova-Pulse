import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Button } from '@/components/ui';
import { Zap, ShieldCheck, Store, User, BarChart3, ArrowRight, Activity } from 'lucide-react';

const demoAccounts = [
  { email: 'customer@novapulse.demo', password: 'demo123', role: 'Customer', icon: <User size={20} />, color: 'bg-teal-500', desc: 'Browse products, check availability confidence, place orders' },
  { email: 'store@novapulse.demo', password: 'demo123', role: 'Partner Store', icon: <Store size={20} />, color: 'bg-amber-500', desc: 'Manage inventory, handle orders, view demand insights' },
  { email: 'admin@novapulse.demo', password: 'demo123', role: 'Admin', icon: <BarChart3 size={20} />, color: 'bg-navy-700', desc: 'Business intelligence, analytics, impact simulator' },
];

export function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('Invalid credentials. Use a demo account below.');
    }
  };

  const quickLogin = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setError('');
    login(em, pw);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - branding */}
      <div className="lg:w-1/2 bg-navy-900 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative max-w-md mx-auto lg:mx-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">NOVA PULSE</h1>
              <p className="text-xs text-navy-300 font-medium tracking-wide uppercase">Smart Local Commerce Intelligence</p>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Make every order<br />more reliable.
          </h2>
          <p className="text-navy-200 text-lg leading-relaxed mb-8">
            NOVA CART doesn't need more customers — it needs fewer failed orders. NOVA PULSE connects inventory intelligence, store workflows, and smart alternatives to prevent cancellations before they happen.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-navy-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800">
                <Activity size={16} className="text-teal-400" />
              </div>
              <span>Availability Confidence — not just "in stock"</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800">
                <ShieldCheck size={16} className="text-teal-400" />
              </div>
              <span>Smart alternatives prevent cancellations automatically</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800">
                <Store size={16} className="text-teal-400" />
              </div>
              <span>Reduced inventory effort for 620 partner stores</span>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-navy-800">
            <p className="text-xs text-navy-400">
              Connecting 620 stores · 120,000 users · 3 cities<br />
              Business Rescue Prototype for NOVA CART
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - login */}
      <div className="lg:w-1/2 bg-slate-50 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h3 className="text-2xl font-bold text-navy-900 mb-2">Sign in to NOVA PULSE</h3>
          <p className="text-slate-500 text-sm mb-6">Use a demo account to explore all three roles.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="you@novapulse.demo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="demo123"
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" size="lg" className="w-full">
              Sign In
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Quick Demo Login</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="space-y-3">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc.email, acc.password)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white ring-1 ring-slate-200 hover:ring-teal-300 hover:shadow-sm transition-all text-left group"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${acc.color}`}>
                    {acc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-900">{acc.role}</p>
                    <p className="text-xs text-slate-500 truncate">{acc.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
