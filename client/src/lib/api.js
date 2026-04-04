import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

let csrfToken = null;

export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/api/csrf-token');
    csrfToken = response.data.token;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

// Request interceptor to add CSRF token
api.interceptors.request.use(async (config) => {
  // Don't add CSRF to GET/HEAD/OPTIONS
  if (['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
    return config;
  }

  // If we don't have a token, try to fetch one
  if (!csrfToken) {
    await fetchCsrfToken();
  }

  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle CSRF errors and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 403 Forbidden (common for CSRF failures) and haven't retried yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Refresh CSRF token
      await fetchCsrfToken();
      
      if (csrfToken) {
        originalRequest.headers['x-csrf-token'] = csrfToken;
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

export const signInWithDiscord = () => {
  // Ensure we don't have double slashes if baseURL has a trailing slash
  const baseUrl = api.defaults.baseURL.replace(/\/$/, '');
  window.location.href = `${baseUrl}/auth/discord`;
};  

export default api;