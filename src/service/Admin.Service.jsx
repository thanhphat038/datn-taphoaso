import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Banner functions (no authentication required)
export const getAllBanners = async () => {
  try {
    const response = await axios.get(`${API_URL}/banners`);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const getBannerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/banners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching banner:', error);
    throw error;
  }
};

export const createBanner = async (bannerData) => {
  try {
    const response = await axios.post(`${API_URL}/banners`, bannerData);
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

export const updateBanner = async (id, bannerData) => {
  try {
    const response = await axios.put(`${API_URL}/banners/${id}`, bannerData);
    return response.data;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/banners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

export const updateBannerStatus = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/banners/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling banner status:', error);
    throw error;
  }
};

// Upload functions
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// User functions (with authentication)
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${userId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Product functions (with authentication)
export const getAllProducts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (productData, token) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData, token) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProductById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Category functions (with authentication)
export const getAllCategories = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (categoryData, token) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData, token) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const toggleCategoryStatus = async (id, token) => {
  try {
    const response = await axios.patch(`${API_URL}/categories/${id}/toggle-status`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw error;
  }
};

// Voucher functions (with authentication)
export const getAllVouchers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/vouchers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    throw error;
  }
};

export const createVoucher = async (voucherData, token) => {
  try {
    const response = await axios.post(`${API_URL}/vouchers`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating voucher:', error);
    throw error;
  }
};

export const updateVoucher = async (id, voucherData, token) => {
  try {
    const response = await axios.put(`${API_URL}/vouchers/${id}`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating voucher:', error);
    throw error;
  }
};

export const deleteVoucher = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/vouchers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting voucher:', error);
    throw error;
  }
};

export const getVoucherById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/vouchers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching voucher:', error);
    throw error;
  }
};

// Order functions (with authentication)
export const getAllOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/orders/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrderById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Blog functions (with authentication)
export const getAllBlogs = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/blogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const createBlog = async (blogData, token) => {
  try {
    const response = await axios.post(`${API_URL}/blogs`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (id, blogData, token) => {
  try {
    const response = await axios.put(`${API_URL}/blogs/${id}`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const getBlogById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

// Blog Category functions (with authentication)
export const getAllBlogCategories = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/blog-categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw error;
  }
};

export const createBlogCategory = async (categoryData, token) => {
  try {
    const response = await axios.post(`${API_URL}/blog-categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog category:', error);
    throw error;
  }
};

export const updateBlogCategory = async (id, categoryData, token) => {
  try {
    const response = await axios.put(`${API_URL}/blog-categories/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog category:', error);
    throw error;
  }
};

export const deleteBlogCategory = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/blog-categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting blog category:', error);
    throw error;
  }
};

// Comment functions (with authentication)
export const getAllComments = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const updateCommentStatus = async (commentId, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/comments/${commentId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating comment status:', error);
    throw error;
  }
};

export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Review functions (with authentication)
export const getAllReviews = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const updateReviewStatus = async (reviewId, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/reviews/${reviewId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating review status:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Variant functions (with authentication)
export const getAllVariants = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/variants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching variants:', error);
    throw error;
  }
};

export const createVariant = async (variantData, token) => {
  try {
    const response = await axios.post(`${API_URL}/variants`, variantData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating variant:', error);
    throw error;
  }
};

export const updateVariant = async (id, variantData, token) => {
  try {
    const response = await axios.put(`${API_URL}/variants/${id}`, variantData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating variant:', error);
    throw error;
  }
};

export const deleteVariant = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/variants/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting variant:', error);
    throw error;
  }
};

export const getVariantById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/variants/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching variant:', error);
    throw error;
  }
};

// Additional missing functions
export const deleteOrder = async (orderId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const getOrderDetailsByOrderId = async (orderId, token) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const toggleProductStatus = async (productId, token) => {
  try {
    const response = await axios.patch(`${API_URL}/products/${productId}/toggle-status`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
};


