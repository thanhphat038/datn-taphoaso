import ProductVariantService from '../services/productVariant.service.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

const productVariantService = new ProductVariantService();

// Tạo biến thể sản phẩm mới
export const createVariant = async (req, res, next) => {
  try {
    const variantData = req.body;
    
    if (!variantData.product_id) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'ID sản phẩm là bắt buộc');
    }

    const variant = await productVariantService.createVariant(variantData);
    
    res.status(201).json({
      success: true,
      data: variant
    });
  } catch (err) {
    next(err);
  }
};

// Lấy tất cả biến thể của một sản phẩm
export const getVariantsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { status = 'active' } = req.query;

    const variants = await productVariantService.getVariantsByProduct(productId, status);
    
    res.json({
      success: true,
      data: variants
    });
  } catch (err) {
    next(err);
  }
};

// Lấy biến thể theo ID
export const getVariantById = async (req, res, next) => {
  try {
    const { variantId } = req.params;

    const variant = await productVariantService.getVariantById(variantId);
    
    res.json({
      success: true,
      data: variant
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const updateData = req.body;

    const variant = await productVariantService.updateVariant(variantId, updateData);
    
    res.json({
      success: true,
      data: variant
    });
  } catch (err) {
    next(err);
  }
};

// Xóa biến thể sản phẩm
export const deleteVariant = async (req, res, next) => {
  try {
    const { variantId } = req.params;

    const result = await productVariantService.deleteVariant(variantId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

// Lấy biến thể mặc định của sản phẩm
export const getDefaultVariant = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const variant = await productVariantService.getDefaultVariant(productId);
    
    res.json({
      success: true,
      data: variant
    });
  } catch (err) {
    next(err);
  }
};

// Lấy biến thể theo đơn vị
export const getVariantsByUnit = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { unit } = req.query;

    if (!unit) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Đơn vị là bắt buộc');
    }

    const variants = await productVariantService.getVariantsByUnit(productId, unit);
    
    res.json({
      success: true,
      data: variants
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật số lượng tồn kho
export const updateStock = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Số lượng phải là số');
    }

    const variant = await productVariantService.updateStock(variantId, quantity);
    
    res.json({
      success: true,
      data: variant
    });
  } catch (err) {
    next(err);
  }
};

// Lấy tất cả đơn vị có sẵn
export const getAvailableUnits = async (req, res, next) => {
  try {
    const units = await productVariantService.getAvailableUnits();
    
    res.json({
      success: true,
      data: units
    });
  } catch (err) {
    next(err);
  }
};

// Tìm kiếm biến thể
export const searchVariants = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { search, unit } = req.query;

    const variants = await productVariantService.searchVariants(productId, search, unit);
    
    res.json({
      success: true,
      data: variants
    });
  } catch (err) {
    next(err);
  }
}; 