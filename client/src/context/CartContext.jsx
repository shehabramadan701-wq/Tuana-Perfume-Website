// The shopping bag. Saved in the browser so it stays after refresh.
//   const { items, add, remove, setQty, total, count, clear } = useCart();
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('tuana_cart') || '[]'));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tuana_cart', JSON.stringify(items));
  }, [items]);

  function add(product) {
    const found = items.find((i) => i.id === product.id);
    if (found) setQty(product.id, found.quantity + 1);
    else setItems([...items, { ...product, quantity: 1 }]);
  }

  function setQty(id, quantity) {
    if (quantity < 1) return remove(id);
    setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  const remove = (id) => setItems(items.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, total, count, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
