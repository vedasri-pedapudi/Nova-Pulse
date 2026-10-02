import type { InventoryItem, Store, Product, ConfidenceBreakdown, ConfidenceFactor, SearchResult } from '@/types';

export function calculateConfidence(
  inventory: InventoryItem,
  store: Store,
  product: Product,
): ConfidenceBreakdown {
  const factors: ConfidenceFactor[] = [];

  // Inventory freshness: 0-100 based on minutes since last update
  let inventoryFreshness: number;
  if (inventory.lastUpdatedMin <= 30) {
    inventoryFreshness = 98;
    factors.push({ label: 'Inventory updated recently', positive: true, detail: `Updated ${inventory.lastUpdatedMin} minutes ago` });
  } else if (inventory.lastUpdatedMin <= 120) {
    inventoryFreshness = 85;
    factors.push({ label: 'Inventory updated recently', positive: true, detail: `Updated ${Math.floor(inventory.lastUpdatedMin / 60)} hours ago` });
  } else if (inventory.lastUpdatedMin <= 720) {
    inventoryFreshness = 65;
    factors.push({ label: 'Inventory update is moderate', positive: false, detail: `Updated ${Math.floor(inventory.lastUpdatedMin / 60)} hours ago` });
  } else {
    inventoryFreshness = 35;
    factors.push({ label: 'Inventory is stale', positive: false, detail: `Last updated ${Math.floor(inventory.lastUpdatedMin / 60)} hours ago` });
  }

  // Stock level
  let stockLevel: number;
  if (inventory.stock === 0) {
    stockLevel = 0;
    factors.push({ label: 'Out of stock', positive: false, detail: '0 units reported in stock' });
  } else if (inventory.stock <= 2) {
    stockLevel = 50;
    factors.push({ label: 'Low stock', positive: false, detail: `Only ${inventory.stock} unit${inventory.stock > 1 ? 's' : ''} reported` });
  } else if (inventory.stock <= 6) {
    stockLevel = 78;
    factors.push({ label: 'Moderate stock', positive: true, detail: `${inventory.stock} units reported in stock` });
  } else {
    stockLevel = 96;
    factors.push({ label: 'Good stock level', positive: true, detail: `${inventory.stock} units reported in stock` });
  }

  // Store reliability
  const storeReliability = store.reliability;
  if (storeReliability >= 90) {
    factors.push({ label: 'Store has high inventory accuracy', positive: true, detail: `${store.name} reliability: ${storeReliability}%` });
  } else if (storeReliability >= 80) {
    factors.push({ label: 'Store has moderate accuracy', positive: true, detail: `${store.name} reliability: ${storeReliability}%` });
  } else {
    factors.push({ label: 'Store has low accuracy', positive: false, detail: `${store.name} reliability: ${storeReliability}%` });
  }

  // Recent availability: based on cancellations
  let recentAvailability: number;
  if (inventory.recentCancellations === 0) {
    recentAvailability = 98;
    factors.push({ label: 'No recent cancellations for this product', positive: true, detail: '0 cancellations in recent orders' });
  } else if (inventory.recentCancellations <= 2) {
    recentAvailability = 80;
    factors.push({ label: 'Some recent cancellations', positive: false, detail: `${inventory.recentCancellations} recent cancellation${inventory.recentCancellations > 1 ? 's' : ''}` });
  } else {
    recentAvailability = 55;
    factors.push({ label: 'Frequent cancellations for this product', positive: false, detail: `${inventory.recentCancellations} recent cancellations` });
  }

  // Stale risk penalty
  const staleRisk = inventory.lastUpdatedMin > 360 ? (inventory.lastUpdatedMin > 720 ? 25 : 12) : 0;
  if (staleRisk > 0) {
    factors.push({ label: 'Risk from stale inventory data', positive: false, detail: `Stale risk penalty: -${staleRisk}%` });
  }

  const total = Math.max(
    5,
    Math.min(
      99,
      Math.round(
        inventoryFreshness * 0.3 +
        stockLevel * 0.3 +
        storeReliability * 0.2 +
        recentAvailability * 0.2 -
        staleRisk,
      ),
    ),
  );

  return { inventoryFreshness, stockLevel, storeReliability, recentAvailability, staleRisk, total, factors };
}

export function getConfidenceLabel(confidence: number): { label: string; color: string; bgColor: string; ringColor: string } {
  if (confidence >= 80) {
    return { label: 'High Confidence', color: 'text-emerald-700', bgColor: 'bg-emerald-50', ringColor: 'ring-emerald-200' };
  } else if (confidence >= 55) {
    return { label: 'Medium Confidence', color: 'text-amber-700', bgColor: 'bg-amber-50', ringColor: 'ring-amber-200' };
  } else {
    return { label: 'Low Confidence', color: 'text-red-700', bgColor: 'bg-red-50', ringColor: 'ring-red-200' };
  }
}

export function formatLastUpdated(min: number): string {
  if (min < 60) return `${min} min ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function estimateDelivery(store: Store, confidence: number): { low: number; high: number } {
  const base = store.avgPrepTime + Math.round(store.distanceKm * 4);
  const confidencePenalty = confidence < 60 ? 5 : 0;
  const low = base + confidencePenalty;
  const high = low + 8;
  return { low, high };
}

export function buildSearchResult(
  product: Product,
  store: Store,
  inventory: InventoryItem,
): SearchResult {
  const confidenceBreakdown = calculateConfidence(inventory, store, product);
  const delivery = estimateDelivery(store, confidenceBreakdown.total);
  return {
    product,
    store,
    inventory,
    confidence: confidenceBreakdown.total,
    confidenceBreakdown,
    deliveryMinLow: delivery.low,
    deliveryMinHigh: delivery.high,
    price: product.basePrice,
  };
}
