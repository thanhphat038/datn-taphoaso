
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

// New function to get user profile
export async function getProfile() {
  try {
    const token = Cookies.get("auth_token");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lấy thông tin profile thất bại");
  }
}

export async function updateUser(id, userData) {
  try {
    const token = Cookies.get("auth_token");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await axios.put(`http://localhost:3000/api/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật thông tin thất bại");
  }
}

// New function to update profile
export async function updateProfile(userData) {
  try {
    const token = Cookies.get("auth_token");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật profile thất bại");
  }
}

// New function to change password
export async function changePassword(currentPassword, newPassword) {
  try {
    const token = Cookies.get("auth_token");
    if (!token) {
      throw new Error("No auth token found");
    }
    const response = await axios.put(`${API_URL}/change-password`, { currentPassword, newPassword }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    // Improve error message extraction to handle different error response formats
    const message = error.response?.data?.message || error.message || "Đổi mật khẩu thất bại";
    throw new Error(message);
  }
}

