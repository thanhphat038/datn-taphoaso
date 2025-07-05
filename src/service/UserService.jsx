import axios from "axios";
import Cookies from "js-cookie";
const API_URL = "http://localhost:3000/api/auth";

export async function registerUser({ username, email, password }) {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    console.log(response.data.data);
    
    const { token } = response.data.data;
    console.log(token);
    
    if (token) {
      // Lưu token vào cookie, hết hạn sau 7 ngày (bạn có thể điều chỉnh)
      Cookies.set("auth_token", token, { expires: 7 });
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
}

export async function loginUser({ username, password }) {
  try {
    const response = await axios.post(`${API_URL}/login`, { username: username, password: password });
    const { token } = response.data.data;
    console.log(token);
    
    if (token) {
      // Lưu token vào cookie, hết hạn sau 7 ngày (bạn có thể điều chỉnh)
      Cookies.set("auth_token", token, { expires: 7 });
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
  }
}

