import axios from "axios";
import Cookies from "js-cookie";

const api = "http://localhost:3000/api";

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getAllAddress = () => {
    return axios.get(`${api}/users`, { headers: getAuthHeaders() });
};

export const getAllCategories = () => {
    return axios.get(`${api}/categories`, { headers: getAuthHeaders() });
};

export const createCategory = (data) => {
    return axios.post(`${api}/categories`, data, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const updateCategory = (id, data) => {
    return axios.put(`${api}/categories/${id}`, data, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const deleteCategory = (id) => {
    return axios.delete(`${api}/categories/${id}`, { headers: getAuthHeaders() });
};

export const toggleCategoryStatus = (id, status) => {
    return axios.put(`${api}/categories/${id}`, { status }, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const getVoucherById = (id) => {
    return axios.get(`${api}/vouchers/${id}`, { headers: getAuthHeaders() });
};

export const createVoucher = (data) => {
    return axios.post(`${api}/vouchers`, data, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const updateVoucher = (id, data) => {
    return axios.put(`${api}/vouchers/${id}`, data, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const getAllVouchers = () => {
    return axios.get(`${api}/vouchers`, { headers: getAuthHeaders() });
};

export const deleteVoucher = (id) => {
    return axios.delete(`${api}/vouchers/${id}`, { headers: getAuthHeaders() });
};

export const getAllOrders = () => {
    return axios.get(`${api}/orders`, { headers: getAuthHeaders() });
};

export const getOrderById = (id) => {
    return axios.get(`${api}/orders/${id}`, { headers: getAuthHeaders() });
};

export const createOrder = (data) => {
    return axios.post(`${api}/orders`, data, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const updateOrder = (id, data) => {
    return axios.put(`${api}/orders/${id}`, data, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const deleteOrder = (id) => {
    return axios.delete(`${api}/orders/${id}`, { headers: getAuthHeaders() });
};

export const updateOrderStatus = (id, status) => {
    return axios.put(`${api}/orders/${id}/status`, { status }, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};



export const deleteProduct = (id) => {
    return axios.delete(`${api}/products/${id}`, { headers: getAuthHeaders() });
};

export const toggleProductStatus = (id, status) => {
    // status: 'active' or 'inactive'
    const action = status === 'active' ? 'activate' : 'deactivate';
    return axios.patch(`${api}/products/${id}/${action}`, {}, { headers: getAuthHeaders() });
};

// REVIEW MANAGEMENT
export const getAllReviews = () => {
    return axios.get(`${api}/reviews`, { headers: getAuthHeaders() });
};
export const deleteReview = (reviewId) => {
    return axios.delete(`${api}/reviews/${reviewId}`, { headers: getAuthHeaders() });
};
export const updateReviewStatus = (reviewId, status) => {
    return axios.patch(`${api}/reviews/${reviewId}/toggle-hidden`, {}, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

// COMMENT MANAGEMENT
export const getAllComments = () => {
    return axios.get(`${api}/comments`, { headers: getAuthHeaders() });
};
export const deleteComment = (commentId) => {
    return axios.delete(`${api}/comments/${commentId}`, { headers: getAuthHeaders() });
};
export const updateCommentStatus = (commentId, status) => {
    return axios.patch(`${api}/comments/${commentId}/toggle-hidden`, {}, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const getUserById = (id) => {
    return axios.get(`${api}/users/${id}`, { headers: getAuthHeaders() });
};

export const getProductById = (id) => {
    return axios.get(`${api}/products/${id}`, { headers: getAuthHeaders() });
};

export const getOrderDetailsByOrderId = (orderId) => {
    return axios.get(`${api}/orderdetails?order_id=${orderId}`, { headers: getAuthHeaders() });
};

export const getMyOrders = () => {
    return axios.get(`${api}/orders/my`, { headers: getAuthHeaders() });
};

// Lấy đơn hàng theo userId (Admin)
export const getOrdersByUserId = (userId) => {
    return axios.get(`${api}/orders?user_id=${userId}`, { headers: getAuthHeaders() });
};