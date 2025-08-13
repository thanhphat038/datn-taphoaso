import * as bannerService from '../services/banner.service.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

// Create new banner
export const createBanner = async (req, res, next) => {
    try {
        const banner = await bannerService.createBanner(req.body);
        res.status(201).json({
            success: true,
            data: banner
        });
    } catch (error) {
        next(error);
    }
};

// Get all banners (admin)
export const getAllBanners = async (req, res, next) => {
    try {
        const { page, limit, sort, order, type, is_active } = req.query;
        const result = await bannerService.getAllBanners({
            page, limit, sort, order, type, is_active
        });
        
        res.json({
            success: true,
            data: result.banners,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

// Get banner by id
export const getBannerById = async (req, res, next) => {
    try {
        const banner = await bannerService.getBannerById(req.params.id);
        res.json({
            success: true,
            data: banner
        });
    } catch (error) {
        next(error);
    }
};

// Update banner
export const updateBanner = async (req, res, next) => {
    try {
        const banner = await bannerService.updateBanner(req.params.id, req.body);
        res.json({
            success: true,
            data: banner
        });
    } catch (error) {
        next(error);
    }
};

// Delete banner
export const deleteBanner = async (req, res, next) => {
    try {
        await bannerService.deleteBanner(req.params.id);
        res.json({
            success: true,
            message: 'Banner deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Toggle banner status
export const toggleBannerStatus = async (req, res, next) => {
    try {
        const banner = await bannerService.toggleBannerStatus(req.params.id);
        res.json({
            success: true,
            data: banner,
            message: `Banner ${banner.is_active ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        next(error);
    }
};

// Get active banners for frontend
export const getActiveBanners = async (req, res, next) => {
    try {
        const { type = 'main' } = req.query;
        const banners = await bannerService.getActiveBanners(type);
        res.json({
            success: true,
            data: banners
        });
    } catch (error) {
        next(error);
    }
};
