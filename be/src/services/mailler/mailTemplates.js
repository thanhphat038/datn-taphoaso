export const forgotPasswordTemplate = ({ name, resetLink }) => `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt Lại Mật Khẩu</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #1a73e8;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 150px;
        height: auto;
      }
      .content {
        padding: 30px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #1a73e8;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 20px 0;
      }
      .footer {
        background-color: #f8f8f8;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #666666;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
        }
        .content {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="/public/logo.png" alt="Logo">
      </div>
      <div class="content">
        <h2>Xin chào ${name || 'Quý khách'},</h2>
        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại mật khẩu:</p>
        <a href="${resetLink}" class="button">Đặt Lại Mật Khẩu</a>
        <p>Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
        <p>Trân trọng,</p>
        <p><strong>Đội ngũ Hỗ trợ Khách hàng</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Tạp Hoá Số. Mọi quyền được bảo lưu.</p>
        <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email: <a href="mailto:taphoaso0@gmail.com">taphoaso0@gmail.com</a></p>
      </div>
    </div>
  </body>
  </html>
`;

export const orderSuccessTemplate = ({ name, orderId, orderDetailLink }) => `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đơn Hàng Thành Công</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #1a73e8;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 150px;
        height: auto;
      }
      .content {
        padding: 30px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #1a73e8;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 20px 0;
      }
      .footer {
        background-color: #f8f8f8;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #666666;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
        }
        .content {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="/public/logo.png" alt="Logo">
      </div>
      <div class="content">
        <h2>Xin chào ${name || 'Quý khách'},</h2>
        <p>Chúng tôi xin thông báo rằng đơn hàng <strong>#${orderId}</strong> của bạn đã được đặt thành công!</p>
        <p>Bạn có thể xem chi tiết đơn hàng bằng cách nhấn vào nút bên dưới:</p>
        <a href="${orderDetailLink}" class="button">Xem Chi Tiết Đơn Hàng</a>
        <p>Cảm ơn bạn đã tin tưởng và mua sắm cùng chúng tôi. Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
        <p>Trân trọng,</p>
        <p><strong>Đội ngũ Bán hàng</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Tạp Hoá Số. Mọi quyền được bảo lưu.</p>
        <p>Nếu cần hỗ trợ, vui lòng liên hệ qua email: <a href="mailto:taphoaso0@gmail.com">taphoaso0@gmail.com</a></p>
      </div>
    </div>
  </body>
  </html>
`;