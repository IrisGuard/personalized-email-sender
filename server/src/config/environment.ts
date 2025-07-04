// Environment configuration and validation
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '10000', 10),
  nodeEnv: process.env.NODE_ENV,
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
  company: {
    name: process.env.COMPANY_NAME || 'AKROGONOS INTERNATIONAL GROUP',
    replyTo: process.env.COMPANY_REPLY_TO || 'koufomataxondriki@gmail.com',
    senderEmail: 'noreply@personalized-email-sender.onrender.com',
  }
};

export const validateEnvironment = () => {
  console.log('🔧 AKROGONOS EMAIL SERVER STARTING...');
  console.log(`📍 PORT: ${config.port}`);
  console.log(`🌍 NODE_ENV: ${config.nodeEnv}`);
  console.log(`📨 SENDGRID_API_KEY: ${config.sendgrid.apiKey ? 'CONFIGURED ✅' : 'MISSING ❌'}`);
  console.log(`🏢 COMPANY_NAME: ${config.company.name}`);
  console.log(`📮 COMPANY_REPLY_TO: ${config.company.replyTo}`);
  console.log(`👤 SENDER_EMAIL: ${config.company.senderEmail}`);

  // Validate SendGrid API key - ONLY SendGrid allowed
  if (!config.sendgrid.apiKey) {
    console.error('❌ CRITICAL: SendGrid API key missing!');
    console.error('Please set SENDGRID_API_KEY in Render environment variables');
    console.error('🚫 Gmail fallback has been removed for anti-spam protection');
    process.exit(1);
  }

  console.log('✅ Using SendGrid for email delivery - 100% safe mode');
};