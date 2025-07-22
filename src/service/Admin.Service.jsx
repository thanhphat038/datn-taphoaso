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

export const updateOrderStatus = (id, status) => {
    return axios.put(`${api}/orders/${id}/status`, { status }, { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } });
};

export const deleteOrder = (id) => {
    return axios.delete(`${api}/orders/${id}`, { headers: getAuthHeaders() });
};

export const getProductById = (id) => {
    return axios.get(`${api}/products/${id}`, { headers: getAuthHeaders() });
};

export const deleteProduct = (id) => {
    return axios.delete(`${api}/products/${id}`, { headers: getAuthHeaders() });
};

export const toggleProductStatus = (id, status) => {
    // status: 'active' or 'inactive'
    const action = status === 'active' ? 'activate' : 'deactivate';
    return axios.patch(`${api}/products/${id}/${action}`, {}, { headers: getAuthHeaders() });
};