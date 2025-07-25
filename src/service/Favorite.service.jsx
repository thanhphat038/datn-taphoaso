import axios from "axios";
import Cookies from "js-cookie";

const api = "http://localhost:3000/api";

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getFavorites = (userId) => {
    return axios.get(`${api}/favorites`, {
        headers: getAuthHeaders(),
        params: userId ? { user_id: userId } : {}
    });
};

export const addToFavorite = (productId) => {
    return axios.post(`${api}/favorites`, { product_id: productId }, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const removeFromFavorite = (productId) => {
    return axios.delete(`${api}/favorites/${productId}`, { headers: getAuthHeaders() });
};

// Nếu cần kiểm tra trạng thái yêu thích
export const isFavorite = (productId) => {
    return axios.get(`${api}/favorites/check/${productId}`, { headers: getAuthHeaders() });
}; 