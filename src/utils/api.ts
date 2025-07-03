// API configuration for email service - RENDER PRODUCTION
export const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:10000' 
  : 'https://personalized-email-sender.onrender.com';

// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Backend health check passed:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};