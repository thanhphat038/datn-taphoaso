import axios from "axios";

const api = "http://localhost:3000/api";

export const dataProduct = () => {
    return axios.get(`${api}/products`);
};

export const dataProductDetail = (_id) => {
    return axios.get(`${api}/products/${_id}`);
};

export const getRelatedProducts = (id, limit = 5) => {
    return axios.get(`${api}/products/${id}/related?limit=${limit}`);
};

// export const updatedata = (id, content) => {
//     return axios.put(`https://fakestoreapi.com/products/${id}`, content);
// };
export async function getReviewsByProductId(productId, page = 1, limit = 10) {
    try {
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("No auth token found");
      const response = await axios.get(`${api}/products/${productId}/reviews?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Tạo đánh giá thất bại");
    }
  }

