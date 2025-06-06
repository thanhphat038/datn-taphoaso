import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

export async function registerUser({ name, email, password }) {
    try {
        const response = await axios.post(`${API_URL}`, { name, email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
}

export async function loginUser({ email, password }) {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
}
