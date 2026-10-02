import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { calculateConfidence, formatLastUpdated, getConfidenceLabel } from '@/utils/availability';
import { Plus, Minus, RefreshCw, X, Check, Package } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export function StoreInventory({ onNavigate }: Props) {
  const { currentUser, inventory, products, stores, updateInventory, incrementInventoryMismatchesPrevented } = useApp();
  const storeId = currentUser?.storeId || 'store-1';
  const store = stores.find((s) => s.id === storeId);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const storeInventory = useMemo(() => {
    return inventory
      .filter((inv) => inv.storeId === storeId)
      .map((inv) => {
        const product = products.find((p) => p.id === inv.productId);
        if (!product || !store) return null;
        const conf = calculateConfidence(inv, store, product);
        return { inv, product, conf };
      })
      .filter(Boolean) as { inv: typeof inventory[0]; product: typeof products[0]; conf: ReturnType<typeof calculateConfidence> }[];
  }, [inventory, products, store, storeId]);

  const handleUpdate = (productId: string, newStock: number) => {
    updateInventory(storeId, productId, { stock: newStock });
    incrementInventoryMismatchesPrevented();
    setEditingProduct(null);
    setToast('Inventory updated — confidence recalculated');
    setTimeout(() => setToast(null), 2500);
  };

  const handleMarkUnavailable = (productId: string) => {
    updateInventory(storeId, productId, { stock: 0 });
    setEditingProduct(null);
    setToast('Product marked unavailable');
    setTimeout(() => setToast(null), 2500);
  };

  const handleRefreshTimestamp = (productId: string) => {
    updateInventory(storeId, productId, {});
    setToast('Inventory timestamp refreshed');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div>
      <PageHeader title="Inventory Management" subtitle={store?.name} />

      {toast && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2 animate-slide-up">
          <Check size={16} /> {toast}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Product</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Last Updated</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Confidence</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {storeInventory.map(({ inv, product, conf }) => {
                const confLabel = getConfidenceLabel(conf.total);
                const status = inv.stock === 0 ? { label: 'Out of Stock', variant: 'error' as const } :
                  conf.total < 55 ? { label: 'Verify', variant: 'warning' as const } :
                  { label: 'Healthy', variant: 'success' as const };
                return (
                  <tr key={inv.productId} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage product={product} size="sm" />
                        <div>
                          <p className="font-medium text-navy-900">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className={`font-semibold ${inv.stock === 0 ? 'text-red-600' : inv.stock <= 2 ? 'text-amber-600' : 'text-navy-900'}`}>{inv.stock}</span>
                    </td>
                    <td className="text-center px-4 py-3 text-slate-500">{formatLastUpdated(inv.lastUpdatedMin)}</td>
                    <td className="text-center px-4 py-3">
                      <span className={`font-semibold ${confLabel.color}`}>{conf.total}%</span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="text-right px-4 py-3">
                      {editingProduct === inv.productId ? (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleUpdate(inv.productId, inv.stock + 1)} className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200" title="Increase stock">
                            <Plus size={14} />
                          </button>
                          <button onClick={() => handleUpdate(inv.productId, Math.max(0, inv.stock - 1))} className="p-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200" title="Decrease stock">
                            <Minus size={14} />
                          </button>
                          <button onClick={() => handleMarkUnavailable(inv.productId)} className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200" title="Mark unavailable">
                            <X size={14} />
                          </button>
                          <button onClick={() => setEditingProduct(null)} className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200" title="Close">
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleRefreshTimestamp(inv.productId)} className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-teal-600" title="Refresh timestamp">
                            <RefreshCw size={14} />
                          </button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(inv.productId)}>
                            Update
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 mt-4 bg-slate-50">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Package size={16} className="text-teal-600" />
          Updating inventory refreshes the timestamp, recalculates availability confidence, and immediately updates customer search results and admin analytics.
        </div>
      </Card>
    </div>
  );
}
