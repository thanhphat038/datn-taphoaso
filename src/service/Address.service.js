import axios from "axios";
import Cookies from "js-cookie";

import { getApiUrl } from '../config/api.js';

const api = getApiUrl('');

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getAllAddress = () => {
    return axios.get(`${api}/addresses/user/me`, { headers: getAuthHeaders() });
};

export const getAddressById = (id) => {
    return axios.get(`${api}/addresses/${id}`, { headers: getAuthHeaders() });
};

export const createAddress = (data) => {
    console.log(data);
    return axios.post(`${api}/addresses`, data, { headers: getAuthHeaders() });
};

export const updateAddress = (id, data) => {
    return axios.put(`${api}/addresses/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteAddress = (id) => {
    return axios.delete(`${api}/addresses/${id}`, { headers: getAuthHeaders() });
};

// API lấy dữ liệu vị trí cho UI (không cần token)
export const getProvinces = () => {
    return axios.get('https://provinces.open-api.vn/api/?depth=1', { withCredentials: false });
};
export const getDistricts = (provinceCode) => {
    return axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`, { withCredentials: false });
};
export const getWards = (districtCode) => {
    return axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, { withCredentials: false });
};

