import axios from "axios";

import { getApiUrl } from '../config/api.js';

const api = getApiUrl('');

// Lấy tất cả blog
export const getAllBlogs = (page = 1, limit = 10) => {
    return axios.get(`${api}/blogs?page=${page}&limit=${limit}`);
};

// Lấy blog theo ID
export const getBlogById = (id) => {
    return axios.get(`${api}/blogs/${id}`);
};

// Lấy tất cả danh mục blog
export const getAllBlogCategories = () => {
    return axios.get(`${api}/blogs_categories`);
};

// Lấy blog theo danh mục
export const getBlogsByCategory = (categoryId, page = 1, limit = 10) => {
    return axios.get(`${api}/blogs/category/${categoryId}?page=${page}&limit=${limit}`);
}; 