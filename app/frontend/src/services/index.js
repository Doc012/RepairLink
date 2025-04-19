import apiClient from '../utils/apiClient';
import authAPI from './auth/authAPI';
import userAPI from './auth/userAPI';
import customerAPI from './customer/customerAPI';
import vendorAPI from './vendor/vendorAPI';
import publicAPI from './public/publicAPI';
import adminAPI from './admin/adminAPI';

// Export all APIs
export {
  apiClient,
  authAPI,
  userAPI,
  customerAPI,
  vendorAPI,
  publicAPI,
  adminAPI
};