import apiClient from './api-client';

const uploadService = {
  /**
   * Upload file
   * @param {File} file - File to upload
   * @returns {Promise}
   */
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default uploadService;
