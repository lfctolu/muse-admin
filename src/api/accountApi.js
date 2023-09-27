import apiClient from './axiosClient';
import { auth } from './firebaseClient';

const API = {
  getProfile: () => apiClient.get('profile'),
  refreshTokens: () => {},
};

export default API;
