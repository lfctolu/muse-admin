import apiClient from './axiosClient';

const API = {
  searchProfiles: (params) => apiClient.get('profiles/search', { params }),
  deleteProfile: (id) => apiClient.delete(`profiles/${id}`),
};

export default API;
