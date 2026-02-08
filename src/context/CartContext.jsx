import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error al leer el carrito:", error);
      return [];
    }
  });

  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (producto, cantidad = 1) => {
    setCartItems((prevItems) => {
      const uniqueId = producto.variantId || `${producto.id}-${producto.selectedColor || 'Unico'}-${producto.selectedSize || 'Unico'}`;
      
      const existingItemIndex = prevItems.findIndex((item) => {
         const itemUniqueId = item.variantId || `${item.id}-${item.selectedColor || 'Unico'}-${item.selectedSize || 'Unico'}`;
         return itemUniqueId === uniqueId;
      });

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].cantidad += cantidad;
        return newItems;
      } else {
        return [...prevItems, { ...producto, cantidad, variantId: uniqueId }];
      }
    });
    setShowCart(true); 
  };

  const removeFromCart = (variantId) => {
    setCartItems(prev => prev.filter(item => (item.variantId || item.id) !== variantId));
  };
  
  const updateQuantity = (variantId, cantidad) => {
    if (cantidad <= 0) { 
      removeFromCart(variantId); 
      return; 
    }
    setCartItems(prev => prev.map(item => 
      (item.variantId || item.id) === variantId ? { ...item, cantidad } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart'); 
  };

  const getCartTotal = () => cartItems.reduce((total, item) => total + parseFloat(item.precio) * item.cantidad, 0);
  const getCartItemsCount = () => cartItems.reduce((total, item) => total + item.cantidad, 0);

  const toggleCart = () => setShowCart(!showCart);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    showCart,
    setShowCart,
    toggleCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};