import axios from 'axios';

// Use backend URL from environment variable, or empty string if not set
const base = process.env.REACT_APP_BACKEND_URL || '';
const api = axios.create({
  baseURL: base ? `${base}/api` : '/api',
  timeout: 10000,
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;


