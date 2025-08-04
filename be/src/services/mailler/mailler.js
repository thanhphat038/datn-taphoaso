import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Với port 587 thì secure là false (STARTTLS)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendMail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `"${process.env.MAILER_NAME}" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};
