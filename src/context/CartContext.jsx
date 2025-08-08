import React, { createContext, useState, useEffect } from 'react';
import { getCart } from '../service/Cart.service';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loading: authLoading, isAuthenticated } = useAuth();

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
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      clearTimeout(debounceTimer);
    };
  }, []);

  // Initial fetch: chỉ fetch khi đã xác thực xong và user đã đăng nhập
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCartFromBackend();
    } else if (!authLoading && !isAuthenticated) {
      setCartItems([]); // Clear cart nếu user chưa đăng nhập
    }
  }, [authLoading, isAuthenticated]);

  const incrementQuantity = (id) => {
    fetchCartFromBackend();
  };
  const decrementQuantity = (id) => {
    fetchCartFromBackend();
  };
  const removeItem = (id) => {
    fetchCartFromBackend();
  };
  const addProduct = (product) => {
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

