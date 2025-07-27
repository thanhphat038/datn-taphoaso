import axios from "axios";
import Cookies from "js-cookie";

const api = "http://localhost:3000/api";

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
    return axios.get(`${api}/favorites`, {
        headers: getAuthHeaders(),
        params: userId ? { user_id: userId } : {}
    });
};

export const addToFavorite = (productId) => {
    console.log('🔍 Debug - Frontend addToFavorite:', { productId });
    return axios.post(`${api}/favorites`, { product_id: productId }, { 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } 
    });
};

export const removeFromFavorite = (productId) => {
    console.log('🔍 Debug - Frontend removeFromFavorite:', { productId });
    return axios.delete(`${api}/favorites`, { 
        headers: getAuthHeaders(),
        data: { product_id: productId }
    });
};

// Nếu cần kiểm tra trạng thái yêu thích
export const isFavorite = (productId) => {
    return axios.get(`${api}/favorites/check/${productId}`, { headers: getAuthHeaders() });
}; 