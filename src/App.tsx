import { useState } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { CustomerDashboard } from '@/pages/customer/CustomerDashboard';
import { CustomerSearch } from '@/pages/customer/CustomerSearch';
import { ProductDetails } from '@/pages/customer/ProductDetails';
import { SmartCart } from '@/pages/customer/SmartCart';
import { OrderConfirmation } from '@/pages/customer/OrderConfirmation';
import { OrderTracking } from '@/pages/customer/OrderTracking';
import { OrderHistory } from '@/pages/customer/OrderHistory';
import { CustomerFeedback } from '@/pages/customer/CustomerFeedback';
import { StoreDashboard } from '@/pages/store/StoreDashboard';
import { StoreInventory } from '@/pages/store/StoreInventory';
import { StoreOrders } from '@/pages/store/StoreOrders';
import { StoreAlerts } from '@/pages/store/StoreAlerts';
import { StoreDemand } from '@/pages/store/StoreDemand';
import { StorePerformance } from '@/pages/store/StorePerformance';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminCancellations } from '@/pages/admin/AdminCancellations';
import { AdminInventoryReliability } from '@/pages/admin/AdminInventoryReliability';
import { AdminRetention } from '@/pages/admin/AdminRetention';
import { AdminSupport } from '@/pages/admin/AdminSupport';
import { AdminImpact } from '@/pages/admin/AdminImpact';
import { AdminPlan } from '@/pages/admin/AdminPlan';
import type { SearchResult, CartItem } from '@/types';

function AppContent() {
  const { currentUser, addToCart } = useApp();
  const [currentPage, setCurrentPage] = useState('customer-dashboard');
  const [selectedProduct, setSelectedProduct] = useState<{ productId: string; storeId: string } | null>(null);
  const [demoBanner, setDemoBanner] = useState<string | null>(null);

  const navigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleSelectProduct = (productId: string, storeId: string) => {
    setSelectedProduct({ productId, storeId });
    navigate('customer-product');
  };

  const handleAddToCart = (result: SearchResult) => {
    const cartItem: CartItem = {
      id: `${result.product.id}-${result.store.id}`,
      product: result.product,
      store: result.store,
      inventory: result.inventory,
      confidence: result.confidence,
      confidenceBreakdown: result.confidenceBreakdown,
      deliveryMinLow: result.deliveryMinLow,
      deliveryMinHigh: result.deliveryMinHigh,
      price: result.price,
      needsAttention: result.confidence < 55,
    };
    addToCart(cartItem);
  };

  const handleOrderPlaced = (orderId: string) => {
    setDemoBanner(`Order ${orderId} placed successfully!`);
    navigate('customer-confirmation');
    setTimeout(() => setDemoBanner(null), 3000);
  };

  // Login page
  if (!currentUser) {
    return <LoginPage />;
  }

  const role = currentUser.role;
  let pageContent: React.ReactNode = null;

  if (role === 'customer') {
    switch (currentPage) {
      case 'customer-dashboard':
        pageContent = <CustomerDashboard onNavigate={navigate} onSelectProduct={handleSelectProduct} />;
        break;
      case 'customer-search':
        pageContent = <CustomerSearch onNavigate={navigate} onSelectProduct={handleSelectProduct} onAddToCart={handleAddToCart} />;
        break;
      case 'customer-product':
        if (selectedProduct) {
          pageContent = (
            <ProductDetails
              productId={selectedProduct.productId}
              storeId={selectedProduct.storeId}
              onNavigate={navigate}
              onAddToCart={handleAddToCart}
            />
          );
        } else {
          pageContent = <CustomerSearch onNavigate={navigate} onSelectProduct={handleSelectProduct} onAddToCart={handleAddToCart} />;
        }
        break;
      case 'customer-cart':
        pageContent = <SmartCart onNavigate={navigate} onOrderPlaced={handleOrderPlaced} />;
        break;
      case 'customer-confirmation':
        pageContent = <OrderConfirmation onNavigate={navigate} />;
        break;
      case 'customer-tracking':
        pageContent = <OrderTracking onNavigate={navigate} />;
        break;
      case 'customer-orders':
        pageContent = <OrderHistory onNavigate={navigate} />;
        break;
      case 'customer-feedback':
        pageContent = <CustomerFeedback onNavigate={navigate} />;
        break;
      default:
        pageContent = <CustomerDashboard onNavigate={navigate} onSelectProduct={handleSelectProduct} />;
    }
  } else if (role === 'store') {
    switch (currentPage) {
      case 'store-dashboard':
        pageContent = <StoreDashboard onNavigate={navigate} />;
        break;
      case 'store-inventory':
        pageContent = <StoreInventory onNavigate={navigate} />;
        break;
      case 'store-orders':
        pageContent = <StoreOrders onNavigate={navigate} />;
        break;
      case 'store-alerts':
        pageContent = <StoreAlerts onNavigate={navigate} />;
        break;
      case 'store-demand':
        pageContent = <StoreDemand />;
        break;
      case 'store-performance':
        pageContent = <StorePerformance />;
        break;
      default:
        pageContent = <StoreDashboard onNavigate={navigate} />;
    }
  } else if (role === 'admin') {
    switch (currentPage) {
      case 'admin-dashboard':
        pageContent = <AdminDashboard onNavigate={navigate} />;
        break;
      case 'admin-cancellations':
        pageContent = <AdminCancellations onNavigate={navigate} />;
        break;
      case 'admin-inventory':
        pageContent = <AdminInventoryReliability />;
        break;
      case 'admin-retention':
        pageContent = <AdminRetention />;
        break;
      case 'admin-support':
        pageContent = <AdminSupport />;
        break;
      case 'admin-impact':
        pageContent = <AdminImpact />;
        break;
      case 'admin-plan':
        pageContent = <AdminPlan />;
        break;
      default:
        pageContent = <AdminDashboard onNavigate={navigate} />;
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={navigate}>
      {demoBanner && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2 animate-slide-up">
          <span className="font-medium">{demoBanner}</span>
        </div>
      )}
      {pageContent}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
