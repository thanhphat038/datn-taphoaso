import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = Cookies.get("auth_token");
  console.log("=== AUTH HEADERS ===");
  console.log("Token from cookies:", token);
  console.log("Token type:", typeof token);
  console.log("Token valid:", token && token !== "undefined" && token !== "null");
  
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  
  console.log("Final headers:", headers);
  return headers;
};

// Get all variants with filters and pagination
export const getAllVariants = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/variants`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get variant by ID
export const getVariantById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/variants/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new variant
export const createVariant = async (variantData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/variants`, variantData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update variant
export const updateVariant = async (id, variantData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/variants/${id}`, variantData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete variant
export const deleteVariant = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/variants/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle variant status
export const toggleVariantStatus = async (id) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/variants/${id}/toggle-status`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get variants by product ID
export const getVariantsByProduct = async (productId, params = {}) => {
  try {
    console.log("=== GET VARIANTS BY PRODUCT SERVICE ===");
    console.log("Product ID:", productId);
    console.log("Params:", params);
    console.log("API URL:", `${API_BASE_URL}/variants/product/${productId}`);
    console.log("Auth headers:", getAuthHeaders());
    
    const response = await axios.get(`${API_BASE_URL}/variants/product/${productId}`, {
      headers: getAuthHeaders(),
      params,
    });
    
    console.log("Service response:", response);
    console.log("Service response data:", response.data);
    console.log("=== GET VARIANTS BY PRODUCT SERVICE SUCCESS ===");
    
    return response.data;
  } catch (error) {
    console.error("=== GET VARIANTS BY PRODUCT SERVICE ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    console.error("Error response data:", error.response?.data);
    console.error("Error response status:", error.response?.status);
    throw error;
  }
};

// Get variant statistics
export const getVariantStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/variants/stats`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Set default variant for a product
export const setDefaultVariant = async (productId, variantId) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/variants/${productId}/set-default/${variantId}`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 