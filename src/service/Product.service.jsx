import axios from "axios";
import Cookies from "js-cookie";

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

// Tìm kiếm sản phẩm
export const searchProducts = (query, page = 1, limit = 16, sort = 'name', order = 'asc') => {
    const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        sort: sort,
        order: order
    });
    return axios.get(`${api}/products/search?${params.toString()}`);
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = (categoryId, page = 1, limit = 16) => {
    return axios.get(`${api}/products/category/${categoryId}?page=${page}&limit=${limit}`);
};

// Lấy sản phẩm mới nhất
export const getNewArrivals = (limit = 10) => {
    return axios.get(`${api}/products/new-arrivals?limit=${limit}`);
};

// Lấy sản phẩm đánh giá cao
export const getTopRatedProducts = (limit = 10) => {
    return axios.get(`${api}/products/top-rated?limit=${limit}`);
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
      throw new Error(error.response?.data?.message || "Lấy đánh giá thất bại");
    }
  }

