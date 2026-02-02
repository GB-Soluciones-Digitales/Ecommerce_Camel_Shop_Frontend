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
      const newItemSize = producto.selectedSize || 'unico';
      
      const existingItemIndex = prevItems.findIndex((item) => 
        item.id === producto.id && (item.selectedSize || 'unico') === newItemSize
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].cantidad += cantidad;
        return newItems;
      } else {
        return [...prevItems, { ...producto, cantidad }];
      }
    });
    setShowCart(true); 
  };

  const removeFromCart = (id, selectedSize) => {
    setCartItems(prev => prev.filter(item => {
      if (selectedSize && item.selectedSize) {
        return !(item.id === id && item.selectedSize === selectedSize);
      }
      return item.id !== id;
    }));
  };
  
  const updateQuantity = (id, cantidad, selectedSize) => {
    if (cantidad <= 0) { 
      removeFromCart(id, selectedSize); 
      return; 
    }
    setCartItems(prev => prev.map(item => {
      const isMatch = selectedSize 
        ? (item.id === id && item.selectedSize === selectedSize)
        : (item.id === id);
      
      return isMatch ? { ...item, cantidad } : item;
    }));
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