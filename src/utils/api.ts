// API configuration for email service - RENDER PRODUCTION
export const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://personalized-email-sender.onrender.com';