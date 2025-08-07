import express from 'express';
import {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    getActiveBanners
} from '../controllers/banner.controller.js';

const router = express.Router();

// Tất cả banner routes đều public - không cần authentication
router.get('/active', getActiveBanners);

// Tất cả CRUD operations đều public
router.post('/', createBanner);
router.get('/', getAllBanners);
router.get('/:id', getBannerById);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);
router.patch('/:id/toggle-status', toggleBannerStatus);

export default router;
