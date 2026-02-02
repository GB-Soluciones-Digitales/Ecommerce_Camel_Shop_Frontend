import api from './api';

export const categoriaService = {
  getCategorias: () => api.get('/categorias/publico'),
  getCategoriasAdmin: () => api.get('/categorias/admin'),
  crearCategoria: (categoria) => api.post('/categorias/admin', categoria),
  actualizarCategoria: (id, categoria) => api.put(`/categorias/admin/${id}`, categoria),
  eliminarCategoria: (id) => api.delete(`/categorias/admin/${id}`),
};
