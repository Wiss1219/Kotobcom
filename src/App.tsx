
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import BooksPage from '@/pages/BooksPage';
import QuranPage from '@/pages/QuranPage';
import BookDetail from '@/pages/BookDetail';
import QuranDetail from '@/pages/QuranDetail';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmation from '@/pages/OrderConfirmation';
import ContactPage from '@/pages/ContactPage';
import Categories from '@/pages/Categories';
import CategoryPage from '@/pages/CategoryPage';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminBooks from '@/pages/admin/AdminBooks';
import AdminOrders from '@/pages/admin/AdminOrders';
import NotFound from '@/pages/NotFound';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import HiddenAdminButton from '@/components/HiddenAdminButton';
import AdminGuard from '@/components/AdminGuard';

// ScrollToTop component to handle scroll on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-background">
              <Header />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/quran" element={<QuranPage />} />
                  <Route path="/books/:id" element={<BookDetail />} />
                  <Route path="/quran/:id" element={<QuranDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:categoryId" element={<CategoryPage />} />
                  <Route path="/bestsellers" element={<BooksPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                  <Route path="/admin/books" element={<AdminGuard><AdminBooks /></AdminGuard>} />
                  <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
              <HiddenAdminButton />
            </div>
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                className: "shadow-lg border border-border",
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }
              }}
            />
            <ShadcnToaster />
          </Router>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
