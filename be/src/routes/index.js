import express from 'express';

import userRouter from './user.route.js';

import productRouter from './product.route.js';
import categoryRouter from './category.route.js';
import orderRouter from './order.route.js';
import addressRouter from './address.route.js';

import reviewRouter from './review.route.js';
import commentRouter from './comment.route.js';
import favoriteRouter from './favorite.route.js';

import cartRouter from './cart.route.js';

import voucherRouter from './voucher.route.js';
import authRouter from './auth.route.js';
import paymentRouter from './payment.route.js';

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
router.use('/favorites', authMiddleware, favoriteRouter);

// Protected routes
router.use('/products', productRouter);
router.use('/categories', authMiddleware,categoryRouter);

router.use('/carts', authMiddleware, cartRouter);

router.use('/vouchers', authMiddleware, voucherRouter);

// Payment routes
router.use('/payment', paymentRouter);

export default router;
