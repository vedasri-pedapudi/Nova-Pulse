export type Role = 'customer' | 'store' | 'admin';

export interface DemoUser {
  email: string;
  password: string;
  role: Role;
  name: string;
  storeId?: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  area: string;
  city: string;
  distanceKm: number;
  reliability: number;
  inventoryAccuracy: number;
  avgPrepTime: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  basePrice: number;
  imageSeed: string;
}

export interface InventoryItem {
  productId: string;
  storeId: string;
  stock: number;
  lastUpdatedMin: number;
  recentOrderCount: number;
  recentCancellations: number;
}

export interface ConfidenceBreakdown {
  inventoryFreshness: number;
  stockLevel: number;
  storeReliability: number;
  recentAvailability: number;
  staleRisk: number;
  total: number;
  factors: ConfidenceFactor[];
}

export interface ConfidenceFactor {
  label: string;
  positive: boolean;
  detail: string;
}

export interface SearchResult {
  product: Product;
  store: Store;
  inventory: InventoryItem;
  confidence: number;
  confidenceBreakdown: ConfidenceBreakdown;
  deliveryMinLow: number;
  deliveryMinHigh: number;
  price: number;
}

export interface CartItem {
  id: string;
  product: Product;
  store: Store;
  inventory: InventoryItem;
  confidence: number;
  confidenceBreakdown: ConfidenceBreakdown;
  deliveryMinLow: number;
  deliveryMinHigh: number;
  price: number;
  needsAttention: boolean;
  replacedFrom?: string;
}

export type OrderStatus =
  | 'placed'
  | 'store_confirmed'
  | 'preparing'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productName: string;
  storeName: string;
  price: number;
  confidence: number;
  replacedFrom?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  storeName: string;
  total: number;
  status: OrderStatus;
  placedAt: string;
  deliveryEstimateLow: number;
  deliveryEstimateHigh: number;
  cancellationsPrevented: number;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  action: string;
  searchCount?: number;
}

export interface DemandData {
  productName: string;
  searches: number;
  category: string;
  unavailableCount: number;
}

export interface Feedback {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
