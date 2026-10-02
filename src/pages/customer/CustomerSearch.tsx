import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, ConfidenceBadge, Button, Badge, ProgressBar } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { ConfidenceModal } from '@/components/ConfidenceModal';
import { buildSearchResult, getConfidenceLabel, formatLastUpdated } from '@/utils/availability';
import { findAlternatives } from '@/utils/alternatives';
import type { SearchResult, ConfidenceBreakdown } from '@/types';
import { Search, MapPin, Clock, Package, Filter, AlertTriangle, ArrowRight, RefreshCw, Store as StoreIcon, Check, X } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
  onSelectProduct: (productId: string, storeId: string) => void;
  onAddToCart: (result: SearchResult) => void;
}

const categories = ['All', 'Dairy', 'Bakery', 'Grocery', 'Pharmacy', 'Stationery', 'Snacks', 'Vegetables'];
const sortOptions = [
  { value: 'confidence', label: 'Highest Confidence' },
  { value: 'distance', label: 'Nearest Store' },
  { value: 'delivery', label: 'Fastest Delivery' },
  { value: 'price', label: 'Lowest Price' },
];

export function CustomerSearch({ onNavigate, onSelectProduct, onAddToCart }: Props) {
  const { stores, products, inventory, trackSearch, incrementAlternativesRecommended } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('confidence');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [modalData, setModalData] = useState<{ breakdown: ConfidenceBreakdown; name: string } | null>(null);
  const [alternatives, setAlternatives] = useState<{ productName: string; results: SearchResult[]; storeName: string } | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const results = useMemo(() => {
    let list: SearchResult[] = [];
    inventory.forEach((inv) => {
      const store = stores.find((s) => s.id === inv.storeId);
      const product = products.find((p) => p.id === inv.productId);
      if (!store || !product) return;

      if (query) {
        const q = query.toLowerCase();
        if (!product.name.toLowerCase().includes(q) && !product.category.toLowerCase().includes(q) && !product.brand.toLowerCase().includes(q)) return;
      }
      if (category !== 'All' && product.category !== category) return;

      const result = buildSearchResult(product, store, inv);
      if (confidenceFilter === 'high' && result.confidence < 80) return;
      if (confidenceFilter === 'medium' && (result.confidence < 55 || result.confidence >= 80)) return;
      if (confidenceFilter === 'low' && result.confidence >= 55) return;

      list.push(result);
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'distance': return a.store.distanceKm - b.store.distanceKm;
        case 'delivery': return a.deliveryMinLow - b.deliveryMinLow;
        case 'price': return a.price - b.price;
        default: return b.confidence - a.confidence;
      }
    });

    return list;
  }, [query, category, sortBy, confidenceFilter, inventory, stores, products]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim()) trackSearch(q.trim());
  };

  const handleFindAlternatives = (product: typeof products[0], store: typeof stores[0]) => {
    const alts = findAlternatives(product, store, products, stores, inventory);
    if (alts.results.length > 0) {
      incrementAlternativesRecommended(alts.results.length);
      setAlternatives({ productName: product.name, results: alts.results, storeName: store.name });
    }
  };

  const handleAddToCart = (result: SearchResult) => {
    onAddToCart(result);
    setAddedToCart(`${result.product.id}-${result.store.id}`);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div>
      <PageHeader title="Search Products" subtitle="Find reliable products from nearby stores with availability confidence" />

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search milk, bread, eggs, medicine, stationery..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <Filter size={14} />
          <span>Filters:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              category === cat ? 'bg-navy-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
        <div className="flex-1" />
        <select
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Confidence</option>
          <option value="high">High (80%+)</option>
          <option value="medium">Medium (55-79%)</option>
          <option value="low">Low (&lt;55%)</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <Card className="p-12 text-center">
          <Package size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Try a different search term or filter.</p>
        </Card>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-3">{results.length} products found</p>
          <div className="grid grid-cols-1 gap-3">
            {results.map((result) => {
              const confLabel = getConfidenceLabel(result.confidence);
              const isUnavailable = result.confidence < 30;
              const cartKey = `${result.product.id}-${result.store.id}`;
              const added = addedToCart === cartKey;

              return (
                <Card key={cartKey} className="p-4 hover:shadow-md transition-shadow" hoverable={false}>
                  <div className="flex items-center gap-4">
                    <ProductImage product={result.product} size="lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-navy-900 truncate">{result.product.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <StoreIcon size={12} />
                            {result.store.name}
                            <span className="text-slate-300">·</span>
                            <MapPin size={12} />
                            {result.store.distanceKm} km
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-navy-900">₹{result.price}</p>
                          <p className="text-xs text-slate-400">{result.product.unit}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setModalData({ breakdown: result.confidenceBreakdown, name: result.product.name })}
                          className="hover:scale-105 transition-transform"
                        >
                          <ConfidenceBadge confidence={result.confidence} size="md" />
                        </button>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <RefreshCw size={12} />
                          {formatLastUpdated(result.inventory.lastUpdatedMin)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock size={12} />
                          {result.deliveryMinLow}–{result.deliveryMinHigh} min
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        {isUnavailable ? (
                          <>
                            <Badge variant="error">
                              <AlertTriangle size={12} />
                              Out of Stock
                            </Badge>
                            <Button size="sm" variant="secondary" onClick={() => handleFindAlternatives(result.product, result.store)}>
                              Find Alternatives
                              <ArrowRight size={14} />
                            </Button>
                          </>
                        ) : result.confidence < 55 ? (
                          <>
                            <Badge variant="warning">
                              <AlertTriangle size={12} />
                              May be outdated
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => onSelectProduct(result.product.id, result.store.id)}>
                              View Details
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleFindAlternatives(result.product, result.store)}>
                              View Alternatives
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => onSelectProduct(result.product.id, result.store.id)}>
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant={added ? 'secondary' : 'primary'}
                              onClick={() => handleAddToCart(result)}
                            >
                              {added ? (
                                <><Check size={14} /> Added!</>
                              ) : (
                                <>Add to Cart</>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Alternatives modal */}
      {alternatives && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setAlternatives(null)}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-bold text-navy-900">Smart Alternatives</h3>
                <p className="text-sm text-slate-500">
                  {alternatives.productName} unavailable at {alternatives.storeName}
                </p>
              </div>
              <button onClick={() => setAlternatives(null)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {alternatives.results.map((alt, i) => (
                <div key={`${alt.product.id}-${alt.store.id}`} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all">
                  <ProductImage product={alt.product} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-900">{alt.product.name}</p>
                    <p className="text-xs text-slate-500">{alt.store.name} · {alt.store.distanceKm} km · ₹{alt.price}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ConfidenceBadge confidence={alt.confidence} size="sm" />
                      <span className="text-xs text-slate-400">{alt.deliveryMinLow}-{alt.deliveryMinHigh} min</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={addedToCart === `${alt.product.id}-${alt.store.id}` ? 'secondary' : 'primary'}
                    onClick={() => { handleAddToCart(alt); setAlternatives(null); onNavigate('customer-cart'); }}
                  >
                    {addedToCart === `${alt.product.id}-${alt.store.id}` ? <Check size={14} /> : `Option ${i + 1}`}
                  </Button>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Check size={14} className="text-emerald-500" />
                Alternatives sorted by availability confidence and delivery time. Selecting one prevents a potential cancellation.
              </p>
            </div>
          </div>
        </div>
      )}

      {modalData && (
        <ConfidenceModal
          breakdown={modalData.breakdown}
          productName={modalData.name}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
