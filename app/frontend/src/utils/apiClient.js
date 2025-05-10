import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://51.20.74.74:8080/api',
  withCredentials: true, // This is crucial - ensures cookies are sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token from localStorage if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          return Promise.reject(error);
        }
        
        const refreshResponse = await axios.post(
          'http://16.16.201.230:8080/api/auth/refresh',
          { refreshToken },
          { withCredentials: true }
        );
        
        // If we get a new token, update storage and retry
        if (refreshResponse.data.accessToken) {
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          
          // Update Authorization header for the retry request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          
          // And for future requests
          apiClient.defaults.headers.common['Authorization'] = 
            `Bearer ${refreshResponse.data.accessToken}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear auth data and reject
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;