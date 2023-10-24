import apiClient from './axiosClient';

const API = {
  searchItems: (params) => apiClient.get('items/search', { params }),
  deleteItem: (id) => apiClient.delete(`items/${id}`),
  uploadItems: (categoryId, file) =>
    apiClient.post('items/bulk', file, {
      params: { categoryId },
      headers: { 'Content-Type': 'text/plain' },
    }),
};

export default API;
