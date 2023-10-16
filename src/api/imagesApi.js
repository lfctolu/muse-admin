import apiClient from './axiosClient';
import axios from 'axios';

const API = {
  generateImageUrl: () => apiClient.post('images', { type: 'STANDARD' }),
  upload: (url, data) => axios.put(url, data),
};

export default API;
