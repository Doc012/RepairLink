import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true // Important: This allows cookies to be sent with requests
});

// Response interceptor to handle 401 errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is not 401 or it's already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Mark this request as retried
    originalRequest._retry = true;

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    // Try to refresh the token
    try {
      await api.post('/api/auth/refresh-token');
      processQueue(null);
      isRefreshing = false;
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear queue and redirect to login
      processQueue(refreshError);
      isRefreshing = false;
      
      // If refreshing fails, redirect to login
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    }
  }
);

export default api;