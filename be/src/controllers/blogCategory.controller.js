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
        message: 'No blog categories found'
      });
    }

    res.json({
      success: true,
      data: categories,
      message: 'Blog categories retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving blog categories',
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
        message: 'Invalid blog category ID format'
      });
    }
    const category = await blogCategoryService.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Blog category not found'
      });
    }
    res.json({
      success: true,
      data: category,
      message: 'Blog category retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving blog category',
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
        message: 'Blog category name is required'
      });
    }
    const existingCategory = await blogCategoryService.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Blog category name already exists'
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
      message: 'Blog category created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog category',
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
          message: 'Blog category name already exists'
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
      message: 'Blog category updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog category',
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
      message: 'Blog category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog category',
      error: error.message
    });
  }
}; 