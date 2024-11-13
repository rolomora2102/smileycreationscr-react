import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // Actualizar la cantidad existente sumando la cantidad del producto añadido
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      } else {
        // Si el producto no está en el carrito, agregarlo con una cantidad predeterminada de 1 si no se especifica
        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
    });
    setNotification(true);
  };

  const closeNotification = () => setNotification(false);

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => {
      const quantity = isNaN(item.quantity) ? 0 : item.quantity;
      return total + quantity;
    }, 0);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        notification,
        closeNotification,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
