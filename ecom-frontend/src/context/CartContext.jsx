import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart } from '../api/apiService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [activeUserId, setActiveUserIdState] = useState(
    () => localStorage.getItem('activeUserId') || null
  );
  const [activeUserName, setActiveUserName] = useState(
    () => localStorage.getItem('activeUserName') || null
  );
  const [cartCount, setCartCount] = useState(0);

  const setActiveUser = (id, name) => {
    localStorage.setItem('activeUserId', id);
    localStorage.setItem('activeUserName', name);
    setActiveUserIdState(id);
    setActiveUserName(name);
  };

  const clearActiveUser = () => {
    localStorage.removeItem('activeUserId');
    localStorage.removeItem('activeUserName');
    setActiveUserIdState(null);
    setActiveUserName(null);
    setCartCount(0);
  };

  const refreshCart = useCallback(async () => {
    if (!activeUserId) {
      setCartCount(0);
      return;
    }
    try {
      const items = await getCart(activeUserId);
      setCartCount(Array.isArray(items) ? items.length : 0);
    } catch {
      setCartCount(0);
    }
  }, [activeUserId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{ activeUserId, activeUserName, cartCount, setActiveUser, clearActiveUser, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
