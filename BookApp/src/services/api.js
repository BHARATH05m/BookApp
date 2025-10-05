import axios from 'axios';

const base = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
const api = axios.create({
  baseURL: `${base}/api`,
  // timeout: 10000,
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


