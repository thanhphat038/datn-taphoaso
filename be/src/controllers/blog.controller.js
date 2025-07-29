import { blogService } from '../services/index.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

// Create new blog
export const createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlog(req.body);
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Get all blogs (with pagination)
export const getBlogs = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;
    const blogs = await blogService.getAllBlogs({ page, limit, sort });
    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// Get blog by id
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Blog not found');
    }
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Update blog
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Delete blog
export const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 