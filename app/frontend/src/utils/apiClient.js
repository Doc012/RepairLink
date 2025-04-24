import axiosInstance from './axiosInstance';

/**
 * Base API client with authentication handling
 * Now using the enhanced axiosInstance with token refresh
 */
const apiClient = axiosInstance;

export default apiClient;