import variantService from '../services/variant.service.js';
import { handleError } from '../errors/handleError.js';

// Get all variants with filters and pagination
export const getVariants = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      name,
      product_id,
      price_min,
      price_max,
      in_stock_min,
      in_stock_max,
      sort_by = 'createdAt',
      sort_order = 'desc'
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (name) filters.name = name;
    if (product_id) filters.product_id = product_id;
    if (price_min) filters.price_min = parseFloat(price_min);
    if (price_max) filters.price_max = parseFloat(price_max);
    if (in_stock_min) filters.in_stock_min = parseInt(in_stock_min);
    if (in_stock_max) filters.in_stock_max = parseInt(in_stock_max);

    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: 'product_id', select: 'name images' }
      ]
    };

    const result = await variantService.findAll(filters, options);

    res.json({
      success: true,
      data: result.variants,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// Get variant by ID
export const getVariantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const variant = await variantService.findById(id, {
      populate: [
        { path: 'product_id', select: 'name images description' }
      ]
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Biến thể không tồn tại'
      });
    }

    res.json({
      success: true,
      data: variant
    });
  } catch (error) {
    next(error);
  }
};

// Create new variant
export const createVariant = async (req, res, next) => {
  try {
    const variantData = req.body;

    // Validate required fields
    if (!variantData.name || !variantData.product_id || !variantData.price || !variantData.unit || !variantData.original_price) {
      return res.status(400).json({
        success: false,
        message: 'Tên, sản phẩm, giá, giá gốc và đơn vị là bắt buộc'
      });
    }

    const variant = await variantService.create(variantData);

    res.status(201).json({
      success: true,
      message: 'Tạo biến thể thành công',
      data: variant
    });
  } catch (error) {
    next(error);
  }
};

// Update variant
export const updateVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const variant = await variantService.update(id, updateData);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Biến thể không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật biến thể thành công',
      data: variant
    });
  } catch (error) {
    next(error);
  }
};

// Delete variant
export const deleteVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const variant = await variantService.delete(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Biến thể không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Xóa biến thể thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Toggle variant status
export const toggleVariantStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const variant = await variantService.toggleStatus(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Biến thể không tồn tại'
      });
    }

    res.json({
      success: true,
      message: `Đã ${variant.status === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} biến thể`,
      data: variant
    });
  } catch (error) {
    next(error);
  }
};

// Get variants by product ID
export const getVariantsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { status = 'active', sort = 'is_default' } = req.query;

    const options = {
      status,
      sort: { [sort]: -1, createdAt: -1 }
    };

    const variants = await variantService.findByProductId(productId, options);

    res.json({
      success: true,
      data: variants
    });
  } catch (error) {
    next(error);
  }
};

// Get variant statistics
export const getVariantStats = async (req, res, next) => {
  try {
    const stats = await variantService.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Set default variant for a product
export const setDefaultVariant = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;

    const variant = await variantService.setDefaultVariant(productId, variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Biến thể không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Đã đặt biến thể làm mặc định',
      data: variant
    });
  } catch (error) {
    next(error);
  }
}; 