import { productService } from '../services/index.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

// Create new product
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page, limit } = req.query;
    const products = await productService.findAll(
      { category, search },
      { sort, page, limit }
    );
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get product by id
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Product not found');
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    await productService.delete(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page, limit, sort } = req.query;
    const products = await productService.findByCategory(categoryId, { page, limit, sort });
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;
    const products = await productService.searchProducts(query);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get top rated products
export const getTopRatedProducts = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await productService.getTopRated(limit);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get new arrivals
export const getNewArrivals = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await productService.getNewArrivals(limit);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get related products
export const getRelatedProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { limit } = req.query;
    const products = await productService.getRelatedProducts(productId, limit);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
