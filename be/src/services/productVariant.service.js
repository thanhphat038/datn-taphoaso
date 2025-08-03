import ProductVariant from '../models/productVariant.model.js';
import Product from '../models/product.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class ProductVariantService {
  // Tạo biến thể sản phẩm mới
  async createVariant(variantData) {
    try {
      // Kiểm tra sản phẩm tồn tại
      const product = await Product.findById(variantData.product_id);
      if (!product) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Sản phẩm không tồn tại');
      }

      // Nếu đây là biến thể mặc định, hủy bỏ biến thể mặc định cũ
      if (variantData.is_default) {
        await ProductVariant.updateMany(
          { product_id: variantData.product_id, is_default: true },
          { is_default: false }
        );
      }

      const variant = new ProductVariant(variantData);
      await variant.save();
      
      return variant;
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả biến thể của một sản phẩm
  async getVariantsByProduct(productId, status = 'active') {
    try {
      const variants = await ProductVariant.find({
        product_id: productId,
        status: status
      }).sort({ is_default: -1, create_at: -1 });
      
      return variants;
    } catch (error) {
      throw error;
    }
  }

  // Lấy biến thể theo ID
  async getVariantById(variantId) {
    try {
      const variant = await ProductVariant.findById(variantId);
      if (!variant) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Biến thể sản phẩm không tồn tại');
      }
      return variant;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật biến thể sản phẩm
  async updateVariant(variantId, updateData) {
    try {
      const variant = await ProductVariant.findById(variantId);
      if (!variant) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Biến thể sản phẩm không tồn tại');
      }

      // Nếu đang set làm mặc định, hủy bỏ biến thể mặc định cũ
      if (updateData.is_default) {
        await ProductVariant.updateMany(
          { product_id: variant.product_id, is_default: true, _id: { $ne: variantId } },
          { is_default: false }
        );
      }

      const updatedVariant = await ProductVariant.findByIdAndUpdate(
        variantId,
        updateData,
        { new: true, runValidators: true }
      );

      return updatedVariant;
    } catch (error) {
      throw error;
    }
  }

  // Xóa biến thể sản phẩm
  async deleteVariant(variantId) {
    try {
      const variant = await ProductVariant.findById(variantId);
      if (!variant) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Biến thể sản phẩm không tồn tại');
      }

      // Không cho phép xóa biến thể mặc định
      if (variant.is_default) {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể xóa biến thể mặc định');
      }

      await ProductVariant.findByIdAndDelete(variantId);
      return { message: 'Biến thể sản phẩm đã được xóa' };
    } catch (error) {
      throw error;
    }
  }

  // Lấy biến thể mặc định của sản phẩm
  async getDefaultVariant(productId) {
    try {
      const variant = await ProductVariant.findOne({
        product_id: productId,
        is_default: true,
        status: 'active'
      });
      
      return variant;
    } catch (error) {
      throw error;
    }
  }

  // Lấy biến thể theo đơn vị
  async getVariantsByUnit(productId, unit) {
    try {
      const variants = await ProductVariant.find({
        product_id: productId,
        unit: unit,
        status: 'active'
      });
      
      return variants;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật số lượng tồn kho
  async updateStock(variantId, quantity) {
    try {
      const variant = await ProductVariant.findById(variantId);
      if (!variant) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Biến thể sản phẩm không tồn tại');
      }

      const newStock = variant.in_stock + quantity;
      if (newStock < 0) {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Số lượng tồn kho không đủ');
      }

      variant.in_stock = newStock;
      await variant.save();
      
      return variant;
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả đơn vị có sẵn
  async getAvailableUnits() {
    try {
      const units = await ProductVariant.distinct('unit');
      return units;
    } catch (error) {
      throw error;
    }
  }

  // Tìm kiếm biến thể
  async searchVariants(productId, searchTerm, unit = null) {
    try {
      let query = {
        product_id: productId,
        status: 'active'
      };

      if (unit) {
        query.unit = unit;
      }

      if (searchTerm) {
        query.name = { $regex: searchTerm, $options: 'i' };
      }

      const variants = await ProductVariant.find(query).sort({ is_default: -1, create_at: -1 });
      return variants;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductVariantService; 