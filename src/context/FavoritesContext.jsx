import React, { createContext, useState, useEffect } from 'react';
import { getFavorites, deleteFavorite, addToFavorite } from '../service/FavoriteService';

export const FavoritesContext = createContext({
  favorites: [],
  loading: false,
  error: null,
  addFavorite: () => {},
  removeFavorite: () => {},
  fetchFavorites: () => {},
});

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (product_id) => {
    try {
      const favorite = await addToFavorite(product_id);
      setFavorites((prev) => [...prev, favorite]);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites((prev) => prev.filter((fav) => fav._id !== favoriteId));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, error, addFavorite, removeFavorite, fetchFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}; 