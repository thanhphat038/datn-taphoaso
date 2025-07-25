import axios from "axios";
import Cookies from "js-cookie";

const api = "http://localhost:3000/api";

function getAuthHeaders() {
    const token = Cookies.get('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createOrder = (orderData) => {
    console.log(orderData);
    
    return axios.post(`${api}/orders`, orderData, { headers: getAuthHeaders() });
};