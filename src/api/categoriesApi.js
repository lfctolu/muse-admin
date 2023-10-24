import apiClient from './axiosClient';

const API = {
  getCategories: (params) => apiClient.get('categories', { params }),
};

export default API;
