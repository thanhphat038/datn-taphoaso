import axios from "axios";
import Cookies from "js-cookie";

import { getApiUrl } from '../config/api.js';

const api = getApiUrl('');

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const validateVoucherAPI = async (code, orderAmount) => {
    return axios.post(`${api}/vouchers/validate`, { 
        code, 
        orderAmount 
    }, { 
        headers: getAuthHeaders() 
    });
};

export const getAllVouchers = () => {
    return axios.get(`${api}/vouchers`, { headers: getAuthHeaders() });
};

// Thêm method getVoucherByCode
export const getVoucherByCode = async (code) => {
    return axios.get(`${api}/vouchers/code/${code}`, { 
        headers: getAuthHeaders() 
    });
};

// Thêm method để tạo voucher (nếu cần)
export const createVoucher = (data) => {
    return axios.post(`${api}/vouchers`, data, { 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } 
    });
};

// Thêm method để cập nhật voucher (nếu cần)
export const updateVoucher = (id, data) => {
    return axios.put(`${api}/vouchers/${id}`, data, { 
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } 
    });
};

// Thêm method để xóa voucher (nếu cần)
export const deleteVoucher = (id) => {
    return axios.delete(`${api}/vouchers/${id}`, { 
        headers: getAuthHeaders() 
    });
};