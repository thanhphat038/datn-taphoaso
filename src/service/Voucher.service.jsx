import axios from "axios";
import Cookies from "js-cookie";

import { getApiUrl } from '../config/api.js';

const api = getApiUrl('');

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getVoucherByCode = (code) => {
    return axios.get(`${api}/vouchers/code/${code}`, { headers: getAuthHeaders() });
};