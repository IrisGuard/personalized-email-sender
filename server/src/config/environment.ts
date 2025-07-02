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
  company: {
    name: process.env.COMPANY_NAME || 'AKROGONOS INTERNATIONAL GROUP',
    replyTo: process.env.COMPANY_REPLY_TO || process.env.GMAIL_USER,
  }
};

export const validateEnvironment = () => {
  console.log('🔧 AKROGONOS EMAIL SERVER STARTING...');
  console.log(`📍 PORT: ${config.port}`);
  console.log(`🌍 NODE_ENV: ${config.nodeEnv}`);
  console.log(`📧 GMAIL_USER: ${config.gmail.user || 'NOT CONFIGURED'}`);
  console.log(`🔑 GMAIL_APP_PASSWORD: ${config.gmail.appPassword ? 'CONFIGURED ✅' : 'MISSING ❌'}`);
  console.log(`🏢 COMPANY_NAME: ${config.company.name}`);
  console.log(`📮 COMPANY_REPLY_TO: ${config.company.replyTo}`);

  // Validate critical environment variables
  if (!config.gmail.user || !config.gmail.appPassword) {
    console.error('❌ CRITICAL: Gmail credentials missing!');
    console.error('Please set GMAIL_USER and GMAIL_APP_PASSWORD in Render environment variables');
  }
};