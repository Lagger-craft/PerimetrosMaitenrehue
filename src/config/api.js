// Configuration for API endpoints
const isProduction = import.meta.env.PROD;
const isGitHubPages = window.location.hostname.includes('github.io');

// API Base URL configuration
export const API_BASE_URL = (() => {
  if (isGitHubPages || isProduction) {
    // For GitHub Pages deployment, you'll need to deploy your backend elsewhere
    // Options: Vercel, Netlify Functions, Railway, Heroku, etc.
    // For now, fallback to localhost for development
    console.warn('Backend API needs to be deployed for production use');
    return 'http://localhost:5004';  // Updated to use port 5004
  }
  return 'http://localhost:5004';  // Updated to use port 5004
})();

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  products: `${API_BASE_URL}/api/products`,
  quotes: `${API_BASE_URL}/api/quotes`,
  invoices: `${API_BASE_URL}/api/invoices`,
  uploads: `${API_BASE_URL}/uploads`,
};

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getImageUrl,
};