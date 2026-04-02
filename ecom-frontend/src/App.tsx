import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Analytics from "./pages/Analytics";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

import { Navigate, Outlet } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Login from "./pages/Login";

const ProtectedRoute = () => {
  const { activeUserId } = useCart();
  if (!activeUserId) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/users" element={<Users />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
