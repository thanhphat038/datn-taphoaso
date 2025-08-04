import React, { createContext, useState, useEffect } from 'react';
import { getCart } from '../service/Cart.service';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend with debounce
  const fetchCartFromBackend = async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    try {
      setLoading(true);
      const response = await getCart();
      if (response.data?.data?.items) {
        setCartItems(response.data.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for cart-updated events
  useEffect(() => {
    let debounceTimer;
    
    const handleCartUpdate = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchCartFromBackend();
      }, 300); // Debounce 300ms
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    
    // Initial fetch
    fetchCartFromBackend();

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      clearTimeout(debounceTimer);
    };
  }, []);

  const incrementQuantity = (id) => {
    // This will be handled by backend API calls
    fetchCartFromBackend();
  };

  const decrementQuantity = (id) => {
    // This will be handled by backend API calls
    fetchCartFromBackend();
  };

  const removeItem = (id) => {
    // This will be handled by backend API calls
    fetchCartFromBackend();
  };

  const addProduct = (product) => {
    // This will be handled by backend API calls
    fetchCartFromBackend();
  };

  const setInitialCartItems = (items) => {
    setCartItems(items);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      incrementQuantity,
      decrementQuantity,
      removeItem,
      addProduct,
      setInitialCartItems,
      fetchCartFromBackend
    }}>
      {children}
    </CartContext.Provider>
  );
};

