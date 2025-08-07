import RecentViews from '../models/recentViews.model.js';
import Product from '../models/product.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class RecentViewsService {
  // Thêm sản phẩm vào danh sách xem gần đây
  async addView(userId, productId) {
    try {
      // Kiểm tra sản phẩm tồn tại
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Sản phẩm không tồn tại');
      }

      // Tìm xem user đã xem sản phẩm này chưa
      let recentView = await RecentViews.findOne({
        user_id: userId,
        product_id: productId
      });

      if (recentView) {
        // Nếu đã xem, tăng số lần xem và cập nhật thời gian
        recentView.view_count += 1;
        recentView.viewed_at = new Date();
        await recentView.save();
      } else {
        // Nếu chưa xem, tạo mới
        recentView = new RecentViews({
          user_id: userId,
          product_id: productId,
          view_count: 1
        });
        await recentView.save();
      }

      return recentView;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách sản phẩm xem gần đây của user
  async getRecentViews(userId, limit = 10) {
    try {
      const recentViews = await RecentViews.find({ user_id: userId })
        .populate('product_id', 'name price original_price images category_id status')
        .sort({ viewed_at: -1 })
        .limit(limit);

      return recentViews;
    } catch (error) {
      throw error;
    }
  }

  // Xóa một sản phẩm khỏi danh sách xem gần đây
  async removeView(userId, productId) {
    try {
      const result = await RecentViews.findOneAndDelete({
        user_id: userId,
        product_id: productId
      });

      if (!result) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Không tìm thấy sản phẩm trong danh sách xem gần đây');
      }

      return { message: 'Đã xóa sản phẩm khỏi danh sách xem gần đây' };
    } catch (error) {
      throw error;
    }
  }

  // Xóa tất cả sản phẩm khỏi danh sách xem gần đây
  async clearAllViews(userId) {
    try {
      const result = await RecentViews.deleteMany({ user_id: userId });
      
      return { 
        message: `Đã xóa ${result.deletedCount} sản phẩm khỏi danh sách xem gần đây` 
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy số lượng sản phẩm xem gần đây
  async getViewCount(userId) {
    try {
      const count = await RecentViews.countDocuments({ user_id: userId });
      return count;
    } catch (error) {
      throw error;
    }
  }

  // Lấy sản phẩm xem gần đây với thông tin chi tiết
  async getRecentViewsWithDetails(userId, limit = 10) {
    try {
      const recentViews = await RecentViews.find({ user_id: userId })
        .populate({
          path: 'product_id',
          select: 'name price original_price images category_id status description rating',
          populate: {
            path: 'category_id',
            select: 'name'
          }
        })
        .sort({ viewed_at: -1 })
        .limit(limit);

      return recentViews;
    } catch (error) {
      throw error;
    }
  }

  // Lấy sản phẩm tương tự dựa trên sản phẩm đã xem
  async getSimilarProducts(userId, productId, limit = 5) {
    try {
      // Lấy danh sách sản phẩm user đã xem
      const userViews = await RecentViews.find({ 
        user_id: userId,
        product_id: { $ne: productId } // Loại trừ sản phẩm hiện tại
      })
      .populate('product_id', 'category_id')
      .sort({ viewed_at: -1 })
      .limit(10);

      if (userViews.length === 0) {
        return [];
      }

      // Lấy category_id của các sản phẩm đã xem
      const categoryIds = userViews.map(view => view.product_id.category_id);
      
      // Tìm sản phẩm cùng category
      const similarProducts = await Product.find({
        category_id: { $in: categoryIds },
        _id: { $ne: productId },
        status: 'active'
      })
      .limit(limit);

      return similarProducts;
    } catch (error) {
      throw error;
    }
  }
}

export default RecentViewsService; 