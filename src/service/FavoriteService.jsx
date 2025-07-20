import axios from 'axios';

const API_BASE_URL = '/api/favorites';

const getFavorites = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data.data;
};

const deleteFavorite = async (favoriteId) => {
  const response = await axios.delete(API_BASE_URL + '/' + favoriteId);
  return response.data;
};

export { getFavorites, deleteFavorite };
