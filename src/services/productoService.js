import api from './api';

export const productoService = {
  // ===== ENDPOINTS PÚBLICOS =====
  
  /**
   * Obtiene productos con soporte para búsqueda, categoría y paginación.
   * @param {string} search - Término de búsqueda (opcional)
   * @param {string} categoria - Nombre de la categoría (opcional)
   * @param {number} page - Número de página (default 0)
   * @param {number} size - Cantidad por página (default 8)
   */
  getProductosPublicos: (search = '', categoria = '', page = 0, size = 8) => {
    return api.get('/productos/publico', {
      params: {
        search: search || undefined,
        categoria: categoria || undefined,
        page,
        size
      }
    });
  },

  getProductoById: (id) => api.get(`/productos/publico/${id}`),

  getProductoBySlug: (slug) => api.get(`/productos/publico/detalle/${slug}`),

  // ===== ENDPOINTS ADMIN =====
  
  getAllProductosAdmin: (page = 0, size = 10, search = '') => {
    return api.get(`/productos/admin?page=${page}&size=${size}&search=${search}`);
  },
  
  getProductoAdminById: (id) => api.get(`/productos/admin/${id}`),

  crearProducto: (producto) => api.post('/productos/admin', producto),
  
  actualizarProducto: (id, producto) => api.put(`/productos/admin/${id}`, producto),
  
  toggleEstadoProducto: (id) => api.patch(`/productos/admin/${id}/toggle`),
  
  eliminarProducto: (id) => api.delete(`/productos/admin/${id}`),
};