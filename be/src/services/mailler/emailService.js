import { sendMail } from './mailler.js';
import { forgotPasswordTemplate, orderSuccessTemplate, welcomeTemplate } from './mailTemplates.js';

export const sendForgotPasswordEmail = async ({ to, name, resetLink }) => {
  return sendMail({
    to,
    subject: 'Đặt lại mật khẩu tài khoản của bạn',
    html: forgotPasswordTemplate({ name, resetLink }),
    text: `Xin chào ${name || 'bạn'}, vui lòng truy cập liên kết sau để đặt lại mật khẩu: ${resetLink}`
  });
};

export const sendOrderSuccessEmail = async ({ to, name, orderId, orderDetailLink }) => {
  return sendMail({
    to,
    subject: `Xác nhận đơn hàng #${orderId}`,
    html: orderSuccessTemplate({ name, orderId, orderDetailLink }),
    text: `Đơn hàng #${orderId} của bạn đã đặt thành công. Xem chi tiết tại: ${orderDetailLink}`
  });
};

export const sendWelcomeEmail = async ({ to, name, loginLink }) => {
  return sendMail({
    to,
    subject: 'Chào mừng bạn đến với Tạp Hoá Số!',
    html: welcomeTemplate({ name, loginLink }),
    text: `Chào mừng ${name || 'bạn'} đến với Tạp Hoá Số! Tài khoản của bạn đã được tạo thành công. Hãy đăng nhập để bắt đầu mua sắm: ${loginLink}`
  });
};
