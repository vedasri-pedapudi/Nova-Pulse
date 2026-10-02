import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Badge, Button } from '@/components/ui';
import { calculateConfidence, formatLastUpdated } from '@/utils/availability';
import { demandData } from '@/data/mockData';
import type { InventoryAlert } from '@/types';
import { AlertTriangle, Bell, Clock, Search, XCircle, TrendingDown, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const severityConfig = {
  critical: { label: 'Critical', variant: 'error' as const, icon: <XCircle size={16} /> },
  high: { label: 'High', variant: 'warning' as const, icon: <AlertTriangle size={16} /> },
  medium: { label: 'Medium', variant: 'warning' as const, icon: <Clock size={16} /> },
  low: { label: 'Low', variant: 'info' as const, icon: <Bell size={16} /> },
};

export function StoreAlerts({ onNavigate }: Props) {
  const { currentUser, inventory, products, stores } = useApp();
  const storeId = currentUser?.storeId || 'store-1';
  const store = stores.find((s) => s.id === storeId);

  const alerts = useMemo(() => {
    const list: InventoryAlert[] = [];
    inventory.filter((inv) => inv.storeId === storeId).forEach((inv) => {
      const product = products.find((p) => p.id === inv.productId);
      if (!product || !store) return;
      const conf = calculateConfidence(inv, store, product);

      if (inv.stock === 0) {
        const searchCount = demandData.find((d) => d.productName.includes(product.name))?.searches || 0;
        list.push({
          id: `alert-${inv.productId}-oos`,
          productId: inv.productId,
          productName: product.name,
          storeId,
          severity: 'critical',
          message: `${product.name} is out of stock`,
          action: 'Restock immediately',
          searchCount,
        });
      } else if (inv.lastUpdatedMin > 360) {
        list.push({
          id: `alert-${inv.productId}-stale`,
          productId: inv.productId,
          productName: product.name,
          storeId,
          severity: 'high',
          message: `${product.name} inventory is stale — last updated ${formatLastUpdated(inv.lastUpdatedMin)}`,
          action: 'Update inventory count',
        });
      } else if (inv.stock <= 2) {
        list.push({
          id: `alert-${inv.productId}-low`,
          productId: inv.productId,
          productName: product.name,
          storeId,
          severity: 'high',
          message: `Only ${inv.stock} unit${inv.stock > 1 ? 's' : ''} of ${product.name} left`,
          action: 'Restock soon',
        });
      } else if (inv.recentCancellations >= 2) {
        list.push({
          id: `alert-${inv.productId}-cancel`,
          productId: inv.productId,
          productName: product.name,
          storeId,
          severity: 'medium',
          message: `${product.name} has ${inv.recentCancellations} recent cancellations`,
          action: 'Check stock accuracy',
        });
      }
    });

    // Add demand-based alert
    const highDemand = demandData.find((d) => d.unavailableCount > 15);
    if (highDemand) {
      list.push({
        id: 'alert-demand',
        productId: 'demand',
        productName: highDemand.productName,
        storeId,
        severity: 'medium',
        message: `Customers searched for ${highDemand.productName} ${highDemand.searches} times — frequently unavailable`,
        action: 'Consider stocking this product',
        searchCount: highDemand.searches,
      });
    }

    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    list.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    return list;
  }, [inventory, products, store, storeId, demandData]);

  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    high: alerts.filter((a) => a.severity === 'high').length,
    medium: alerts.filter((a) => a.severity === 'medium').length,
    low: alerts.filter((a) => a.severity === 'low').length,
  };

  return (
    <div>
      <PageHeader title="Inventory Alerts" subtitle="Smart alerts highlight only products that need attention — reducing your workload" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(Object.keys(severityConfig) as Array<keyof typeof severityConfig>).map((sev) => {
          const config = severityConfig[sev];
          return (
            <Card key={sev} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{config.label}</p>
                  <p className="text-2xl font-bold text-navy-900">{counts[sev]}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  sev === 'critical' ? 'bg-red-50 text-red-600' :
                  sev === 'high' ? 'bg-amber-50 text-amber-600' :
                  sev === 'medium' ? 'bg-amber-50 text-amber-600' :
                  'bg-teal-50 text-teal-600'
                }`}>
                  {config.icon}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <TrendingDown size={28} className="text-emerald-600 rotate-180" />
            </div>
          </div>
          <p className="font-medium text-navy-900">All clear!</p>
          <p className="text-sm text-slate-400 mt-1">No inventory alerts — your store is in good shape.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            return (
              <Card key={alert.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-50 text-red-600' :
                    alert.severity === 'high' ? 'bg-amber-50 text-amber-600' :
                    'bg-teal-50 text-teal-600'
                  }`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      {alert.searchCount !== undefined && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Search size={10} /> {alert.searchCount} searches
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-navy-900 font-medium">{alert.message}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button size="sm" variant={alert.severity === 'critical' ? 'danger' : 'outline'} onClick={() => onNavigate('store-inventory')}>
                        {alert.action}
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="p-4 mt-4 bg-teal-50 border-teal-100">
        <p className="text-sm text-teal-700">
          NOVA PULSE only alerts you about products that need attention — you don't need to update every product manually. This reduces inventory effort by up to 60%.
        </p>
      </Card>
    </div>
  );
}
