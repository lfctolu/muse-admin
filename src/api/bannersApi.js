import apiClient from './axiosClient';

const API = {
  getBanners: (params) => apiClient.get('banners', { params }),
  createBanner: (body) => apiClient.post(`banners`, body),
  getBanner: (id) => apiClient.get(`banners/${id}`),
  updateBanner: (id, body) => apiClient.put(`banners/${id}`, body),
  deleteBanner: (id) => apiClient.delete(`banners/${id}`),
  getBannerItems: (id, params) =>
    apiClient.get(`banners/${id}/items`, { params }),
  addItemToBanner: (id, body) => apiClient.post(`banners/${id}/items`, body),
  updateItemPosition: (id, body) => apiClient.put(`banners/${id}/items`, body),
  removeItemFromBanner: (id, itemId) =>
    apiClient.delete(`banners/${id}/items/${itemId}`),
};

export default API;
