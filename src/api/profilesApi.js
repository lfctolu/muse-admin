import apiClient from './axiosClient';

const API = {
  searchProfiles: (params) => apiClient.get('profiles/search', { params }),
  deleteProfile: (id) => apiClient.delete(`profiles/${id}`),
  generateCsv: () => apiClient.get('profiles/csv', { responseType: 'blob' }),
};

export default API;
