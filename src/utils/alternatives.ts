import type { Product, Store, InventoryItem, SearchResult } from '@/types';
import { buildSearchResult, calculateConfidence } from './availability';

export interface AlternativeResult {
  results: SearchResult[];
  originalProduct: Product;
  originalStore: Store;
  message: string;
}

export function findAlternatives(
  product: Product,
  unavailableStore: Store,
  allProducts: Product[],
  allStores: Store[],
  allInventory: InventoryItem[],
  maxResults: number = 5,
): AlternativeResult {
  const results: SearchResult[] = [];

  // Strategy 1: Same product at different stores
  const sameProductDiffStore = allInventory.filter(
    (inv) => inv.productId === product.id && inv.storeId !== unavailableStore.id && inv.stock > 0,
  );

  for (const inv of sameProductDiffStore) {
    const store = allStores.find((s) => s.id === inv.storeId);
    if (!store) continue;
    const conf = calculateConfidence(inv, store, product);
    if (conf.total >= 50) {
      results.push(buildSearchResult(product, store, inv));
    }
  }

  // Strategy 2: Similar category products at any store (including the original)
  if (results.length < maxResults) {
    const similarProducts = allProducts.filter(
      (p) => p.category === product.category && p.id !== product.id,
    );

    for (const p of similarProducts) {
      const productInventory = allInventory.filter((inv) => inv.productId === p.id && inv.stock > 0);
      for (const inv of productInventory) {
        const store = allStores.find((s) => s.id === inv.storeId);
        if (!store) continue;
        const conf = calculateConfidence(inv, store, p);
        if (conf.total >= 60) {
          results.push(buildSearchResult(p, store, inv));
        }
      }
    }
  }

  // Deduplicate and sort by confidence, then delivery time
  const seen = new Set<string>();
  const unique = results.filter((r) => {
    const key = `${r.product.id}-${r.store.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  unique.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return a.deliveryMinLow - b.deliveryMinLow;
  });

  return {
    results: unique.slice(0, maxResults),
    originalProduct: product,
    originalStore: unavailableStore,
    message: `Product unavailable at ${unavailableStore.name}. Found ${Math.min(unique.length, maxResults)} alternatives.`,
  };
}

export function findProductById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function findStoreById(stores: Store[], id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}

export function findInventory(
  inventory: InventoryItem[],
  productId: string,
  storeId: string,
): InventoryItem | undefined {
  return inventory.find((inv) => inv.productId === productId && inv.storeId === storeId);
}
