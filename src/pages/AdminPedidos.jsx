import React, { useState, useEffect, useMemo } from 'react';
import { pedidoService } from '../services/pedidoService';
import { productoService } from '../services/productoService';
import { fileService } from '../services/fileService';
import { FiPlus, FiSearch, FiPackage, FiEye } from 'react-icons/fi';
import CreateOrderModal from './CreateOrderModal';
import OrderDetailModal from './OrderDetailModal';

const AdminOrders = () => {
  const [data, setData] = useState({ pedidos: [], productos: [], loading: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [modals, setModals] = useState({ create: false, detail: false });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      const [pedRes, prodRes] = await Promise.all([
        pedidoService.getPedidosAdmin(),
        productoService.getAllProductos()
      ]);
      setData({
        pedidos: Array.isArray(pedRes.data) ? pedRes.data : [],
        productos: Array.isArray(prodRes.data) ? prodRes.data : [],
        loading: false
      });
    } catch (error) {
      console.error("Error cargando datos", error);
      setData(prev => ({ ...prev, loading: false, pedidos: [] }));
    }
  };

  const handleCreateManualOrder = async (orderState) => {
    try {
      const total = orderState.items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
      const payload = {
        ...orderState,
        total,
        items: orderState.items.map(i => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          talle: i.selectedSize,
          precioUnitario: i.precio
        }))
      };
      await pedidoService.crearPedidoManual(payload);
      setModals({ ...modals, create: false });
      loadData();
      alert("Pedido creado correctamente");
    } catch (error) {
      alert("Error al crear pedido");
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await pedidoService.cambiarEstado(id, nuevoEstado);
      loadData();
      if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, estado: nuevoEstado }));
    } catch (error) { alert("Error al actualizar estado"); }
  };

  const handleFileUpload = async (e, pedidoId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await pedidoService.subirFactura(pedidoId, file);
      
      alert('Comprobante subido con éxito');
      
      await loadData();
      
      if (selectedOrder && selectedOrder.id === pedidoId) {
        const updatedOrder = await pedidoService.getPedidoById(pedidoId); 
        setSelectedOrder(updatedOrder.data);
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert('Error al subir el archivo');
    }
  };

  const filteredOrders = useMemo(() => {
    return data.pedidos.filter(p => {
      const matchSearch = (p.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase())) || (p.id?.toString().includes(searchTerm));
      const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
      return matchSearch && matchEstado;
    });
  }, [data.pedidos, searchTerm, filtroEstado]);

  const getStatusBadge = (estado) => {
    const styles = {
      PENDIENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
      CONFIRMADO: "bg-blue-100 text-blue-700 border-blue-200",
      ENVIADO: "bg-purple-100 text-purple-700 border-purple-200",
      ENTREGADO: "bg-green-100 text-green-700 border-green-200",
      CANCELADO: "bg-red-100 text-red-700 border-red-200",
    };
    return <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[estado] || 'bg-gray-100'}`}>{estado}</span>;
  };

  return (
    <div className="p-6 md:p-8 bg-[#f9f5f0] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4a3b2a] flex items-center gap-2"><FiPackage /> Gestión de Pedidos</h2>
          <p className="text-sm text-gray-500">Administra ventas, estados y facturación.</p>
        </div>
        <button onClick={() => setModals({ ...modals, create: true })} className="bg-[#4a3b2a] text-[#d8bf9f] px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition transform hover:-translate-y-0.5">
          <FiPlus /> Nuevo Pedido Manual
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#d8bf9f]/20 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#4a3b2a]" 
            placeholder="Buscar cliente o ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#4a3b2a] bg-white cursor-pointer"
          value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="TODOS">Todos los Estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="CONFIRMADO">Confirmados</option>
          <option value="ENVIADO">Enviados</option>
          <option value="ENTREGADO">Entregados</option>
          <option value="CANCELADO">Cancelados</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#d8bf9f]/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#4a3b2a]/5 text-xs font-bold text-[#4a3b2a] uppercase border-b border-[#d8bf9f]/20">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Ver</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.loading ? (
                <tr><td colSpan="6" className="text-center py-8">Cargando...</td></tr>
              ) : filteredOrders.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-[#f9f5f0] transition group">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-[#4a3b2a]">#{pedido.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{pedido.nombreCliente || 'Cliente Mostrador'}</div>
                    <div className="text-xs text-gray-500">{pedido.telefono || '-'}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#4a3b2a]">${pedido.total?.toLocaleString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(pedido.estado)}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => { setSelectedOrder(pedido); setModals({ ...modals, detail: true }); }} 
                      className="text-gray-400 hover:text-[#4a3b2a] p-2 bg-gray-50 rounded-full transition border border-transparent hover:border-gray-200">
                      <FiEye size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer outline-none"
                      value={pedido.estado} onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}>
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADO">Confirmado</option>
                      <option value="ENVIADO">Enviado</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateOrderModal 
        isOpen={modals.create} 
        onClose={() => setModals({ ...modals, create: false })}
        productos={data.productos}
        onSave={handleCreateManualOrder}
      />

      <OrderDetailModal 
        isOpen={modals.detail}
        pedido={selectedOrder}
        onClose={() => setModals({ ...modals, detail: false })}
        onStatusChange={handleEstadoChange}
        onFileUpload={handleFileUpload} 
      />
    </div>
  );
};

export default AdminOrders;