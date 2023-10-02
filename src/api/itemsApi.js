import apiClient from './axiosClient';

const API = {
  searchItems: (params) => apiClient.get('items/search', { params }),
  deleteItem: (id) => apiClient.delete(`items/${id}`),
};

export default API;
