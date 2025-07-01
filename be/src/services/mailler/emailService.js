import { sendMail } from './mailler.js';
import { forgotPasswordTemplate, orderSuccessTemplate } from './mailTemplates.js';

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
