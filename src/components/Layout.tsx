import { useState, type ReactNode } from 'react';
import { useApp } from '@/store/AppContext';
import type { Role } from '@/types';
import { Button } from '@/components/ui';
import {
  LayoutDashboard, Search, ShoppingCart, Package, History, MessageSquare,
  Store, ClipboardList, Bell, TrendingUp, BarChart3,
  Settings, LogOut, Menu, X, Activity, Zap, ShieldAlert, Target, Lightbulb, FileText,
} from 'lucide-react';

interface NavItem {
  label: string;
  page: string;
  icon: ReactNode;
}

interface LayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const { currentUser, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const role = currentUser.role;

  const navItems: Record<Role, NavItem[]> = {
    customer: [
      { label: 'Dashboard', page: 'customer-dashboard', icon: <LayoutDashboard size={18} /> },
      { label: 'Search Products', page: 'customer-search', icon: <Search size={18} /> },
      { label: 'Smart Cart', page: 'customer-cart', icon: <ShoppingCart size={18} /> },
      { label: 'Order History', page: 'customer-orders', icon: <History size={18} /> },
      { label: 'Feedback', page: 'customer-feedback', icon: <MessageSquare size={18} /> },
    ],
    store: [
      { label: 'Store Dashboard', page: 'store-dashboard', icon: <LayoutDashboard size={18} /> },
      { label: 'Inventory', page: 'store-inventory', icon: <Package size={18} /> },
      { label: 'Orders', page: 'store-orders', icon: <ClipboardList size={18} /> },
      { label: 'Inventory Alerts', page: 'store-alerts', icon: <Bell size={18} /> },
      { label: 'Product Demand', page: 'store-demand', icon: <TrendingUp size={18} /> },
      { label: 'Performance', page: 'store-performance', icon: <BarChart3 size={18} /> },
    ],
    admin: [
      { label: 'BI Dashboard', page: 'admin-dashboard', icon: <LayoutDashboard size={18} /> },
      { label: 'Cancellation Analytics', page: 'admin-cancellations', icon: <ShieldAlert size={18} /> },
      { label: 'Inventory Reliability', page: 'admin-inventory', icon: <Activity size={18} /> },
      { label: 'Customer Retention', page: 'admin-retention', icon: <TrendingUp size={18} /> },
      { label: 'Support Analytics', page: 'admin-support', icon: <MessageSquare size={18} /> },
      { label: 'Business Impact', page: 'admin-impact', icon: <Target size={18} /> },
      { label: 'Implementation Plan', page: 'admin-plan', icon: <FileText size={18} /> },
    ],
  };

  const items = navItems[role];
  const roleLabel = role === 'customer' ? 'Customer' : role === 'store' ? 'Partner Store' : 'Admin';
  const roleColor = role === 'customer' ? 'bg-teal-100 text-teal-700' : role === 'store' ? 'bg-amber-100 text-amber-700' : 'bg-navy-100 text-navy-700';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-navy-900/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-navy-900 text-white z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-5 border-b border-navy-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">NOVA PULSE</h1>
              <p className="text-[10px] text-navy-300 font-medium tracking-wide uppercase">Local Commerce Intelligence</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${roleColor}`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-[10px] text-navy-300">{roleLabel}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {items.map((item) => (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 py-3 border-t border-navy-800">
            <Button variant="ghost" size="sm" className="w-full text-navy-200 hover:bg-navy-800 hover:text-white" onClick={logout}>
              <LogOut size={16} />
              Switch Role
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-navy-900">NOVA PULSE</span>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-100">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
