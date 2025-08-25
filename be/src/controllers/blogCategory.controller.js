import { blogCategoryService } from '../services/index.js';
import mongoose from 'mongoose';

// Get all blog categories
export const getBlogCategories = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) filters.status = status;

    const categories = await blogCategoryService.findAll(filters);
    
    if (!categories || categories.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'Không tìm thấy danh mục blog nào'
      });
    }

    res.json({
      success: true,
      data: categories,
      message: 'Lấy danh sách danh mục blog thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách danh mục blog',
      error: error.message
    });
  }
};

// Get blog category by id
export const getBlogCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng ID danh mục blog không hợp lệ'
      });
    }
    const category = await blogCategoryService.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục blog'
      });
    }
    res.json({
      success: true,
      data: category,
      message: 'Lấy thông tin danh mục blog thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin danh mục blog',
      error: error.message
    });
  }
};

// Create blog category
export const createBlogCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục blog là bắt buộc'
      });
    }
    const existingCategory = await blogCategoryService.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục blog đã tồn tại'
      });
    }
    const category = await blogCategoryService.create({
      name,
      description,
      status: status || 'active'
    });
    res.status(201).json({
      success: true,
      data: category,
      message: 'Tạo danh mục blog thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo danh mục blog',
      error: error.message
    });
  }
};

// Update blog category
export const updateBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog category ID format'
      });
    }
    const existingCategory = await blogCategoryService.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Blog category not found'
      });
    }
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await blogCategoryService.findOne({ name });
      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục blog đã tồn tại'
        });
      }
    }
    const updatedCategory = await blogCategoryService.update(id, {
      name,
      description,
      status
    });
    res.json({
      success: true,
      data: updatedCategory,
      message: 'Cập nhật danh mục blog thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật danh mục blog',
      error: error.message
    });
  }
};

// Delete blog category
export const deleteBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog category ID format'
      });
    }
    const existingCategory = await blogCategoryService.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Blog category not found'
      });
    }
    await blogCategoryService.delete(id);
    res.json({
      success: true,
      message: 'Xóa danh mục blog thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa danh mục blog',
      error: error.message
    });
  }
}; 