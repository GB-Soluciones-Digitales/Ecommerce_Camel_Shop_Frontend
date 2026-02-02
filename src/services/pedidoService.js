import api from './api';

export const pedidoService = {
  crearPedido: (datosPedido) => api.post('/pedidos/publico', datosPedido),

  getPedidosAdmin: () => api.get('/pedidos/admin'),

  cambiarEstado: (id, estado) => api.patch(`/pedidos/admin/${id}/estado`, null, {
    params: { estado }
  }),

  subirFactura: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/pedidos/admin/${id}/factura`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  crearPedidoManual: (pedido) => api.post('/pedidos/publico', pedido)
};