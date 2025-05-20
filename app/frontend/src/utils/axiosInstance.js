import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://13.60.59.231:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

instance.interceptors.response.use(
  (response) => {
    // Check for token expiration header
    if (response.headers['x-token-expired'] === 'true') {
      return handleTokenRefresh(response.config);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        await handleTokenRefresh(originalRequest);
        processQueue(null);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (refreshError.response?.status === 401) {
          // Clear auth state but don't redirect yet
          // Let AuthContext handle the redirect
          return Promise.reject(refreshError);
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const handleTokenRefresh = async (failedRequest) => {
  try {
    const response = await axios.post(
      'http://13.60.59.231:8080/api/auth/refresh-token',
      {},
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export default instance;