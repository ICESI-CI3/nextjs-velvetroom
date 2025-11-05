/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCart } from '@/services/cart';
import { useAuth } from './AuthContext';

type CartContextType = {
  count: number;
  refresh: () => void; // <-- Se podrá llamar después de agregar un item
};

const CartContext = createContext<CartContextType>({
  count: 0,
  refresh: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = () => {
    if (!user) return setCount(0);
    getCart().then((cart) => setCount(cart.items.length));
  };

  useEffect(() => {
    refresh();
  }, [user]);

  return (
    <CartContext.Provider value={{ count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
