import type { Store, Product, InventoryItem, Order, DemoUser, DemandData, Feedback } from '@/types';

export const demoUsers: DemoUser[] = [
  { email: 'customer@novapulse.demo', password: 'demo123', role: 'customer', name: 'Priya Sharma' },
  { email: 'store@novapulse.demo', password: 'demo123', role: 'store', name: 'Sri Lakshmi Stores', storeId: 'store-1' },
  { email: 'admin@novapulse.demo', password: 'demo123', role: 'admin', name: 'NOVA CART Admin' },
];

export const stores: Store[] = [
  { id: 'store-1', name: 'Sri Lakshmi Stores', category: 'Grocery', area: 'Kukatpally', city: 'Hyderabad', distanceKm: 1.2, reliability: 94, inventoryAccuracy: 91, avgPrepTime: 8 },
  { id: 'store-2', name: 'Fresh Mart', category: 'Grocery', area: 'KPHB', city: 'Hyderabad', distanceKm: 1.8, reliability: 88, inventoryAccuracy: 82, avgPrepTime: 10 },
  { id: 'store-3', name: 'City Pharmacy', category: 'Pharmacy', area: 'Ameerpet', city: 'Hyderabad', distanceKm: 2.4, reliability: 85, inventoryAccuracy: 79, avgPrepTime: 6 },
  { id: 'store-4', name: 'Quick Bakery', category: 'Bakery', area: 'Madhapur', city: 'Hyderabad', distanceKm: 3.1, reliability: 76, inventoryAccuracy: 74, avgPrepTime: 14 },
  { id: 'store-5', name: 'Heritage Dairy', category: 'Dairy', area: 'Begumpet', city: 'Hyderabad', distanceKm: 2.0, reliability: 92, inventoryAccuracy: 88, avgPrepTime: 7 },
  { id: 'store-6', name: 'Star Stationery', category: 'Stationery', area: 'Secunderabad', city: 'Hyderabad', distanceKm: 3.5, reliability: 81, inventoryAccuracy: 77, avgPrepTime: 5 },
  { id: 'store-7', name: 'Green Vegetables', category: 'Vegetables', area: 'Kondapur', city: 'Hyderabad', distanceKm: 2.7, reliability: 79, inventoryAccuracy: 73, avgPrepTime: 9 },
  { id: 'store-8', name: 'Snack Hub', category: 'Snacks', area: 'Gachibowli', city: 'Hyderabad', distanceKm: 2.2, reliability: 86, inventoryAccuracy: 84, avgPrepTime: 6 },
];

export const products: Product[] = [
  { id: 'prod-1', name: 'Amul Milk 1L', category: 'Dairy', brand: 'Amul', unit: '1L', basePrice: 62, imageSeed: 'milk' },
  { id: 'prod-2', name: 'Heritage Milk 1L', category: 'Dairy', brand: 'Heritage', unit: '1L', basePrice: 65, imageSeed: 'milk2' },
  { id: 'prod-3', name: 'Local Dairy Milk 1L', category: 'Dairy', brand: 'Local Dairy', unit: '1L', basePrice: 58, imageSeed: 'milk3' },
  { id: 'prod-4', name: 'Modern Bread White', category: 'Bakery', brand: 'Modern', unit: '400g', basePrice: 45, imageSeed: 'bread' },
  { id: 'prod-5', name: 'Britannia Bread Brown', category: 'Bakery', brand: 'Britannia', unit: '400g', basePrice: 50, imageSeed: 'bread2' },
  { id: 'prod-6', name: 'Farm Eggs (6 pack)', category: 'Dairy', brand: 'Farm Fresh', unit: '6 pack', basePrice: 72, imageSeed: 'eggs' },
  { id: 'prod-7', name: 'India Gate Basmati Rice 5kg', category: 'Grocery', brand: 'India Gate', unit: '5kg', basePrice: 525, imageSeed: 'rice' },
  { id: 'prod-8', name: 'Daawat Rice 5kg', category: 'Grocery', brand: 'Daawat', unit: '5kg', basePrice: 495, imageSeed: 'rice2' },
  { id: 'prod-9', name: 'Paracetamol 500mg (10)', category: 'Pharmacy', brand: 'Generic', unit: '10 tabs', basePrice: 25, imageSeed: 'medicine' },
  { id: 'prod-10', name: 'Cough Syrup 100ml', category: 'Pharmacy', brand: 'Benadryl', unit: '100ml', basePrice: 110, imageSeed: 'medicine2' },
  { id: 'prod-11', name: 'Classmate Notebook (200pg)', category: 'Stationery', brand: 'Classmate', unit: '1 pc', basePrice: 60, imageSeed: 'notebook' },
  { id: 'prod-12', name: 'Lays Classic Salted', category: 'Snacks', brand: 'Lays', unit: '52g', basePrice: 20, imageSeed: 'chips' },
  { id: 'prod-13', name: 'Haldiram Bhujia 200g', category: 'Snacks', brand: 'Haldiram', unit: '200g', basePrice: 55, imageSeed: 'bhujia' },
  { id: 'prod-14', name: 'Fresh Tomatoes 1kg', category: 'Vegetables', brand: 'Local Farm', unit: '1kg', basePrice: 40, imageSeed: 'tomato' },
  { id: 'prod-15', name: 'Fresh Onions 1kg', category: 'Vegetables', brand: 'Local Farm', unit: '1kg', basePrice: 35, imageSeed: 'onion' },
  { id: 'prod-16', name: 'Potatoes 1kg', category: 'Vegetables', brand: 'Local Farm', unit: '1kg', basePrice: 30, imageSeed: 'potato' },
  { id: 'prod-17', name: 'Amul Butter 100g', category: 'Dairy', brand: 'Amul', unit: '100g', basePrice: 56, imageSeed: 'butter' },
  { id: 'prod-18', name: 'Britannia Cake Fruit', category: 'Bakery', brand: 'Britannia', unit: '50g', basePrice: 15, imageSeed: 'cake' },
  { id: 'prod-19', name: 'Dettol Hand Wash 200ml', category: 'Pharmacy', brand: 'Dettol', unit: '200ml', basePrice: 105, imageSeed: 'handwash' },
  { id: 'prod-20', name: 'Aashirvaad Atta 5kg', category: 'Grocery', brand: 'Aashirvaad', unit: '5kg', basePrice: 310, imageSeed: 'flour' },
];

// Generate inventory for each product-store combination
function generateInventory(): InventoryItem[] {
  const items: InventoryItem[] = [];
  const storeProductMap: Record<string, string[]> = {};

  const categoryStoreMap: Record<string, string[]> = {
    Dairy: ['store-1', 'store-2', 'store-5'],
    Bakery: ['store-1', 'store-2', 'store-4'],
    Grocery: ['store-1', 'store-2'],
    Pharmacy: ['store-3'],
    Stationery: ['store-6'],
    Snacks: ['store-1', 'store-2', 'store-8'],
    Vegetables: ['store-7'],
  };

  products.forEach((p) => {
    const storeIds = categoryStoreMap[p.category] || ['store-1'];
    storeIds.forEach((sid) => {
      if (!storeProductMap[sid]) storeProductMap[sid] = [];
      storeProductMap[sid].push(p.id);

      let stock: number;
      let lastUpdatedMin: number;
      let recentCancellations: number;

      // Some items are deliberately problematic
      if (p.id === 'prod-4' && sid === 'store-4') {
        stock = 2; lastUpdatedMin = 1140; recentCancellations = 3;
      } else if (p.id === 'prod-6' && sid === 'store-1') {
        stock = 0; lastUpdatedMin = 120; recentCancellations = 5;
      } else if (p.id === 'prod-6' && sid === 'store-5') {
        stock = 1; lastUpdatedMin = 480; recentCancellations = 2;
      } else if (p.id === 'prod-14' && sid === 'store-7') {
        stock = 3; lastUpdatedMin = 90; recentCancellations = 1;
      } else if (p.id === 'prod-11' && sid === 'store-6') {
        stock = 5; lastUpdatedMin = 600; recentCancellations = 1;
      } else if (p.id === 'prod-9' && sid === 'store-3') {
        stock = 20; lastUpdatedMin = 15; recentCancellations = 0;
      } else if (p.id === 'prod-1' && sid === 'store-1') {
        stock = 12; lastUpdatedMin = 8; recentCancellations = 0;
      } else if (p.id === 'prod-1' && sid === 'store-5') {
        stock = 15; lastUpdatedMin = 12; recentCancellations = 0;
      } else if (p.id === 'prod-7' && sid === 'store-1') {
        stock = 8; lastUpdatedMin = 30; recentCancellations = 0;
      } else if (p.id === 'prod-12' && sid === 'store-8') {
        stock = 30; lastUpdatedMin = 5; recentCancellations = 0;
      } else if (p.id === 'prod-12' && sid === 'store-1') {
        stock = 25; lastUpdatedMin = 20; recentCancellations = 0;
      } else if (p.id === 'prod-13' && sid === 'store-8') {
        stock = 18; lastUpdatedMin = 25; recentCancellations = 0;
      } else if (p.id === 'prod-13' && sid === 'store-1') {
        stock = 10; lastUpdatedMin = 45; recentCancellations = 0;
      } else if (p.id === 'prod-2' && sid === 'store-5') {
        stock = 14; lastUpdatedMin = 10; recentCancellations = 0;
      } else if (p.id === 'prod-3' && sid === 'store-5') {
        stock = 9; lastUpdatedMin = 20; recentCancellations = 0;
      } else if (p.id === 'prod-17' && sid === 'store-5') {
        stock = 11; lastUpdatedMin = 15; recentCancellations = 0;
      } else if (p.id === 'prod-17' && sid === 'store-1') {
        stock = 7; lastUpdatedMin = 25; recentCancellations = 0;
      } else if (p.id === 'prod-5' && sid === 'store-4') {
        stock = 8; lastUpdatedMin = 40; recentCancellations = 0;
      } else if (p.id === 'prod-4' && sid === 'store-1') {
        stock = 10; lastUpdatedMin = 35; recentCancellations = 0;
      } else if (p.id === 'prod-5' && sid === 'store-1') {
        stock = 6; lastUpdatedMin = 50; recentCancellations = 0;
      } else if (p.id === 'prod-18' && sid === 'store-4') {
        stock = 12; lastUpdatedMin = 60; recentCancellations = 0;
      } else if (p.id === 'prod-18' && sid === 'store-1') {
        stock = 0; lastUpdatedMin = 200; recentCancellations = 1;
      } else if (p.id === 'prod-20' && sid === 'store-1') {
        stock = 6; lastUpdatedMin = 40; recentCancellations = 0;
      } else if (p.id === 'prod-20' && sid === 'store-2') {
        stock = 4; lastUpdatedMin = 300; recentCancellations = 1;
      } else if (p.id === 'prod-8' && sid === 'store-2') {
        stock = 5; lastUpdatedMin = 45; recentCancellations = 0;
      } else if (p.id === 'prod-7' && sid === 'store-2') {
        stock = 3; lastUpdatedMin = 200; recentCancellations = 1;
      } else if (p.id === 'prod-10' && sid === 'store-3') {
        stock = 8; lastUpdatedMin = 60; recentCancellations = 0;
      } else if (p.id === 'prod-19' && sid === 'store-3') {
        stock = 6; lastUpdatedMin = 120; recentCancellations = 0;
      } else if (p.id === 'prod-15' && sid === 'store-7') {
        stock = 20; lastUpdatedMin = 15; recentCancellations = 0;
      } else if (p.id === 'prod-16' && sid === 'store-7') {
        stock = 25; lastUpdatedMin = 18; recentCancellations = 0;
      } else if (p.id === 'prod-9' && sid === 'store-3') {
        stock = 15; lastUpdatedMin = 20; recentCancellations = 0;
      } else if (p.id === 'prod-11' && sid === 'store-6') {
        stock = 4; lastUpdatedMin = 600; recentCancellations = 1;
      } else {
        stock = Math.floor(Math.random() * 15) + 3;
        lastUpdatedMin = Math.floor(Math.random() * 200) + 10;
        recentCancellations = Math.random() < 0.15 ? 1 : 0;
      }

      const recentOrderCount = Math.floor(Math.random() * 40) + 5;
      items.push({ productId: p.id, storeId: sid, stock, lastUpdatedMin, recentOrderCount, recentCancellations });
    });
  });

  return items;
}

export const inventory: InventoryItem[] = generateInventory();

export const demandData: DemandData[] = [
  { productName: 'Amul Milk 1L', searches: 148, category: 'Dairy', unavailableCount: 12 },
  { productName: 'Modern Bread White', searches: 121, category: 'Bakery', unavailableCount: 24 },
  { productName: 'Farm Eggs (6 pack)', searches: 96, category: 'Dairy', unavailableCount: 31 },
  { productName: 'Classmate Notebook', searches: 73, category: 'Stationery', unavailableCount: 8 },
  { productName: 'Paracetamol 500mg', searches: 65, category: 'Pharmacy', unavailableCount: 4 },
  { productName: 'India Gate Basmati Rice', searches: 58, category: 'Grocery', unavailableCount: 6 },
  { productName: 'Fresh Tomatoes', searches: 52, category: 'Vegetables', unavailableCount: 9 },
  { productName: 'Amul Butter 100g', searches: 41, category: 'Dairy', unavailableCount: 3 },
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-7841',
    items: [
      { productName: 'Amul Milk 1L', storeName: 'Sri Lakshmi Stores', price: 62, confidence: 94 },
      { productName: 'Modern Bread White', storeName: 'Sri Lakshmi Stores', price: 45, confidence: 88 },
    ],
    storeName: 'Sri Lakshmi Stores',
    total: 107,
    status: 'delivered',
    placedAt: '2026-09-28T14:30:00Z',
    deliveryEstimateLow: 22,
    deliveryEstimateHigh: 28,
    cancellationsPrevented: 0,
  },
  {
    id: 'ORD-7832',
    items: [
      { productName: 'Lays Classic Salted', storeName: 'Snack Hub', price: 20, confidence: 96 },
      { productName: 'Haldiram Bhujia 200g', storeName: 'Snack Hub', price: 55, confidence: 91 },
    ],
    storeName: 'Snack Hub',
    total: 75,
    status: 'delivered',
    placedAt: '2026-09-26T19:15:00Z',
    deliveryEstimateLow: 18,
    deliveryEstimateHigh: 24,
    cancellationsPrevented: 1,
  },
  {
    id: 'ORD-7820',
    items: [
      { productName: 'Paracetamol 500mg (10)', storeName: 'City Pharmacy', price: 25, confidence: 95 },
    ],
    storeName: 'City Pharmacy',
    total: 25,
    status: 'delivered',
    placedAt: '2026-09-24T10:00:00Z',
    deliveryEstimateLow: 20,
    deliveryEstimateHigh: 26,
    cancellationsPrevented: 0,
  },
];

export const initialFeedback: Feedback[] = [
  { id: 'fb-1', orderId: 'ORD-7841', rating: 4, comment: 'Delivery was quick and products were fresh.', createdAt: '2026-09-28T15:05:00Z' },
  { id: 'fb-2', orderId: 'ORD-7832', rating: 5, comment: 'Great snacks selection, arrived in 20 minutes.', createdAt: '2026-09-26T19:45:00Z' },
];
