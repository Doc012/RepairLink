import axiosInstance from './axiosInstance';

/**
 * Base API client with authentication handling
 * Now using the enhanced axiosInstance with token refresh
 */
const apiClient = axiosInstance;

// Example implementation of handleTokenRefresh
const handleTokenRefresh = async () => {
  try {
    console.log('Attempting to refresh token');
    const response = await axiosInstance.post('/auth/refresh-token');
    
    // Store the new tokens
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    
    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error.response?.status, error.response?.data);
    
    // Clear tokens on refresh failure
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Don't throw an error here, just return null to indicate refresh failed
    return null;
  }
};

export default apiClient;