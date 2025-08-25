export const forgotPasswordTemplate = ({ name, resetLink }) => `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt Lại Mật Khẩu - Tạp Hoá Số</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #333;
        line-height: 1.6;
        padding: 20px 0;
      }
      
      .container {
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        position: relative;
      }
      
      .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, #1a73e8, #34a853, #fbbc04, #ea4335);
      }
      
      .header {
        background: linear-gradient(135deg, #ea4335 0%, #d93025 100%);
        padding: 40px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      .header-content {
        position: relative;
        z-index: 2;
      }
      
      .security-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 40px;
        color: white;
        backdrop-filter: blur(10px);
      }
      
      .header h1 {
        color: white;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      
      .header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        font-weight: 300;
      }
      
      .content {
        padding: 40px 30px;
        background: #ffffff;
      }
      
      .greeting {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
        border-left: 5px solid #ea4335;
      }
      
      .greeting h2 {
        color: #ea4335;
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      
      .greeting p {
        color: #666;
        font-size: 16px;
        margin: 0;
        line-height: 1.6;
      }
      
      .action-section {
        text-align: center;
        margin: 35px 0;
        padding: 30px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
      }
      
      .cta-button {
        display: inline-block;
        padding: 18px 36px;
        background: linear-gradient(135deg, #ea4335 0%, #d93025 100%);
        color: white !important;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 700;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 20px 0;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(234, 67, 53, 0.3);
        position: relative;
        overflow: hidden;
      }
      
      .cta-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .cta-button:hover::before {
        left: 100%;
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(234, 67, 53, 0.4);
      }
      
      .security-notice {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 12px;
        padding: 20px;
        margin: 25px 0;
        text-align: center;
      }
      
      .security-notice h4 {
        color: #856404;
        font-size: 18px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      .security-notice p {
        color: #856404;
        font-size: 14px;
        margin: 8px 0;
      }
      
      .company-info {
        margin-top: 20px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e9ecef;
      }
      
      .company-info h4 {
        color: #ea4335;
        font-size: 18px;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .company-info p {
        color: #666;
        font-size: 14px;
        margin: 8px 0;
        text-align: center;
      }
      
      .footer {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e9ecef;
      }
      
      .footer p {
        color: #666;
        font-size: 14px;
        margin: 8px 0;
        line-height: 1.5;
      }
      
      .footer a {
        color: #ea4335;
        text-decoration: none;
        font-weight: 600;
      }
      
      .footer a:hover {
        text-decoration: underline;
      }
      
      @media only screen and (max-width: 650px) {
        body { padding: 10px 0; }
        .container { margin: 0 10px; border-radius: 15px; }
        .header { padding: 30px 20px; }
        .content { padding: 25px 20px; }
        .cta-button { padding: 16px 28px; font-size: 14px; }
      }
      
      @media only screen and (max-width: 480px) {
        .header h1 { font-size: 24px; }
        .greeting h2 { font-size: 20px; }
        .security-notice h4 { font-size: 16px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <div class="security-icon">🔐</div>
          <h1>Đặt Lại Mật Khẩu</h1>
          <p>Bảo mật tài khoản của bạn</p>
        </div>
      </div>
      
      <div class="content">
        <div class="greeting">
          <h2>Xin chào ${name || 'Quý khách'}!</h2>
          <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        </div>
        
        <div class="action-section">
          <p style="margin-bottom: 20px; color: #666; font-size: 16px;">
            Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại mật khẩu:
          </p>
          <a href="${resetLink}" class="cta-button">
            🔑 Đặt Lại Mật Khẩu
          </a>
        </div>
        
        <div class="security-notice">
          <h4>⚠️ Lưu Ý Bảo Mật</h4>
          <p>Liên kết này chỉ có hiệu lực trong 24 giờ</p>
          <p>Không chia sẻ liên kết này với bất kỳ ai</p>
        </div>
        
        <div class="company-info">
          <h4>💬 Hỗ Trợ Khách Hàng</h4>
          <p>Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email</p>
          <p>Hoặc liên hệ với chúng tôi để được hỗ trợ</p>
          <p><strong>Email:</strong> <a href="mailto:taphoaso0@gmail.com">taphoaso0@gmail.com</a></p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Tạp Hoá Số</strong> - Nơi mua sắm tin cậy của mọi gia đình</p>
        <p>&copy; ${new Date().getFullYear()} Tạp Hoá Số. Mọi quyền được bảo lưu.</p>
        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
      </div>
    </div>
  </body>
  </html>
`;

export const orderSuccessTemplate = ({ name, orderId, orderDetailLink, orderItems, totalAmount }) => `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đơn Hàng Thành Công - Tạp Hoá Số</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #333;
        line-height: 1.6;
        padding: 20px 0;
      }
      
      .container {
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        position: relative;
      }
      
      .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, #1a73e8, #34a853, #fbbc04, #ea4335);
      }
      
      .header {
        background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
        padding: 40px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      .header-content {
        position: relative;
        z-index: 2;
      }
      
      .success-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 40px;
        color: white;
        backdrop-filter: blur(10px);
      }
      
      .header h1 {
        color: white;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      
      .header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        font-weight: 300;
      }
      
      .content {
        padding: 40px 30px;
        background: #ffffff;
      }
      
      .greeting {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
        border-left: 5px solid #1a73e8;
      }
      
      .greeting h2 {
        color: #1a73e8;
        font-size: 24px;
        margin-bottom: 10px;
        font-weight: 600;
      }
      
      .greeting p {
        color: #666;
        font-size: 16px;
        margin: 0;
      }
      
      .order-info {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 25px;
        margin: 30px 0;
        border: 1px solid #e9ecef;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      }
      
      .order-info h3 {
        color: #333;
        font-size: 20px;
        text-align: center;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      
      .order-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 20px 0;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      
      .order-table th {
        background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
        color: white;
        padding: 18px 12px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .order-table th:first-child { border-radius: 12px 0 0 0; }
      .order-table th:last-child { border-radius: 0 12px 0 0; }
      
      .order-table td {
        padding: 16px 12px;
        border-bottom: 1px solid #f1f3f4;
        font-size: 14px;
        transition: background-color 0.3s ease;
      }
      
      .order-table tr:hover td {
        background-color: #f8f9fa;
      }
      
      .order-table tr:last-child td {
        border-bottom: none;
      }
      
      .product-name {
        font-weight: 600;
        color: #333;
        max-width: 200px;
      }
      
      .quantity {
        text-align: center;
        color: #666;
        font-weight: 500;
      }
      
      .price {
        text-align: right;
        color: #666;
        font-weight: 500;
      }
      
      .total-price {
        text-align: right;
        color: #1a73e8;
        font-weight: 700;
        font-size: 15px;
      }
      
      .total-section {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
        text-align: right;
        border: 2px solid #1a73e8;
      }
      
      .total-amount {
        font-size: 24px;
        font-weight: 800;
        color: #1a73e8;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      .action-section {
        text-align: center;
        margin: 35px 0;
        padding: 30px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
      }
      
      .cta-button {
        display: inline-block;
        padding: 18px 36px;
        background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
        color: white !important;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 700;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 20px 0;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(26, 115, 232, 0.3);
        position: relative;
        overflow: hidden;
      }
      
      .cta-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .cta-button:hover::before {
        left: 100%;
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(26, 115, 232, 0.4);
      }
      
      .footer {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e9ecef;
      }
      
      .footer p {
        color: #666;
        font-size: 14px;
        margin: 8px 0;
        line-height: 1.5;
      }
      
      .footer a {
        color: #1a73e8;
        text-decoration: none;
        font-weight: 600;
      }
      
      .footer a:hover {
        text-decoration: underline;
      }
      
      .company-info {
        margin-top: 20px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e9ecef;
      }
      
      .company-info h4 {
        color: #1a73e8;
        font-size: 18px;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .company-info p {
        color: #666;
        font-size: 14px;
        margin: 8px 0;
        text-align: center;
      }
      
      @media only screen and (max-width: 650px) {
        body { padding: 10px 0; }
        .container { margin: 0 10px; border-radius: 15px; }
        .header { padding: 30px 20px; }
        .content { padding: 25px 20px; }
        .order-table { font-size: 12px; }
        .order-table th, .order-table td { padding: 12px 8px; }
        .cta-button { padding: 16px 28px; font-size: 14px; }
        .total-amount { font-size: 20px; }
      }
      
      @media only screen and (max-width: 480px) {
        .header h1 { font-size: 24px; }
        .greeting h2 { font-size: 20px; }
        .order-info h3 { font-size: 18px; }
        .order-table { font-size: 11px; }
        .order-table th, .order-table td { padding: 10px 6px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <div class="success-icon">🎉</div>
          <h1>Đơn Hàng Thành Công!</h1>
          <p>Cảm ơn bạn đã tin tưởng Tạp Hoá Số</p>
        </div>
      </div>
      
      <div class="content">
        <div class="greeting">
          <h2>Xin chào ${name || 'Quý khách'}!</h2>
          <p>Đơn hàng <strong>#${orderId}</strong> của bạn đã được đặt thành công và đang được xử lý.</p>
        </div>
        
        ${orderItems && orderItems.length > 0 ? `
        <div class="order-info">
          <h3>📋 Chi Tiết Đơn Hàng</h3>
          <table class="order-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th style="text-align: center;">Số lượng</th>
                <th style="text-align: right;">Đơn giá</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map(item => `
                <tr>
                  <td class="product-name">
                    <strong>${item.product_name || 'Sản phẩm'}</strong>
                  </td>
                  <td class="quantity">
                    ${item.qty || item.quantity || 1}
                  </td>
                  <td class="price">
                    ${(item.price || 0).toLocaleString('vi-VN')} ₫
                  </td>
                  <td class="total-price">
                    ${((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-amount">
              Tổng tiền: ${totalAmount ? totalAmount.toLocaleString('vi-VN') : '0'} ₫
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="action-section">
          <p style="margin-bottom: 20px; color: #666; font-size: 16px;">
            Bạn có thể theo dõi trạng thái đơn hàng và xem chi tiết bằng cách nhấn vào nút bên dưới:
          </p>
          <a href="${orderDetailLink}" class="cta-button">
            🛍️ Xem Chi Tiết Đơn Hàng
          </a>
        </div>
        
        <div class="company-info">
          <h4>💬 Hỗ Trợ Khách Hàng</h4>
          <p>Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi</p>
          <p><strong>Email:</strong> <a href="mailto:taphoaso0@gmail.com">taphoaso0@gmail.com</a></p>
          <p><strong>Hotline:</strong> 0123 456 789</p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Tạp Hoá Số</strong> - Nơi mua sắm tin cậy của mọi gia đình</p>
        <p>&copy; ${new Date().getFullYear()} Tạp Hoá Số. Mọi quyền được bảo lưu.</p>
        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
      </div>
    </div>
  </body>
  </html>
`;

export const welcomeTemplate = ({ data, loginLink }) => `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào Mừng Bạn - Tạp Hoá Số</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #333;
        line-height: 1.6;
        padding: 20px 0;
      }
      
      .container {
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        position: relative;
      }
      
      .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, #1a73e8, #34a853, #fbbc04, #ea4335);
      }
      
      .header {
        background: linear-gradient(135deg, #34a853 0%, #0f9d58 100%);
        padding: 40px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      .header-content {
        position: relative;
        z-index: 2;
      }
      
      .welcome-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 40px;
        color: white;
        backdrop-filter: blur(10px);
      }
      
      .header h1 {
        color: white;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      
      .header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        font-weight: 300;
      }
      
      .content {
        padding: 40px 30px;
        background: #ffffff;
      }
      
      .greeting {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
        border-left: 5px solid #34a853;
      }
      
      .greeting h2 {
        color: #34a853;
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      
      .greeting p {
        color: #666;
        font-size: 16px;
        margin: 0;
        line-height: 1.6;
      }
      
      .account-info {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 25px;
        margin: 25px 0;
        border: 1px solid #e9ecef;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      }
      
      .account-info h3 {
        color: #333;
        font-size: 20px;
        text-align: center;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      
      .info-item {
        background: white;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #e9ecef;
        text-align: center;
      }
      
      .info-label {
        color: #666;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 5px;
      }
      
      .info-value {
        color: #333;
        font-size: 16px;
        font-weight: 600;
        word-break: break-word;
      }
      
      .features-list {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
        padding: 25px;
        margin: 25px 0;
        border-left: 5px solid #34a853;
      }
      
      .features-list h3 {
        color: #34a853;
        font-size: 20px;
        text-align: center;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
      }
      
      .feature-item {
        background: white;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #e9ecef;
        text-align: center;
        transition: transform 0.3s ease;
      }
      
      .feature-item:hover {
        transform: translateY(-2px);
      }
      
      .feature-icon {
        font-size: 24px;
        margin-bottom: 10px;
      }
      
      .feature-text {
        color: #666;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .action-section {
        text-align: center;
        margin: 35px 0;
        padding: 30px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
      }
      
      .cta-button {
        display: inline-block;
        padding: 18px 36px;
        background: linear-gradient(135deg, #34a853 0%, #0f9d58 100%);
        color: white !important;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 700;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 20px 0;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(52, 168, 83, 0.3);
        position: relative;
        overflow: hidden;
      }
      
      .cta-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .cta-button:hover::before {
        left: 100%;
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(52, 168, 83, 0.4);
      }
      
      .company-info {
        margin-top: 20px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e9ecef;
      }
      
      .company-info h4 {
        color: #34a853;
        font-size: 18px;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .company-info p {
        color: #666;
        font-size: 14px;
        margin: 8px 0;
        text-align: center;
      }
      
      .footer {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e9ecef;
      }
      
      .footer p {
        color: #666;
        font-size: 14px;
        margin: 8px 0;
        line-height: 1.5;
      }
      
      .footer a {
        color: #34a853;
        text-decoration: none;
        font-weight: 600;
      }
      
      .footer a:hover {
        text-decoration: underline;
      }
      
      @media only screen and (max-width: 650px) {
        body { padding: 10px 0; }
        .container { margin: 0 10px; border-radius: 15px; }
        .header { padding: 30px 20px; }
        .content { padding: 25px 20px; }
        .cta-button { padding: 16px 28px; font-size: 14px; }
        .info-grid { grid-template-columns: 1fr; }
        .features-grid { grid-template-columns: 1fr; }
      }
      
      @media only screen and (max-width: 480px) {
        .header h1 { font-size: 24px; }
        .greeting h2 { font-size: 20px; }
        .account-info h3 { font-size: 18px; }
        .features-list h3 { font-size: 18px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-content">
          <div class="welcome-icon">🎉</div>
          <h1>Chào Mừng Bạn!</h1>
          <p>Trở thành thành viên của Tạp Hoá Số</p>
        </div>
      </div>
      
      <div class="content">
        <div class="greeting">
          <h2>Xin chào ${data.full_name || 'bạn'}!</h2>
          <p>Chúng tôi rất vui mừng chào đón bạn trở thành thành viên mới của cộng đồng Tạp Hoá Số!</p>
        </div>
        
        <div class="account-info">
          <h3>🔐 Thông Tin Tài Khoản</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${data.email}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Tên đăng nhập</div>
              <div class="info-value">${data.full_name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Mật khẩu</div>
              <div class="info-value">${data.password}</div>
            </div>
          </div>
        </div>
        
        <div class="features-list">
          <h3>✨ Những Gì Bạn Có Thể Làm</h3>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🛍️</div>
              <div class="feature-text">Mua sắm sản phẩm chất lượng với giá tốt nhất</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🎁</div>
              <div class="feature-text">Nhận thông báo về chương trình khuyến mãi hấp dẫn</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⭐</div>
              <div class="feature-text">Tích lũy điểm thưởng và nhận ưu đãi đặc biệt</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📦</div>
              <div class="feature-text">Quản lý đơn hàng và theo dõi vận chuyển dễ dàng</div>
            </div>
          </div>
        </div>
        
        <div class="action-section">
          <p style="margin-bottom: 20px; color: #666; font-size: 16px;">
            Hãy bắt đầu trải nghiệm mua sắm tuyệt vời cùng chúng tôi:
          </p>
          <a href="${loginLink}" class="cta-button">
            🚀 Đăng Nhập Ngay
          </a>
        </div>
        
        <div class="company-info">
          <h4>💬 Hỗ Trợ Khách Hàng</h4>
          <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi</p>
          <p><strong>Email:</strong> <a href="mailto:taphoaso0@gmail.com">taphoaso0@gmail.com</a></p>
          <p><strong>Hotline:</strong> 0123 456 789</p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Tạp Hoá Số</strong> - Nơi mua sắm tin cậy của mọi gia đình</p>
        <p>&copy; ${new Date().getFullYear()} Tạp Hoá Số. Mọi quyền được bảo lưu.</p>
        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
      </div>
    </div>
  </body>
  </html>
`;