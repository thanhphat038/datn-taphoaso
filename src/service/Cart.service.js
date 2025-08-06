import axios from "axios";
import Cookies from "js-cookie";

import { getApiUrl } from '../config/api.js';

const api = getApiUrl('');

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy giỏ hàng
export const getCart = () => {
    return axios.get(`${api}/carts`, { headers: getAuthHeaders() });
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (productId, quantity = 1) => {

    return axios.post(
        `${api}/carts/items`,
        { 
            product_id: productId, 
            qty: quantity 
        },
        { headers: getAuthHeaders() }
    );
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = (cartItemId, quantity) => {
    
    return axios.put(
        `${api}/carts/items/${cartItemId}`,
        { qty: quantity },
        { headers: getAuthHeaders() }
    );
};

// Xóa một sản phẩm khỏi giỏ hàng
export const removeCartItem = (cartItemId) => {
    return axios.delete(`${api}/carts/items/${cartItemId}`, { headers: getAuthHeaders() });
};

// Xóa toàn bộ giỏ hàng
export const clearCart = () => {
    return axios.delete(`${api}/carts/items`, { headers: getAuthHeaders() });
};