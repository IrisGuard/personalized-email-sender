// Environment configuration and validation
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '10000', 10),
  nodeEnv: process.env.NODE_ENV,
  gmail: {
    user: process.env.GMAIL_USER,
    appPassword: process.env.GMAIL_APP_PASSWORD,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
  company: {
    name: process.env.COMPANY_NAME || 'AKROGONOS INTERNATIONAL GROUP',
    replyTo: process.env.COMPANY_REPLY_TO || process.env.GMAIL_USER,
    senderEmail: process.env.GMAIL_USER || 'koufomataxondriki@gmail.com',
  }
};

export const validateEnvironment = () => {
  console.log('🔧 AKROGONOS EMAIL SERVER STARTING...');
  console.log(`📍 PORT: ${config.port}`);
  console.log(`🌍 NODE_ENV: ${config.nodeEnv}`);
  console.log(`📧 GMAIL_USER: ${config.gmail.user || 'NOT CONFIGURED'}`);
  console.log(`🔑 GMAIL_APP_PASSWORD: ${config.gmail.appPassword ? 'CONFIGURED ✅' : 'MISSING ❌'}`);
  console.log(`📨 SENDGRID_API_KEY: ${config.sendgrid.apiKey ? 'CONFIGURED ✅' : 'MISSING ❌'}`);
  console.log(`🏢 COMPANY_NAME: ${config.company.name}`);
  console.log(`📮 COMPANY_REPLY_TO: ${config.company.replyTo}`);
  console.log(`👤 SENDER_EMAIL: ${config.company.senderEmail}`);

  // Validate critical environment variables - prefer SendGrid over Gmail
  if (!config.sendgrid.apiKey && (!config.gmail.user || !config.gmail.appPassword)) {
    console.error('❌ CRITICAL: Email service credentials missing!');
    console.error('Please set SENDGRID_API_KEY (preferred) or GMAIL_USER and GMAIL_APP_PASSWORD in Render environment variables');
  }

  if (config.sendgrid.apiKey) {
    console.log('✅ Using SendGrid for email delivery (recommended)');
  } else if (config.gmail.user && config.gmail.appPassword) {
    console.log('⚠️ Using Gmail SMTP (fallback mode)');
  }
};