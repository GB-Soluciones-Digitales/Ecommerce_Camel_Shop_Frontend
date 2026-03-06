import React, { useState, useEffect, useMemo } from 'react';
import { pedidoService } from '../../services/pedidoService';
import { productoService } from '../../services/productoService';
import { FiPlus, FiSearch, FiPackage, FiEye } from 'react-icons/fi';
import CreateOrderModal from '../admin/CreateOrderModal';
import OrderDetailModal from '../admin/OrderDetailModal';

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
      PENDIENTE: "bg-amber-50 text-amber-600 border-amber-200",
      CONFIRMADO: "bg-blue-50 text-blue-600 border-blue-200",
      ENVIADO: "bg-purple-50 text-purple-600 border-purple-200",
      ENTREGADO: "bg-emerald-50 text-emerald-600 border-emerald-200",
      CANCELADO: "bg-rose-50 text-rose-600 border-rose-200",
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${styles[estado] || 'bg-brand-light text-brand-secondary'}`}>{estado}</span>;
  };

  return (
    <div className="p-6 md:p-10 bg-crema min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark flex items-center gap-3 font-serif">
              <FiPackage className="text-brand-primary" /> Gestión de Pedidos
            </h2>
            <p className="text-brand-secondary text-sm mt-1 font-medium">Panel de control de ventas y logística</p>
          </div>
          <button onClick={() => setModals({ ...modals, create: true })} 
            className="bg-brand-dark text-crema px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-brand-secondary transition transform hover:-translate-y-1">
            <FiPlus size={18} /> Nuevo Pedido Manual
          </button>
        </div>

        <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-brand-muted mb-8 flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-secondary" />
            <input className="w-full pl-12 pr-6 py-4 bg-transparent outline-none text-sm font-medium" 
              placeholder="Buscar por cliente, ID o tracking..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-6 py-4 bg-brand-light rounded-[1.5rem] outline-none text-xs font-bold text-brand-dark uppercase tracking-widest cursor-pointer border-none"
            value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="TODOS">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADO">Confirmados</option>
            <option value="ENVIADO">Enviados</option>
            <option value="ENTREGADO">Entregados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-dark/5 overflow-hidden border border-brand-muted">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-light/50 text-xs font-black text-brand-primary uppercase tracking-[0.2em] border-b border-brand-muted">
                <tr>
                  <th className="px-8 py-5">Referencia</th>
                  <th className="px-8 py-5">Cliente</th>
                  <th className="px-8 py-5">Total Bruto</th>
                  <th className="px-8 py-5 text-center">Estado Actual</th>
                  <th className="px-8 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-muted">
                {filteredOrders.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-crema/30 transition group">
                    <td className="px-8 py-5 font-mono text-xs font-bold text-brand-primary bg-brand-light/20 tracking-tighter">#{pedido.id}</td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-brand-dark text-sm">{pedido.nombreCliente || 'Cliente Mostrador'}</div>
                      <div className="text-xs text-brand-secondary mt-0.5">{pedido.telefono || '-'}</div>
                    </td>
                    <td className="px-8 py-5 font-serif font-bold text-brand-dark text-lg">${pedido.total?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-center">{getStatusBadge(pedido.estado)}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => { setSelectedOrder(pedido); setModals({ ...modals, detail: true }); }} 
                          className="text-brand-secondary hover:text-brand-dark p-3 bg-brand-light rounded-xl transition-all hover:shadow-md">
                          <FiEye size={18} />
                        </button>
                        <select className="text-xs font-bold border border-brand-muted rounded-lg px-2 py-2 bg-white outline-none focus:border-brand-primary uppercase tracking-tighter"
                          value={pedido.estado} onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}>
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="CONFIRMADO">Confirmado</option>
                          <option value="ENVIADO">Enviado</option>
                          <option value="ENTREGADO">Entregado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </div>
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
    </div>
  );
};

export default AdminOrders;