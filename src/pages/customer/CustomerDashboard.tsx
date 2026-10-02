import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, ConfidenceBadge, Button, ProgressBar, Badge } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { ConfidenceModal } from '@/components/ConfidenceModal';
import { calculateConfidence, getConfidenceLabel, formatLastUpdated, estimateDelivery } from '@/utils/availability';
import type { ConfidenceBreakdown } from '@/types';
import { Search, MapPin, Clock, TrendingUp, ShieldCheck, Store as StoreIcon, ArrowRight, Package, Zap, AlertTriangle } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
  onSelectProduct: (productId: string, storeId: string) => void;
}

export function CustomerDashboard({ onNavigate, onSelectProduct }: Props) {
  const { stores, products, inventory, currentUser, orders, searchCounts, trackSearch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalBreakdown, setModalBreakdown] = useState<{ breakdown: ConfidenceBreakdown; name: string } | null>(null);

  const nearbyStores = stores.slice(0, 4);

  // Build high-availability products
  const highAvailability = useMemo(() => {
    const results: { product: typeof products[0]; store: typeof stores[0]; confidence: number }[] = [];
    inventory.forEach((inv) => {
      if (inv.stock <= 0) return;
      const store = stores.find((s) => s.id === inv.storeId);
      const product = products.find((p) => p.id === inv.productId);
      if (!store || !product) return;
      const conf = calculateConfidence(inv, store, product);
      if (conf.total >= 80) results.push({ product, store, confidence: conf.total });
    });
    return results.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
  }, [inventory, stores, products]);

  // Popular products based on search counts
  const popularProducts = useMemo(() => {
    const popular = products.slice(0, 8).map((p) => {
      const inv = inventory.find((i) => i.productId === p.id && i.stock > 0);
      if (!inv) return null;
      const store = stores.find((s) => s.id === inv.storeId);
      if (!store) return null;
      const conf = calculateConfidence(inv, store, p);
      return { product: p, store, confidence: conf.total, inv };
    }).filter(Boolean) as { product: typeof products[0]; store: typeof stores[0]; confidence: number; inv: typeof inventory[0] }[];
    return popular;
  }, [products, inventory, stores]);

  const recentOrders = orders.slice(0, 2);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      trackSearch(searchQuery.trim());
      onNavigate('customer-search');
    }
  };

  return (
    <div>
      <PageHeader
        title={`Welcome, ${currentUser?.name?.split(' ')[0] || 'there'}`}
        subtitle="Discover reliable products from stores near you"
      />

      {/* Search bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for milk, bread, eggs, medicine, stationery..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <Button size="lg" onClick={handleSearch}>
            <Search size={18} />
            Search
          </Button>
        </div>
      </div>

      {/* Reliability indicator */}
      <Card className="mb-6 p-4 bg-gradient-to-r from-navy-900 to-navy-800 border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
              <ShieldCheck size={20} className="text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-navy-200">Your Order Reliability Today</p>
              <p className="text-xl font-bold text-white">High — 92% avg confidence in your area</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md">3 orders delivered on time</Badge>
            <Badge variant="info" size="md">1 cancellation prevented</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Nearby stores + Recent orders */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <StoreIcon size={18} className="text-teal-600" />
              Nearby Stores
            </h3>
            <div className="space-y-3">
              {nearbyStores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate('customer-search')}>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{store.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <MapPin size={12} />
                      {store.area} · {store.distanceKm} km
                      <Badge variant={store.inventoryAccuracy >= 85 ? 'success' : store.inventoryAccuracy >= 75 ? 'warning' : 'error'}>{store.inventoryAccuracy}% accurate</Badge>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-teal-600" />
              Recent Orders
            </h3>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate('customer-orders')}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-navy-900">{order.id}</span>
                      <Badge variant={order.status === 'delivered' ? 'success' : 'info'}>{order.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{order.items.length} items · ₹{order.total}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No recent orders yet.</p>
            )}
          </Card>
        </div>

        {/* Right: High availability + Popular */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-900 flex items-center gap-2">
                <Zap size={18} className="text-teal-600" />
                High Availability Products
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('customer-search')}>
                View all <ArrowRight size={14} />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highAvailability.map(({ product, store, confidence }) => {
                const confLabel = getConfidenceLabel(confidence);
                return (
                  <div
                    key={`${product.id}-${store.id}`}
                    onClick={() => onSelectProduct(product.id, store.id)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <ProductImage product={product} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500 truncate">{store.name} · ₹{product.basePrice}</p>
                      <div className="mt-1">
                        <span className={`text-xs font-semibold ${confLabel.color}`}>{confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-600" />
                Popular Near You
              </h3>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('customer-search')}>
                View all <ArrowRight size={14} />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularProducts.slice(0, 4).map(({ product, store, confidence, inv }) => {
                const delivery = estimateDelivery(store, confidence);
                return (
                  <div
                    key={`${product.id}-${store.id}`}
                    onClick={() => onSelectProduct(product.id, store.id)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <ProductImage product={product} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500 truncate">{store.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <ConfidenceBadge confidence={confidence} size="sm" />
                        <span className="text-[10px] text-slate-400">{delivery.low}-{delivery.high} min</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {modalBreakdown && (
        <ConfidenceModal
          breakdown={modalBreakdown.breakdown}
          productName={modalBreakdown.name}
          onClose={() => setModalBreakdown(null)}
        />
      )}
    </div>
  );
}
