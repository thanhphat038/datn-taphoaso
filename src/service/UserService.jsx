import axios from "axios";

const API_URL = "http://localhost:3001/auth";

export async function registerUser({ username, email, password, full_name, phone }) {
  try {
    const response = await axios.post(`${API_URL}`, { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await axios.get(`${API_URL}`, { params: { email, password } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
  }
}
