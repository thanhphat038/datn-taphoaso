import Variant from '../models/variant.model.js';
import Product from '../models/product.model.js';

class VariantService {
  // Create new variant
  async create(variantData) {
    try {
      // Check if product exists
      const product = await Product.findById(variantData.product_id);
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      const variant = new Variant(variantData);
      return await variant.save();
    } catch (error) {
      throw error;
    }
  }

  // Get all variants with pagination and filters
  async findAll(filters = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        populate = []
      } = options;

      const query = {};

      // Apply filters
      if (filters.product_id) {
        query.product_id = filters.product_id;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }
      if (filters.price_min !== undefined) {
        query.price = { ...query.price, $gte: filters.price_min };
      }
      if (filters.price_max !== undefined) {
        query.price = { ...query.price, $lte: filters.price_max };
      }
      if (filters.in_stock_min !== undefined) {
        query.in_stock = { ...query.in_stock, $gte: filters.in_stock_min };
      }
      if (filters.in_stock_max !== undefined) {
        query.in_stock = { ...query.in_stock, $lte: filters.in_stock_max };
      }

      const skip = (page - 1) * limit;
      
      let queryBuilder = Variant.find(query);

      // Apply populate
      if (populate.length > 0) {
        populate.forEach(pop => {
          queryBuilder = queryBuilder.populate(pop);
        });
      }

      const variants = await queryBuilder
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Variant.countDocuments(query);

      return {
        variants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get variant by ID
  async findById(id, options = {}) {
    try {
      const { populate = [] } = options;
      
      let queryBuilder = Variant.findById(id);

      // Apply populate
      if (populate.length > 0) {
        populate.forEach(pop => {
          queryBuilder = queryBuilder.populate(pop);
        });
      }

      return await queryBuilder;
    } catch (error) {
      throw error;
    }
  }

  // Update variant
  async update(id, updateData) {
    try {
      // Check if product exists if product_id is being updated
      if (updateData.product_id) {
        const product = await Product.findById(updateData.product_id);
        if (!product) {
          throw new Error('Sản phẩm không tồn tại');
        }
      }

      return await Variant.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Delete variant
  async delete(id) {
    try {
      return await Variant.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Toggle variant status
  async toggleStatus(id) {
    try {
      const variant = await Variant.findById(id);
      if (!variant) {
        throw new Error('Biến thể không tồn tại');
      }

      variant.status = variant.status === 'active' ? 'inactive' : 'active';
      return await variant.save();
    } catch (error) {
      throw error;
    }
  }

  // Get variants by product ID
  async findByProductId(productId, options = {}) {
    try {
      const { status = 'active', sort = { is_default: -1, createdAt: -1 } } = options;
      
      const query = { product_id: productId };
      if (status !== 'all') {
        query.status = status;
      }

      return await Variant.find(query).sort(sort);
    } catch (error) {
      throw error;
    }
  }

  // Set default variant for a product
  async setDefaultVariant(productId, variantId) {
    try {
      // First, unset all default variants for this product
      await Variant.updateMany(
        { product_id: productId },
        { is_default: false }
      );

      // Then set the specified variant as default
      return await Variant.findByIdAndUpdate(
        variantId,
        { is_default: true },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Get variant statistics
  async getStats() {
    try {
      const total = await Variant.countDocuments();
      const active = await Variant.countDocuments({ status: 'active' });
      const inactive = await Variant.countDocuments({ status: 'inactive' });
      const lowStock = await Variant.countDocuments({ in_stock: { $lt: 10 } });
      const outOfStock = await Variant.countDocuments({ in_stock: 0 });
      const defaultVariants = await Variant.countDocuments({ is_default: true });

      return {
        total,
        active,
        inactive,
        lowStock,
        outOfStock,
        defaultVariants
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new VariantService(); 