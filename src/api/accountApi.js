import apiClient from './axiosClient';

const API = {
  getProfile: () => apiClient.get('profile'),
  refreshTokens: () => {},
};

export default API;
