import axios from "axios";
import Cookies from "js-cookie";

import { getApiUrl } from '../config/api.js';

const api = getApiUrl('');

// Cache để tránh gọi API quá nhiều
let favoritesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 giây

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function getUserId() {
    const token = Cookies.get('auth_token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }
    return null;
}

export const getFavorites = (userId) => {
    const now = Date.now();
    
    // Kiểm tra authentication trước
    const token = Cookies.get('auth_token');
    if (!token) {
        console.log('🔒 No auth token found, skipping favorites fetch');
        return Promise.reject(new Error('No authentication token'));
    }
    
    // Kiểm tra cache
    if (favoritesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('🔍 Debug - Using cached favorites');
        return Promise.resolve(favoritesCache);
    }
    
    console.log('🔍 Debug - Fetching fresh favorites');
    return axios.get(`${api}/favorites`, {
        headers: getAuthHeaders(),
        params: userId ? { user_id: userId } : {}
    }).then(response => {
        // Lưu vào cache
        favoritesCache = response;
        cacheTimestamp = now;
        return response;
    }).catch(error => {
        // Xử lý lỗi 401 một cách im lặng
        if (error.response?.status === 401) {
            console.log('🔒 Unauthorized access to favorites - user not logged in');
            // Clear cache khi có lỗi auth
            favoritesCache = null;
            cacheTimestamp = 0;
        }
        throw error;
    });
};

export const addToFavorite = (productId) => {
    console.log('🔍 Debug - Frontend addToFavorite:', { productId });
    
    // Kiểm tra authentication trước
    const token = Cookies.get('auth_token');
    if (!token) {
        console.log('🔒 No auth token found, cannot add to favorites');
        return Promise.reject(new Error('No authentication token'));
    }
    
    // Clear cache khi thêm favorite
    favoritesCache = null;
    cacheTimestamp = 0;
    
    return axios.post(`${api}/favorites`, { product_id: productId }, { 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } 
    });
};

export const removeFromFavorite = (productId) => {
    console.log('🔍 Debug - Frontend removeFromFavorite:', { productId });
    
    // Kiểm tra authentication trước
    const token = Cookies.get('auth_token');
    if (!token) {
        console.log('🔒 No auth token found, cannot remove from favorites');
        return Promise.reject(new Error('No authentication token'));
    }
    
    // Clear cache khi xóa favorite
    favoritesCache = null;
    cacheTimestamp = 0;
    
    return axios.delete(`${api}/favorites`, { 
        headers: getAuthHeaders(),
        data: { product_id: productId }
    });
};

// Nếu cần kiểm tra trạng thái yêu thích
export const isFavorite = (productId) => {
    return axios.get(`${api}/favorites/check/${productId}`, { headers: getAuthHeaders() });
};

// Function để clear cache
export const clearFavoritesCache = () => {
    favoritesCache = null;
    cacheTimestamp = 0;
    console.log('🔍 Debug - Favorites cache cleared');
}; 