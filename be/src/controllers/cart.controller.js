import CartService from '../services/cart.service.js';
const cartService = new CartService();

export const getCart = async (req, res, next) => {
  try {
    const items = await cartService.getCart(req.user.id);
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

export const getCartTotal = async (req, res, next) => {
  try {
    const total = await cartService.calculateCartTotal(req.user.id);
    res.json({ success: true, total });
  } catch (err) { next(err); }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const { product_id, qty } = req.body;
    if (!product_id) throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing product_id');
    const item = await cartService.addToCart(req.user.id, product_id, qty);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;
    if (!productId) throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing productId');
    const item = await cartService.updateCartItem(req.user.id, productId, qty);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const removeItemFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing productId');
    const item = await cartService.removeFromCart(req.user.id, productId);
    res.json({ success: true, message: 'Removed', data: item });
  } catch (err) { next(err); }
};

export const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { next(err); }
};