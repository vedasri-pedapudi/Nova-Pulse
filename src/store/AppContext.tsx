import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Role, Store, Product, InventoryItem, Order, CartItem, Feedback, OrderStatus } from '@/types';
import {
  stores as initialStores,
  products as initialProducts,
  inventory as initialInventory,
  initialOrders,
  initialFeedback,
  demoUsers,
} from '@/data/mockData';
import type { DemoUser } from '@/types';

interface AppState {
  // Auth
  currentUser: DemoUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Data
  stores: Store[];
  products: Product[];
  inventory: InventoryItem[];
  orders: Order[];
  feedback: Feedback[];

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;

  // Inventory updates
  updateInventory: (storeId: string, productId: string, updates: Partial<InventoryItem>) => void;

  // Orders
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Metrics
  cancellationsPrevented: number;
  alternativesRecommended: number;
  inventoryMismatchesPrevented: number;
  incrementCancellationsPrevented: () => void;
  incrementAlternativesRecommended: (n?: number) => void;
  incrementInventoryMismatchesPrevented: () => void;

  // Feedback
  addFeedback: (orderId: string, rating: number, comment: string) => void;

  // Search tracking
  searchCounts: Record<string, number>;
  trackSearch: (query: string) => void;
}

const AppContext = createContext<AppState | null>(null);

let orderIdCounter = 7850;

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [stores] = useState<Store[]>(initialStores);
  const [products] = useState<Product[]>(initialProducts);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);
  const [cancellationsPrevented, setCancellationsPrevented] = useState(71);
  const [alternativesRecommended, setAlternativesRecommended] = useState(86);
  const [inventoryMismatchesPrevented, setInventoryMismatchesPrevented] = useState(124);
  const [searchCounts, setSearchCounts] = useState<Record<string, number>>({
    Milk: 148, Bread: 121, Eggs: 96, Notebook: 73, Medicine: 65, Rice: 58, Vegetables: 52, Snacks: 41,
  });

  const login = useCallback((email: string, password: string): boolean => {
    const user = demoUsers.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === item.product.id && c.store.id === item.store.id);
      if (existing) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCartItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const updateInventory = useCallback((storeId: string, productId: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.productId === productId && inv.storeId === storeId
          ? { ...inv, ...updates, lastUpdatedMin: 0 }
          : inv,
      ),
    );
  }, []);

  const placeOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const addFeedback = useCallback((orderId: string, rating: number, comment: string) => {
    const fb: Feedback = {
      id: `fb-${Date.now()}`,
      orderId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setFeedback((prev) => [fb, ...prev]);
  }, []);

  const incrementCancellationsPrevented = useCallback(() => setCancellationsPrevented((n) => n + 1), []);
  const incrementAlternativesRecommended = useCallback((n = 1) => setAlternativesRecommended((v) => v + n), []);
  const incrementInventoryMismatchesPrevented = useCallback(() => setInventoryMismatchesPrevented((n) => n + 1), []);

  const trackSearch = useCallback((query: string) => {
    setSearchCounts((prev) => ({ ...prev, [query]: (prev[query] || 0) + 1 }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        stores,
        products,
        inventory,
        orders,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        updateInventory,
        placeOrder,
        updateOrderStatus,
        feedback,
        addFeedback,
        cancellationsPrevented,
        alternativesRecommended,
        inventoryMismatchesPrevented,
        incrementCancellationsPrevented,
        incrementAlternativesRecommended,
        incrementInventoryMismatchesPrevented,
        searchCounts,
        trackSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function generateOrderId(): string {
  return `ORD-${orderIdCounter++}`;
}
