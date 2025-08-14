import Banner from '../models/banner.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

// Create new banner
export const createBanner = async (bannerData) => {
    try {
        const banner = new Banner(bannerData);
        await banner.save();
        return banner;
    } catch (error) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Failed to create banner');
    }
};

// Get all banners with pagination and filtering
export const getAllBanners = async (options = {}) => {
    try {
        const { page = 1, limit = 10, sort = 'display_order', order = 'asc', type, is_active } = options;
        
        const query = {};
        if (type) query.type = type;
        if (is_active !== undefined) query.is_active = is_active;
        
        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;
        
        const skip = (page - 1) * limit;
        
        const banners = await Banner.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Banner.countDocuments(query);
        
        return {
            banners,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Failed to get banners');
    }
};

// Get banner by id
export const getBannerById = async (id) => {
    try {
        const banner = await Banner.findById(id);
        if (!banner) {
            throw new AppError(ERROR_CODES.NOT_FOUND, 'Banner not found');
        }
        return banner;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Failed to get banner');
    }
};

// Update banner
export const updateBanner = async (id, updateData) => {
    try {
        const banner = await Banner.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!banner) {
            throw new AppError(ERROR_CODES.NOT_FOUND, 'Banner not found');
        }
        
        return banner;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Failed to update banner');
    }
};

// Delete banner
export const deleteBanner = async (id) => {
    try {
        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) {
            throw new AppError(ERROR_CODES.NOT_FOUND, 'Banner not found');
        }
        return banner;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Failed to delete banner');
    }
};

// Toggle banner status
export const toggleBannerStatus = async (id) => {
    try {
        const banner = await Banner.findById(id);
        if (!banner) {
            throw new AppError(ERROR_CODES.NOT_FOUND, 'Banner not found');
        }
        
        banner.is_active = !banner.is_active;
        await banner.save();
        
        return banner;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Failed to toggle banner status');
    }
};

// Get active banners for frontend
export const getActiveBanners = async (type = 'main') => {
    try {
        const now = new Date();
        const banners = await Banner.find({
            is_active: true,
            type: type,
            $or: [
                { start_date: { $exists: false } },
                { start_date: { $lte: now } }
            ],
            $or: [
                { end_date: { $exists: false } },
                { end_date: { $gte: now } }
            ]
        }).sort({ display_order: 1, created_at: -1 });
        
        return banners;
    } catch (error) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Failed to get active banners');
    }
};
