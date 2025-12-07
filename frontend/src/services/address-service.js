import apiClient from './api-client';

const addressService = {
  getMyAddresses: async () => {
    const response = await apiClient.get('/users/addresses');
    return response;
  },

  addAddress: async (data) => {
    const response = await apiClient.post('/users/addresses', data);
    return response;
  },

  updateAddress: async (id, data) => {
    const response = await apiClient.put(`/users/addresses/${id}`, data);
    return response;
  },

  deleteAddress: async (id) => {
    const response = await apiClient.delete(`/users/addresses/${id}`);
    return response;
  },

  setDefaultAddress: async (id) => {
    const response = await apiClient.put(`/users/addresses/${id}/default`);
    return response;
  }
};

export default addressService;
