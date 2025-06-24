import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export async function registerUser({ username, email, password }) {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
}

export async function loginUser({ username, password }) {
  try {
    const response = await axios.post(`${API_URL}/login`, { username: username, password: password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
  }
}
