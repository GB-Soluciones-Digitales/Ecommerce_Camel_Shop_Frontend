import api from './api';

export const userService = {
  getUsuarios: () => api.get('/usuarios'),

  cambiarPassword: (id, password) => api.put(`/usuarios/${id}/password`, { password }),
};