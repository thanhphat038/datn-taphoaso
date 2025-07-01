import { sendOrderSuccessEmail } from '../services/mailler/emailService.js';

const run = async () => {

console.log({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.EMAIL,
  pass: process.env.SMTP_PASSWORD
});

await sendOrderSuccessEmail({
    to: 'khactri03@gmail.com',
    name: 'Nguyễn Văn A',
    orderId: 'abc123',
    orderDetailLink: 'https://example.com/reset-password?token=abc123',
  });
};

run();
