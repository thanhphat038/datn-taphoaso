import axios from "axios";

import { getApiUrl } from '../config/api.js';

const api = getApiUrl('');

// Lấy tất cả blog
export const getAllBlogs = () => {
    return axios.get(`${api}/blogs`);
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
export const getBlogsByCategory = (categoryId) => {
    return axios.get(`${api}/blogs/category/${categoryId}`);
}; 