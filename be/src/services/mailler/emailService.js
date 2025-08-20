import { sendMail } from './mailler.js';
import { forgotPasswordTemplate, orderSuccessTemplate, welcomeTemplate } from './mailTemplates.js';

export const sendForgotPasswordEmail = async ({ to, name, resetLink }) => {
  try {
    console.log(`[sendForgotPasswordEmail] Sending password reset email to: ${to}`);
    const result = await sendMail({
      to,
      subject: 'Đặt lại mật khẩu tài khoản của bạn',
      html: forgotPasswordTemplate({ name, resetLink }),
      text: `Xin chào ${name || 'bạn'}, vui lòng truy cập liên kết sau để đặt lại mật khẩu: ${resetLink}`
    });
    console.log(`[sendForgotPasswordEmail] Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error(`[sendForgotPasswordEmail] Failed to send email to ${to}:`, error);
    throw new Error(`Không thể gửi email đặt lại mật khẩu: ${error.message}`);
  }
};

export const sendOrderSuccessEmail = async ({ to, name, orderId, orderDetailLink }) => {
  try {
    console.log(`[sendOrderSuccessEmail] Sending order confirmation email to: ${to}`);
    const result = await sendMail({
      to,
      subject: `Xác nhận đơn hàng #${orderId}`,
      html: orderSuccessTemplate({ name, orderId, orderDetailLink }),
      text: `Đơn hàng #${orderId} của bạn đã đặt thành công. Xem chi tiết tại: ${orderDetailLink}`
    });
    console.log(`[sendOrderSuccessEmail] Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error(`[sendOrderSuccessEmail] Failed to send email to ${to}:`, error);
    throw new Error(`Không thể gửi email xác nhận đơn hàng: ${error.message}`);
  }
};

export const sendWelcomeEmail = async ({ to, name, loginLink }) => {
  return sendMail({
    to,
    subject: 'Chào mừng bạn đến với Tạp Hoá Số!',
    html: welcomeTemplate({ name, loginLink }),
    text: `Chào mừng ${name || 'bạn'} đến với Tạp Hoá Số! Tài khoản của bạn đã được tạo thành công. Hãy đăng nhập để bắt đầu mua sắm: ${loginLink}`
  });
};
