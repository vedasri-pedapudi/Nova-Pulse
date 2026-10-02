import { useState, useMemo } from 'react';
import { useApp, generateOrderId } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, ConfidenceBadge, Button, Badge, ProgressBar } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { ConfidenceModal } from '@/components/ConfidenceModal';
import { findAlternatives } from '@/utils/alternatives';
import { calculateConfidence, getConfidenceLabel } from '@/utils/availability';
import type { CartItem, SearchResult, ConfidenceBreakdown } from '@/types';
import { ShoppingCart, AlertTriangle, Check, X, ArrowRight, Trash2, Zap, RefreshCw, Clock, Package, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
  onOrderPlaced: (orderId: string) => void;
}

export function SmartCart({ onNavigate, onOrderPlaced }: Props) {
  const { cart, removeFromCart, addToCart, updateCartItem, products, stores, inventory, placeOrder, incrementCancellationsPrevented, incrementAlternativesRecommended } = useApp();
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [modalData, setModalData] = useState<{ breakdown: ConfidenceBreakdown; name: string } | null>(null);
  const [altModal, setAltModal] = useState<{ item: CartItem; results: SearchResult[] } | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [showSimButton, setShowSimButton] = useState(true);

  const reEvaluatedCart = useMemo(() => {
    return cart.map((item) => {
      const currentInv = inventory.find((i) => i.productId === item.product.id && i.storeId === item.store.id);
      if (!currentInv) return item;
      const store = stores.find((s) => s.id === item.store.id);
      if (!store) return item;
      const product = products.find((p) => p.id === item.product.id);
      if (!product) return item;
      const breakdown = calculateConfidence(currentInv, store, product);
      return {
        ...item,
        inventory: currentInv,
        confidence: breakdown.total,
        confidenceBreakdown: breakdown,
        needsAttention: breakdown.total < 55,
      };
    });
  }, [cart, inventory, stores, products]);

  const needsAttention = reEvaluatedCart.filter((item) => item.needsAttention);
  const allVerified = verified && needsAttention.length === 0;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1200);
  };

  const handleSimulateIssue = () => {
    const candidate = cart.find((item) => item.inventory.stock > 0);
    if (!candidate) return;
    const updatedInv = { ...candidate.inventory, stock: 0 };
    const store = stores.find((s) => s.id === candidate.store.id);
    const product = products.find((p) => p.id === candidate.product.id);
    if (!store || !product) return;
    const breakdown = calculateConfidence(updatedInv, store, product);
    updateCartItem(candidate.id, {
      inventory: updatedInv,
      confidence: breakdown.total,
      confidenceBreakdown: breakdown,
      needsAttention: true,
    });
    setSimulated(true);
    setShowSimButton(false);
    setVerified(false);
  };

  const handleFindAlternative = (item: CartItem) => {
    const alts = findAlternatives(item.product, item.store, products, stores, inventory, 5);
    if (alts.results.length > 0) {
      incrementAlternativesRecommended(alts.results.length);
      setAltModal({ item, results: alts.results });
    }
  };

  const handleReplaceItem = (item: CartItem, alt: SearchResult) => {
    removeFromCart(item.id);
    addToCart({
      id: `${alt.product.id}-${alt.store.id}`,
      product: alt.product,
      store: alt.store,
      inventory: alt.inventory,
      confidence: alt.confidence,
      confidenceBreakdown: alt.confidenceBreakdown,
      deliveryMinLow: alt.deliveryMinLow,
      deliveryMinHigh: alt.deliveryMinHigh,
      price: alt.price,
      needsAttention: false,
      replacedFrom: item.product.name,
    });
    setAltModal(null);
    incrementCancellationsPrevented();
    setVerified(false);
  };

  const handlePlaceOrder = () => {
    if (!allVerified || cart.length === 0) return;
    const orderItems = reEvaluatedCart.map((item) => ({
      productName: item.product.name,
      storeName: item.store.name,
      price: item.price,
      confidence: item.confidence,
      replacedFrom: item.replacedFrom,
    }));
    const prevented = cart.filter((item) => item.replacedFrom).length;
    const orderId = generateOrderId();
    const avgDeliveryLow = Math.min(...cart.map((i) => i.deliveryMinLow));
    const avgDeliveryHigh = Math.max(...cart.map((i) => i.deliveryMinHigh));

    placeOrder({
      id: orderId,
      items: orderItems,
      storeName: cart[0]?.store.name || 'Multiple Stores',
      total,
      status: 'placed',
      placedAt: new Date().toISOString(),
      deliveryEstimateLow: avgDeliveryLow,
      deliveryEstimateHigh: avgDeliveryHigh,
      cancellationsPrevented: prevented,
    });

    cart.forEach((item) => removeFromCart(item.id));
    onOrderPlaced(orderId);
  };

  if (cart.length === 0) {
    return (
      <div>
        <PageHeader title="Smart Cart" subtitle="Your cart verifies availability before you order" />
        <Card className="p-12 text-center">
          <ShoppingCart size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Your cart is empty</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Add products to see the smart availability verification in action.</p>
          <Button onClick={() => onNavigate('customer-search')}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Smart Cart"
        subtitle="Availability verification runs before you order"
        action={
          showSimButton && (
            <Button variant="danger" size="sm" onClick={handleSimulateIssue}>
              <Zap size={16} />
              Simulate Availability Issue
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {simulated && (
            <Card className="p-4 bg-amber-50 border-amber-200 animate-slide-up">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle size={18} />
                <p className="text-sm font-medium">Availability issue simulated — a product in your cart has become unavailable.</p>
              </div>
            </Card>
          )}

          {reEvaluatedCart.map((item) => {
            const isUnavailable = item.confidence < 30;
            return (
              <Card key={item.id} className={`p-4 ${item.needsAttention ? 'ring-2 ring-amber-200' : ''}`}>
                <div className="flex items-center gap-4">
                  <ProductImage product={item.product} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-navy-900 truncate">{item.product.name}</h3>
                      {item.replacedFrom && (
                        <Badge variant="info" size="sm">
                          <RefreshCw size={10} />
                          Replaced
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{item.store.name} · ₹{item.price}</p>
                    {item.replacedFrom && (
                      <p className="text-[10px] text-teal-600 mt-0.5">Replaced from: {item.replacedFrom}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => setModalData({ breakdown: item.confidenceBreakdown, name: item.product.name })}>
                        <ConfidenceBadge confidence={item.confidence} size="sm" />
                      </button>
                      <span className="text-xs text-slate-400">{item.deliveryMinLow}-{item.deliveryMinHigh} min</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-navy-900">₹{item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {item.needsAttention && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2.5 border border-amber-100">
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                      <AlertTriangle size={16} />
                      {isUnavailable ? 'Product unavailable at this store' : 'Low availability confidence'}
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => handleFindAlternative(item)}>
                      {isUnavailable ? 'Find Alternative' : 'Verify / Find Alternative'}
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                )}

                {!item.needsAttention && verified && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                    <Check size={14} />
                    Verified — availability confirmed
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card className="p-5 sticky top-6">
            <h3 className="font-semibold text-navy-900 mb-4">Order Summary</h3>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Items</span>
                <span className="font-medium text-navy-900">{cart.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-navy-900">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="font-semibold text-navy-900">Total</span>
                <span className="font-bold text-navy-900 text-lg">₹{total}</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className={allVerified ? 'text-emerald-500' : 'text-slate-400'} />
                <span className="text-sm font-medium text-slate-700">Availability Check</span>
              </div>
              {needsAttention.length > 0 ? (
                <>
                  <p className="text-xs text-amber-700 mb-2">{needsAttention.length} item{needsAttention.length > 1 ? 's' : ''} need attention</p>
                  <ProgressBar value={cart.length - needsAttention.length} max={cart.length} color="amber" />
                </>
              ) : verifying ? (
                <>
                  <p className="text-xs text-teal-600 mb-2 flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin" />
                    Verifying availability...
                  </p>
                  <ProgressBar value={50} color="teal" />
                </>
              ) : verified ? (
                <>
                  <p className="text-xs text-emerald-600 mb-2 flex items-center gap-1">
                    <Check size={12} />
                    Cart verified successfully
                  </p>
                  <ProgressBar value={100} color="emerald" />
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-500 mb-2">Run verification before placing order</p>
                  <ProgressBar value={0} color="navy" />
                </>
              )}
            </div>

            <div className="space-y-2">
              {!verified && needsAttention.length === 0 && !verifying && (
                <Button variant="secondary" className="w-full" onClick={handleVerify}>
                  <ShieldCheck size={18} />
                  Verify Availability
                </Button>
              )}
              {verifying && (
                <Button variant="secondary" className="w-full" disabled>
                  <RefreshCw size={18} className="animate-spin" />
                  Verifying...
                </Button>
              )}
              {verified && needsAttention.length === 0 && (
                <Button variant="primary" className="w-full" onClick={handlePlaceOrder}>
                  <Package size={18} />
                  Place Order · ₹{total}
                </Button>
              )}
              {needsAttention.length > 0 && (
                <div className="text-xs text-amber-600 text-center py-2">
                  Resolve {needsAttention.length} item{needsAttention.length > 1 ? 's' : ''} above to continue
                </div>
              )}
            </div>

            {cart.some((i) => i.replacedFrom) && (
              <div className="mt-3 rounded-lg bg-teal-50 p-3 text-xs text-teal-700 flex items-center gap-1.5">
                <Sparkles size={14} />
                {cart.filter((i) => i.replacedFrom).length} potential cancellation prevented
              </div>
            )}
          </Card>
        </div>
      </div>

      {altModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setAltModal(null)}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-bold text-navy-900">Smart Alternatives</h3>
                <p className="text-sm text-slate-500">{altModal.item.product.name} — {altModal.item.store.name}</p>
              </div>
              <button onClick={() => setAltModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {altModal.results.map((alt) => (
                <div key={`${alt.product.id}-${alt.store.id}`} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all">
                  <ProductImage product={alt.product} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-900">{alt.product.name}</p>
                    <p className="text-xs text-slate-500">{alt.store.name} · {alt.store.distanceKm} km · ₹{alt.price}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ConfidenceBadge confidence={alt.confidence} size="sm" />
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{alt.deliveryMinLow}-{alt.deliveryMinHigh} min</span>
                    </div>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => handleReplaceItem(altModal.item, alt)}>
                    Replace
                    <ArrowRight size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-500" />
                Replacing an unavailable product prevents a cancellation and keeps your order on track.
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
