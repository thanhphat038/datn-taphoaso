#!/usr/bin/env node

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔍 Checking Email Configuration...\n');

// Check required environment variables
const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = [];

console.log('📋 Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('PASS') ? '***' + value.slice(-4) : value}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log(`\n❌ Missing required variables: ${missingVars.join(', ')}`);
  console.log('📖 Please check EMAIL_SETUP_README.md for configuration instructions');
  process.exit(1);
}

console.log('\n🔧 Testing SMTP Connection...');

// Test SMTP connection
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

try {
  // Verify connection configuration
  await transporter.verify();
  console.log('✅ SMTP connection successful!');
  
  // Test sending a test email
  console.log('\n📧 Testing email sending...');
  const testEmail = {
    from: `"${process.env.MAILER_NAME || 'TapHoaSo'}" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // Send to self for testing
    subject: 'Test Email - TapHoaSo Email Configuration',
    text: 'This is a test email to verify your email configuration is working correctly.',
    html: `
      <h2>Test Email - TapHoaSo</h2>
      <p>This is a test email to verify your email configuration is working correctly.</p>
      <p><strong>Configuration:</strong></p>
      <ul>
        <li>SMTP Host: ${process.env.SMTP_HOST}</li>
        <li>SMTP Port: ${process.env.SMTP_PORT}</li>
        <li>SMTP User: ${process.env.SMTP_USER}</li>
        <li>Mailer Name: ${process.env.MAILER_NAME || 'TapHoaSo'}</li>
      </ul>
      <p>If you receive this email, your email configuration is working correctly!</p>
    `
  };
  
  const info = await transporter.sendMail(testEmail);
  console.log('✅ Test email sent successfully!');
  console.log(`📧 Message ID: ${info.messageId}`);
  console.log(`📬 Check your inbox: ${process.env.SMTP_USER}`);
  
} catch (error) {
  console.error('❌ SMTP connection failed:', error.message);
  
  if (error.code === 'EAUTH') {
    console.log('\n💡 Solution: Check your SMTP username and password');
    console.log('   - Ensure you have 2-factor authentication enabled');
    console.log('   - Use App Password instead of your main password');
  } else if (error.code === 'ECONNECTION') {
    console.log('\n💡 Solution: Check your SMTP host and port');
    console.log('   - Verify the SMTP server is accessible');
    console.log('   - Check firewall/antivirus settings');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('\n💡 Solution: Network connection issue');
    console.log('   - Check your internet connection');
    console.log('   - Try increasing timeout settings');
  }
  
  process.exit(1);
}

console.log('\n🎉 Email configuration is working correctly!');
console.log('🚀 You can now use the forgot password functionality.');
