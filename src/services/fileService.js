import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const fileService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_BASE_URL}/uploads`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  },

  getImageUrl: (filename, width = null) => {
    if (!filename) return 'https://placehold.co/600x400?text=Sin+Imagen';
    if (filename.includes('res.cloudinary.com') && filename.includes('/upload/')) {
      if (!filename.includes('f_auto')) {
        const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
        return filename.replace('/upload/', `/upload/${transform}/`);
      }
      return filename;
    }
    if (filename.startsWith('http')) return filename;
    return `${API_BASE_URL}/uploads/${filename}`;
  },
};