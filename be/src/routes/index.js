import express from 'express';

import userRouter from './user.route.js';

import productRouter from './product.route.js';
import blogRouter from './blog.route.js';
import blogCategoryRouter from './blogCategory.route.js';

import categoryRouter from './category.route.js';
import orderRouter from './order.route.js';
import addressRouter from './address.route.js';

import reviewRouter from './review.route.js';
import commentRouter from './comment.route.js';
import replyRouter from './reply.route.js';
import favoriteRouter from './favorite.route.js';

import cartRouter from './cart.route.js';

import voucherRouter from './voucher.route.js';
import variantRouter from './variant.route.js';
import authRouter from './auth.route.js';

import uploadRouter from './upload.route.js';

import paymentRouter from './payment.route.js';
import shippingRouter from './shipping.route.js';
import productVariantRouter from './productVariant.route.js';
import recentViewsRouter from './recentViews.route.js';


import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRouter);

// User routes
router.use('/users',authMiddleware, userRouter);
router.use('/orders', authMiddleware, orderRouter);
router.use('/addresses', authMiddleware, addressRouter);

router.use('/reviews', authMiddleware,reviewRouter);
router.use('/comments', authMiddleware, commentRouter);
router.use('/replies', authMiddleware, replyRouter);
router.use('/favorites', authMiddleware, favoriteRouter);

// Protected routes
router.use('/products', productRouter);

router.use('/blogs', blogRouter);

router.use('/blogs_categories', blogCategoryRouter);

router.use('/categories', categoryRouter);

router.use('/carts', authMiddleware, cartRouter);

router.use('/payment', paymentRouter);

router.use('/vouchers', authMiddleware, voucherRouter);

router.use('/variants', variantRouter);

router.use('/upload', uploadRouter);

// Shipping routes
router.use('/shipping', shippingRouter);

// Product Variant routes
router.use('/product-variants', productVariantRouter);

// Recent Views routes
router.use('/recent-views', recentViewsRouter);

export default router;

