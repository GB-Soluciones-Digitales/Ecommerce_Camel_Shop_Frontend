import api from './api';

export const productoService = {
  // Endpoints públicos
  getProductosActivos: () => api.get('/productos/publico'),
  getProductoById: (id) => api.get(`/productos/publico/${id}`),
  buscarProductos: (nombre) => api.get('/productos/publico/buscar', { params: { nombre } }),
  getProductosPorCategoria: (categoriaId) => api.get(`/productos/publico/categoria/${categoriaId}`),

  // Endpoints admin
  getAllProductos: () => api.get('/productos/admin'),
  crearProducto: (producto) => api.post('/productos/admin', producto),
  actualizarProducto: (id, producto) => api.put(`/productos/admin/${id}`, producto),
  toggleEstadoProducto: (id) => api.patch(`/productos/admin/${id}/toggle`),
  eliminarProducto: (id) => api.delete(`/productos/admin/${id}`),
};
