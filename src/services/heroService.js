import api from './api';

export const heroService = {
  getPublicSlides: () => api.get('/hero-slides/publico'),

  getAdminSlides: () => api.get('/hero-slides/admin'),
  crearSlide: (slide) => api.post('/hero-slides/admin', slide),
  actualizarSlide: (id, slide) => api.put(`/hero-slides/admin/${id}`, slide),
  eliminarSlide: (id) => api.delete(`/hero-slides/admin/${id}`),
};