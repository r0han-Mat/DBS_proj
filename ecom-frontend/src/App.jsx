import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FloatingHeader } from './components/ui/floating-header';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { GeometricBackground } from './components/ui/geometric-background';
import AdminPage from './pages/AdminPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <GeometricBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <FloatingHeader />
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
