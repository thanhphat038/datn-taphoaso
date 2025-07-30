import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage if available
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const incrementQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const addProduct = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Add the passed quantity or default to 1
        const addQty = typeof product.quantity === 'number' && product.quantity > 0 ? product.quantity : 1;
        const newItems = prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + addQty } : item
        );
        return newItems;
      } else {
        const newItems = [...prevItems, { ...product, quantity: product.quantity || 1 }];
        return newItems;
      }
    });
  };

  const setInitialCartItems = (items) => {
    setCartItems(items);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      incrementQuantity,
      decrementQuantity,
      removeItem,
      addProduct,
      setInitialCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

