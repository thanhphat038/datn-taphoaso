import secureApi from './secureApi.service.js';

export const addRecentView = async (productId) => {
  return secureApi.post('/recent-views/add', { productId });
};

export const getRecentViews = async (limit = 10) => {
  return secureApi.get('/recent-views', { limit });
};

export const getRecentViewsCount = async () => {
  return secureApi.get('/recent-views/count');
};

export const removeRecentView = async (productId) => {
  return secureApi.delete(`/recent-views/${productId}`);
};

export const clearRecentViews = async () => {
  return secureApi.delete('/recent-views');
};


