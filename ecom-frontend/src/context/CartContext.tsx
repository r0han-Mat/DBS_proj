import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getCart } from '@/api/apiService';

interface CartContextType {
  activeUserId: string | null;
  activeUserName: string | null;
  activeUserRole: string | null;
  cartCount: number;
  setActiveUser: (id: string | number, name: string, role: string) => void;
  clearActiveUser: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  activeUserId: null,
  activeUserName: null,
  activeUserRole: null,
  cartCount: 0,
  setActiveUser: () => {},
  clearActiveUser: () => {},
  refreshCart: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [activeUserId, setActiveUserId] = useState<string | null>(
    () => localStorage.getItem('activeUserId')
  );
  const [activeUserName, setActiveUserName] = useState<string | null>(
    () => localStorage.getItem('activeUserName')
  );
  const [activeUserRole, setActiveUserRole] = useState<string | null>(
    () => localStorage.getItem('activeUserRole')
  );
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!activeUserId) { setCartCount(0); return; }
    try {
      const data = await getCart(activeUserId);
      const items = Array.isArray(data) ? data : [];
      setCartCount(items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
    } catch {
      setCartCount(0);
    }
  }, [activeUserId]);

  const setActiveUser = useCallback((id: string | number, name: string, role: string) => {
    const sid = String(id);
    setActiveUserId(sid);
    setActiveUserName(name);
    setActiveUserRole(role);
    localStorage.setItem('activeUserId', sid);
    localStorage.setItem('activeUserName', name);
    localStorage.setItem('activeUserRole', role);
    // Refresh cart for new user
    getCart(sid).then((data) => {
      const items = Array.isArray(data) ? data : [];
      setCartCount(items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
    }).catch(() => setCartCount(0));
  }, []);

  const clearActiveUser = useCallback(() => {
    setActiveUserId(null);
    setActiveUserName(null);
    setActiveUserRole(null);
    setCartCount(0);
    localStorage.removeItem('activeUserId');
    localStorage.removeItem('activeUserName');
    localStorage.removeItem('activeUserRole');
  }, []);

  return (
    <CartContext.Provider value={{ activeUserId, activeUserName, activeUserRole, cartCount, setActiveUser, clearActiveUser, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
