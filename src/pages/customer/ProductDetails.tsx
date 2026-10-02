import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, ConfidenceBadge, Button, Badge } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { ConfidenceModal } from '@/components/ConfidenceModal';
import { buildSearchResult, getConfidenceLabel, formatLastUpdated } from '@/utils/availability';
import { findAlternatives } from '@/utils/alternatives';
import type { SearchResult, ConfidenceBreakdown } from '@/types';
import { MapPin, Clock, RefreshCw, Store as StoreIcon, Check, ArrowLeft, ArrowRight, AlertTriangle, Plus, ShieldCheck } from 'lucide-react';

interface Props {
  productId: string;
  storeId: string;
  onNavigate: (page: string) => void;
  onAddToCart: (result: SearchResult) => void;
}

export function ProductDetails({ productId, storeId, onNavigate, onAddToCart }: Props) {
  const { products, stores, inventory, incrementAlternativesRecommended } = useApp();
  const [modalData, setModalData] = useState<{ breakdown: ConfidenceBreakdown; name: string } | null>(null);
  const [added, setAdded] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const product = products.find((p) => p.id === productId);
  const store = stores.find((s) => s.id === storeId);
  const inv = inventory.find((i) => i.productId === productId && i.storeId === storeId);

  const result = useMemo(() => {
    if (!product || !store || !inv) return null;
    return buildSearchResult(product, store, inv);
  }, [product, store, inv]);

  const alternatives = useMemo(() => {
    if (!product || !store) return [];
    const alts = findAlternatives(product, store, products, stores, inventory, 4);
    return alts.results;
  }, [product, store, products, stores, inventory]);

  if (!product || !store || !inv || !result) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-500">Product not found.</p>
        <Button className="mt-4" onClick={() => onNavigate('customer-search')}>Back to Search</Button>
      </Card>
    );
  }

  const confLabel = getConfidenceLabel(result.confidence);
  const isUnavailable = result.confidence < 30;

  const handleAdd = () => {
    onAddToCart(result);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAlternatives = () => {
    if (alternatives.length > 0) {
      incrementAlternativesRecommended(alternatives.length);
    }
    setShowAlternatives(true);
  };

  return (
    <div>
      <button onClick={() => onNavigate('customer-search')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-800 mb-4 transition-colors">
        <ArrowLeft size={16} />
        Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: product info */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <ProductImage product={product} size="lg" />
              <div className="flex-1">
                <Badge variant="info">{product.category}</Badge>
                <h2 className="text-xl font-bold text-navy-900 mt-2">{product.name}</h2>
                <p className="text-sm text-slate-500">{product.brand} · {product.unit}</p>
                <p className="text-2xl font-bold text-navy-900 mt-3">₹{product.basePrice}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-navy-900 mb-4">Store Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><StoreIcon size={14} /> Store</span>
                <span className="font-medium text-navy-900">{store.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><MapPin size={14} /> Distance</span>
                <span className="font-medium text-navy-900">{store.distanceKm} km · {store.area}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><Clock size={14} /> Est. Delivery</span>
                <span className="font-medium text-navy-900">{result.deliveryMinLow}–{result.deliveryMinHigh} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><RefreshCw size={14} /> Last Updated</span>
                <span className="font-medium text-navy-900">{formatLastUpdated(inv.lastUpdatedMin)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><ShieldCheck size={14} /> Store Reliability</span>
                <span className="font-medium text-navy-900">{store.reliability}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: confidence + actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-900">Availability Confidence</h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${confLabel.bgColor} ring-2 ${confLabel.ringColor}`}>
                <span className={`text-2xl font-bold ${confLabel.color}`}>{result.confidence}%</span>
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${confLabel.color}`}>{confLabel.label}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {isUnavailable
                    ? 'This product appears to be out of stock.'
                    : result.confidence < 55
                    ? 'Inventory may be outdated. Consider verifying.'
                    : 'Inventory is fresh and stock looks reliable.'}
                </p>
                <button
                  onClick={() => setModalData({ breakdown: result.confidenceBreakdown, name: product.name })}
                  className="mt-2 text-xs font-medium text-teal-600 hover:text-teal-700"
                >
                  Why {result.confidence}%? →
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {result.confidenceBreakdown.factors.slice(0, 4).map((factor, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {factor.positive ? (
                    <Check size={14} className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                  )}
                  <span className={factor.positive ? 'text-slate-600' : 'text-amber-700'}>{factor.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {isUnavailable ? (
                <Button variant="secondary" size="lg" onClick={handleAlternatives}>
                  Find Smart Alternatives
                  <ArrowRight size={18} />
                </Button>
              ) : (
                <>
                  <Button variant={added ? 'secondary' : 'primary'} size="lg" onClick={handleAdd}>
                    {added ? <><Check size={18} /> Added to Cart!</> : <><Plus size={18} /> Add to Cart</>}
                  </Button>
                  {result.confidence < 55 && (
                    <Button variant="outline" size="md" onClick={handleAlternatives}>
                      View Alternatives
                      <ArrowRight size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="md" onClick={() => onNavigate('customer-cart')}>
                    Go to Cart
                    <ArrowRight size={16} />
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Alternatives section */}
          {showAlternatives && alternatives.length > 0 && (
            <Card className="p-5 animate-slide-up">
              <h3 className="font-semibold text-navy-900 mb-1">Smart Alternatives</h3>
              <p className="text-xs text-slate-500 mb-4">{product.name} is unavailable at {store.name}</p>
              <div className="space-y-2">
                {alternatives.map((alt, i) => (
                  <div key={`${alt.product.id}-${alt.store.id}`} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-teal-200 transition-all">
                    <ProductImage product={alt.product} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{alt.product.name}</p>
                      <p className="text-xs text-slate-500 truncate">{alt.store.name} · ₹{alt.price}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ConfidenceBadge confidence={alt.confidence} size="sm" />
                      <Button size="sm" onClick={() => { onAddToCart(alt); onNavigate('customer-cart'); }}>
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Similar products (always show if available) */}
          {!showAlternatives && alternatives.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-navy-900 mb-3">Similar Products Available</h3>
              <div className="space-y-2">
                {alternatives.slice(0, 3).map((alt) => (
                  <div key={`${alt.product.id}-${alt.store.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => onNavigate('customer-search')}>
                    <ProductImage product={alt.product} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{alt.product.name}</p>
                      <p className="text-xs text-slate-500">{alt.store.name} · ₹{alt.price}</p>
                    </div>
                    <ConfidenceBadge confidence={alt.confidence} size="sm" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

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
