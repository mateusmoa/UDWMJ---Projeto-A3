import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const add = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevCart, item];
    });
  };

  const remove = (id) => {
    if (!id) return;
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clear = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};
