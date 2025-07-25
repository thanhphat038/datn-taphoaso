import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const stored = localStorage.getItem('favoriteProductIds');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteProductIds', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const addFavorite = (productId) => {
    setFavoriteIds((prev) => prev.includes(productId) ? prev : [...prev, productId]);
  };

  const removeFavorite = (productId) => {
    setFavoriteIds((prev) => prev.filter(id => id !== productId));
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  return (
    <FavoriteContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext); 