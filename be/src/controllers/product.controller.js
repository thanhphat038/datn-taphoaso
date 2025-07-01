// import { productService } from '../services/index.js';
// import { AppError } from '../errors/AppError.js';
// import { ERROR_CODES } from '../errors/errorDefinitions.js';
// import {
//   created,
//   badRequest,
//   notFound,
//   ok,
//   serverError,
//   noContent
// } from '../utils/response.js';

// // Create new product
// export const createProduct = async (req, res, next) => {
//   try {
//     const product = await productService.create(req.body);
//     return created(res, product, 'Product created successfully');
//   } catch (error) {
//     next(error);
//   }
// };

// // Get all products
// export const getProducts = async (req, res, next) => {
//   try {
//     const { category, search, sort, page, limit } = req.query;
//     const products = await productService.findAll(
//       { category, search },
//       { sort, page, limit }
//     );
//     return ok(res, products);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get product by id
// export const getProductById = async (req, res, next) => {
//   try {
//     const product = await productService.findById(req.params.id);
//     if (!product) {
//       throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
//     }
//     return ok(res, product);
//   } catch (error) {
//     if (error instanceof AppError) {
//       return notFound(res, error.message);
//     }
//     next(error);
//   }
// };

// // Update product
// export const updateProduct = async (req, res, next) => {
//   try {
//     const product = await productService.update(req.params.id, req.body);
//     if (!product) {
//       throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
//     }
//     return ok(res, product, 'Product updated successfully');
//   } catch (error) {
//     if (error instanceof AppError) {
//       return notFound(res, error.message);
//     }
//     next(error);
//   }
// };

// // Delete product
// export const deleteProduct = async (req, res, next) => {
//   try {
//     const product = await productService.delete(req.params.id);
//     if (!product) {
//       throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
//     }

//     return res.json({
//       success: true,
//       message: 'Xoá sản phẩm thành công'
//     });
    
//   } catch (error) {
//     if (error instanceof AppError) {
//       return notFound(res, error.message);
//     }
//     next(error);
//   }
// };

// // Get products by category
// export const getProductsByCategory = async (req, res, next) => {
//   try {
//     const { categoryId } = req.params;
//     const { page, limit, sort } = req.query;
//     const products = await productService.findByCategory(categoryId, { page, limit, sort });
//     return ok(res, products);
//   } catch (error) {
//     next(error);
//   }
// };

// // Search products
// export const searchProducts = async (req, res, next) => {
//   try {
//     const { query } = req.query;
//     const products = await productService.searchProducts(query);
//     return ok(res, products);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get top rated products
// export const getTopRatedProducts = async (req, res, next) => {
//   try {
//     const { limit } = req.query;
//     const products = await productService.getTopRated(limit);
//     return ok(res, products);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get new arrivals
// export const getNewArrivals = async (req, res, next) => {
//   try {
//     const { limit } = req.query;
//     const products = await productService.getNewArrivals(limit);
//     return ok(res, products);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get related products
// export const getRelatedProducts = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { limit = 4 } = req.query;
    
//     const currentProduct = await productService.findById(id);
//     if (!currentProduct) {
//       throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
//     }

//     const relatedProducts = await productService.findByCategory(
//       currentProduct.category_id,
//       { 
//         limit: parseInt(limit),
//         excludeId: id
//       }
//     );

//     if (relatedProducts.length === 0) {
//       return ok(res, [], 'No related products found in this category');
//     }

//     return ok(res, relatedProducts, 'Related products retrieved successfully');
//   } catch (error) {
//     if (error instanceof AppError) {
//       return notFound(res, error.message);
//     }
//     next(error);
//   }
// };

// // Activate product
// export const activateProduct = async (req, res, next) => {
//   try {
//     const product = await productService.updateStatus(req.params.id, 'active');
//     if (!product) {
//       throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
//     }
//     return ok(res, product, 'Product activated successfully');
//   } catch (error) {
//     if (error instanceof AppError) {
//       return notFound(res, error.message);
//     }
//     next(error);
//   }
// };

// // Deactivate product
// export const deactivateProduct = async (req, res, next) => {
//   try {
//     const product = await productService.updateStatus(req.params.id, 'inactive');
//     if (!product) {
//       throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
//     }
//     return ok(res, product, 'Product deactivated successfully');
//   } catch (error) {
//     if (error instanceof AppError) {
//       return notFound(res, error.message);
//     }
//     next(error);
//   }
// };


// product.controller.js
import { productService } from '../services/index.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';
import {
  created,
  badRequest,
  notFound,
  ok,
  serverError,
  noContent
} from '../utils/response.js';

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    return created(res, product, 'Product created successfully');
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page, limit } = req.query;
    const products = await productService.findAll(
      { category, search },
      { sort, page, limit }
    );
    return ok(res, products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
    return ok(res, product);
  } catch (error) {
    if (error instanceof AppError) return notFound(res, error.message);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
    return ok(res, product, 'Product updated successfully');
  } catch (error) {
    if (error instanceof AppError) return notFound(res, error.message);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.delete(req.params.id);
    if (!product) throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
    return res.json({ success: true, message: 'Xoá sản phẩm thành công' });
  } catch (error) {
    if (error instanceof AppError) return notFound(res, error.message);
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page, limit, sort } = req.query;
    const products = await productService.findByCategory(categoryId, { page, limit, sort });
    return ok(res, products);
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const products = await productService.searchProducts(q);
    return ok(res, products);
  } catch (error) {
    next(error);
  }
};

export const getTopRatedProducts = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await productService.getTopRated(limit);
    return ok(res, products);
  } catch (error) {
    next(error);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await productService.getNewArrivals(limit);
    return ok(res, products);
  } catch (error) {
    next(error);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;
    const currentProduct = await productService.findById(id);
    if (!currentProduct) throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
    const relatedProducts = await productService.findByCategory(
      currentProduct.category_id,
      { limit: parseInt(limit), excludeId: id }
    );
    return ok(res, relatedProducts, 'Related products retrieved successfully');
  } catch (error) {
    if (error instanceof AppError) return notFound(res, error.message);
    next(error);
  }
};

export const activateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateStatus(req.params.id, 'active');
    if (!product) throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
    return ok(res, product, 'Product activated successfully');
  } catch (error) {
    if (error instanceof AppError) return notFound(res, error.message);
    next(error);
  }
};

export const deactivateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateStatus(req.params.id, 'inactive');
    if (!product) throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
    return ok(res, product, 'Product deactivated successfully');
  } catch (error) {
    if (error instanceof AppError) return notFound(res, error.message);
    next(error);
  }
};
