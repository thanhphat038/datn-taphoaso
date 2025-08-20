import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Kiểm tra cấu hình SMTP
const validateSMTPConfig = () => {
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required SMTP environment variables: ${missingVars.join(', ')}`);
  }
  
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Với port 587 thì secure là false (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };
};

let transporter = null;

try {
  const smtpConfig = validateSMTPConfig();
  transporter = nodemailer.createTransport(smtpConfig);
  console.log('✅ SMTP transporter created successfully');
} catch (error) {
  console.error('❌ SMTP configuration error:', error.message);
  console.log('📧 Email functionality will be disabled. Please check your .env file.');
}

export const sendMail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured. Please check your email configuration in .env file.');
  }

  const mailOptions = {
    from: `"${process.env.MAILER_NAME || 'TapHoaSo'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Error sending email:', err);
    
    // Cung cấp thông báo lỗi chi tiết hơn
    if (err.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your SMTP username and password.');
    } else if (err.code === 'ECONNECTION') {
      throw new Error('Cannot connect to SMTP server. Please check your SMTP host and port.');
    } else if (err.code === 'ETIMEDOUT') {
      throw new Error('SMTP connection timeout. Please check your network connection.');
    } else {
      throw new Error(`Email sending failed: ${err.message}`);
    }
  }
};
