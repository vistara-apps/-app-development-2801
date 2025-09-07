import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create email transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  return nodemailer.createTransporter(config);
};

// Email templates
const emailTemplates = {
  'email-verification': {
    subject: 'Welcome to SampleShield Pro - Verify Your Email',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ SampleShield Pro</h1>
            <p>Secure Synthetic Data Generation</p>
          </div>
          <div class="content">
            <h2>Welcome, ${data.firstName}!</h2>
            <p>Thank you for joining SampleShield Pro. To complete your registration and start generating secure synthetic data, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${data.verificationUrl}</p>
            
            <p>This verification link will expire in 24 hours for security reasons.</p>
            
            <h3>What's Next?</h3>
            <ul>
              <li>✅ Verify your email (you're doing this now!)</li>
              <li>🎯 Explore our data generation templates</li>
              <li>🚀 Create your first synthetic dataset</li>
              <li>🔒 Ensure compliance with privacy regulations</li>
            </ul>
            
            <p>If you didn't create an account with SampleShield Pro, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 SampleShield Pro. All rights reserved.</p>
            <p>Need help? Contact us at support@sampleshield.pro</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  'password-reset': {
    subject: 'SampleShield Pro - Password Reset Request',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ SampleShield Pro</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello, ${data.firstName}</h2>
            <p>We received a request to reset your password for your SampleShield Pro account.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
            </div>
            
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #e74c3c;">${data.resetUrl}</p>
            
            <p><strong>This reset link will expire in 1 hour</strong> for security reasons.</p>
            
            <h3>Security Tips:</h3>
            <ul>
              <li>🔐 Use a strong, unique password</li>
              <li>🔄 Don't reuse passwords from other accounts</li>
              <li>📱 Consider enabling two-factor authentication</li>
              <li>🚫 Never share your password with anyone</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 SampleShield Pro. All rights reserved.</p>
            <p>Need help? Contact us at support@sampleshield.pro</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  'job-completed': {
    subject: 'Your Data Generation Job is Complete',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Completed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .stats { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .stat-item { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ SampleShield Pro</h1>
            <p>Job Completion Notification</p>
          </div>
          <div class="content">
            <h2>Great news, ${data.firstName}! 🎉</h2>
            <p>Your data generation job "<strong>${data.jobName}</strong>" has been completed successfully.</p>
            
            <div class="stats">
              <h3>📊 Job Summary</h3>
              <div class="stat-item">
                <span>Records Generated:</span>
                <strong>${data.recordsGenerated?.toLocaleString() || 'N/A'}</strong>
              </div>
              <div class="stat-item">
                <span>Processing Time:</span>
                <strong>${data.processingTime || 'N/A'}</strong>
              </div>
              <div class="stat-item">
                <span>Quality Score:</span>
                <strong>${data.qualityScore || 'N/A'}%</strong>
              </div>
              <div class="stat-item">
                <span>Privacy Score:</span>
                <strong>${data.privacyScore || 'N/A'}%</strong>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.downloadUrl}" class="button">Download Results</a>
            </div>
            
            <p>Your generated dataset is ready for download and will be available for ${data.retentionDays || 30} days.</p>
            
            <h3>Next Steps:</h3>
            <ul>
              <li>📥 Download your synthetic dataset</li>
              <li>🔍 Review the data quality metrics</li>
              <li>🚀 Use the data in your applications</li>
              <li>📋 Create additional datasets if needed</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 SampleShield Pro. All rights reserved.</p>
            <p>Need help? Contact us at support@sampleshield.pro</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  'subscription-welcome': {
    subject: 'Welcome to SampleShield Pro Premium!',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .feature-item { margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ SampleShield Pro</h1>
            <p>Welcome to Premium!</p>
          </div>
          <div class="content">
            <h2>Congratulations, ${data.firstName}! 🎉</h2>
            <p>Thank you for upgrading to <strong>${data.planName}</strong>. You now have access to advanced synthetic data generation capabilities.</p>
            
            <div class="features">
              <h3>🚀 Your New Features</h3>
              <div class="feature-item">✅ Generate up to ${data.dataLimit} of synthetic data per month</div>
              <div class="feature-item">✅ Advanced anonymization techniques</div>
              <div class="feature-item">✅ Priority processing for your jobs</div>
              <div class="feature-item">✅ API access for automated workflows</div>
              <div class="feature-item">✅ Premium support</div>
              <div class="feature-item">✅ Extended data retention (${data.retentionDays} days)</div>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.dashboardUrl}" class="button">Access Your Dashboard</a>
            </div>
            
            <p>Your subscription will renew automatically on ${data.renewalDate}. You can manage your subscription anytime from your account settings.</p>
            
            <h3>Getting Started:</h3>
            <ul>
              <li>🎯 Explore advanced data generation templates</li>
              <li>🔧 Set up API integration</li>
              <li>📊 Create larger, more complex datasets</li>
              <li>🔒 Use enterprise-grade anonymization</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 SampleShield Pro. All rights reserved.</p>
            <p>Questions? Contact our premium support at premium@sampleshield.pro</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Send email function
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Get template if specified
    let emailContent = {
      subject: options.subject,
      html: options.html || options.text
    };
    
    if (options.template && emailTemplates[options.template]) {
      const template = emailTemplates[options.template];
      emailContent = {
        subject: options.subject || template.subject,
        html: template.html(options.data || {})
      };
    }
    
    const mailOptions = {
      from: `"SampleShield Pro" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: options.text // Fallback text version
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent successfully to ${options.to}`, {
      messageId: info.messageId,
      template: options.template
    });
    
    return info;
    
  } catch (error) {
    logger.error('Failed to send email:', {
      error: error.message,
      to: options.to,
      template: options.template
    });
    throw error;
  }
};

// Send bulk emails
export const sendBulkEmails = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ success: true, email: email.to, messageId: result.messageId });
    } catch (error) {
      results.push({ success: false, email: email.to, error: error.message });
    }
  }
  
  return results;
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error.message);
    return false;
  }
};

export default { sendEmail, sendBulkEmails, verifyEmailConfig };
