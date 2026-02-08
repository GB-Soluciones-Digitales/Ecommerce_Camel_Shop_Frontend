import React, { useState, useEffect } from 'react';
import { pedidoService } from '../services/pedidoService';
import { productoService } from '../services/productoService';
import { fileService } from '../services/fileService';
import { FiPlus, FiUpload, FiFileText, FiSearch, FiFilter, FiTrash2, FiX, FiCheck, FiPackage } from 'react-icons/fi';

const AdminOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estado para el nuevo pedido
  const [newOrder, setNewOrder] = useState({
    nombreCliente: '', telefono: '', direccionEnvio: '', metodoPago: 'Efectivo', items: [] 
  });

  // Estado para el ítem temporal que se está agregando
  const [tempItem, setTempItem] = useState({ 
    productoId: '', 
    color: '', 
    talle: '', 
    cantidad: 1 
  });

  // Helpers para los selects dinámicos del modal
  const selectedProductObj = productos.find(p => p.id === parseInt(tempItem.productoId));
  const availableColors = selectedProductObj?.variantes?.map(v => v.color) || [];
  const selectedVariantObj = selectedProductObj?.variantes?.find(v => v.color === tempItem.color);
  const availableSizes = selectedVariantObj ? Object.keys(selectedVariantObj.stockPorTalle) : [];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pedRes, prodRes] = await Promise.all([
        pedidoService.getPedidosAdmin(),
        productoService.getAllProductos()
      ]);
      
      // BLINDAJE: Validamos que sean arrays antes de setear el estado
      setPedidos(Array.isArray(pedRes.data) ? pedRes.data : []);
      setProductos(Array.isArray(prodRes.data) ? prodRes.data : []);
      
    } catch (error) {
      console.error("Error cargando datos", error);
      // En caso de error, reseteamos a arrays vacíos para evitar el crash
      setPedidos([]);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await pedidoService.cambiarEstado(id, nuevoEstado);
      loadData();
    } catch (error) { alert("Error al actualizar estado"); }
  };

  const handleFileUpload = async (e, pedidoId) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await pedidoService.subirFactura(pedidoId, file);
      alert('Comprobante subido con éxito');
      loadData();
    } catch (error) { alert('Error al subir el archivo'); }
  };

  const addItemToOrder = () => {
    if (!selectedProductObj) return;
    if (!tempItem.color && availableColors.length > 0) { alert("Seleccioná un color"); return; }
    if (!tempItem.talle && availableSizes.length > 0) { alert("Seleccioná un talle"); return; }

    const item = {
      productoId: selectedProductObj.id,
      nombre: selectedProductObj.nombre,
      cantidad: parseInt(tempItem.cantidad),
      precio: selectedProductObj.precio,
      // Guardamos la info de variante para el backend/whatsapp
      selectedSize: `${tempItem.color} - ${tempItem.talle}`, 
      imagenUrl: selectedProductObj.imagenes?.[0] || selectedProductObj.imagenUrl
    };
    
    setNewOrder({ ...newOrder, items: [...newOrder.items, item] });
    setTempItem({ productoId: '', color: '', talle: '', cantidad: 1 });
  };

  const removeItemFromOrder = (index) => {
    const newItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: newItems });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (newOrder.items.length === 0) {
      alert("Agregá al menos un producto");
      return;
    }

    try {
      const totalCalculado = newOrder.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
      
      const payload = {
        ...newOrder,
        total: totalCalculado,
        items: newOrder.items.map(i => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          talle: i.selectedSize, // Enviamos "Color - Talle" como string unificado
          precioUnitario: i.precio
        }))
      };

      await pedidoService.crearPedidoManual(payload);
      setShowCreateModal(false);
      setNewOrder({ nombreCliente: '', telefono: '', direccionEnvio: '', metodoPago: 'Efectivo', items: [] });
      loadData();
      alert("Pedido creado correctamente");
    } catch (error) { 
      console.error(error);
      alert('Error al crear pedido'); 
    }
  };

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

  // BLINDAJE: Verificamos que pedidos sea un array antes de filtrar
  const safePedidos = Array.isArray(pedidos) ? pedidos : [];

  const filteredOrders = safePedidos.filter(p => {
    const matchSearch = p.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm);
    const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="p-6 md:p-8 bg-[#f9f5f0] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4a3b2a] flex items-center gap-2">
            <FiPackage /> Gestión de Pedidos
          </h2>
          <p className="text-sm text-gray-500">Administra ventas, estados y facturación.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="bg-[#4a3b2a] hover:bg-black text-[#d8bf9f] px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition transform hover:-translate-y-0.5">
          <FiPlus /> Nuevo Pedido Manual
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#d8bf9f]/20 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#4a3b2a]" 
             placeholder="Buscar cliente o ID..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="relative">
           <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <select 
             className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#4a3b2a] bg-white cursor-pointer"
             value={filtroEstado}
             onChange={e => setFiltroEstado(e.target.value)}
           >
             <option value="TODOS">Todos</option>
             <option value="PENDIENTE">Pendientes</option>
             <option value="CONFIRMADO">Confirmados</option>
             <option value="ENVIADO">Enviados</option>
             <option value="ENTREGADO">Entregados</option>
             <option value="CANCELADO">Cancelados</option>
           </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#d8bf9f]/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#4a3b2a]/5 text-xs font-bold text-[#4a3b2a] uppercase border-b border-[#d8bf9f]/20">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Comprobante</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Cargando pedidos...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No hay pedidos registrados.</td></tr>
              ) : (
                filteredOrders.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[#f9f5f0] transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#4a3b2a]">#{pedido.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{pedido.nombreCliente}</div>
                      <div className="text-xs text-gray-500">{pedido.telefono}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#4a3b2a]">${pedido.total.toLocaleString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(pedido.estado)}</td>
                    <td className="px-6 py-4">
                      {pedido.facturaUrl ? (
                        <a href={fileService.getImageUrl(pedido.facturaUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 px-2 py-1 rounded text-xs font-bold transition">
                          <FiFileText /> Ver Archivo
                        </a>
                      ) : (
                        <label className="cursor-pointer inline-flex items-center gap-1 text-[#4a3b2a] hover:text-black bg-[#d8bf9f]/30 px-2 py-1 rounded text-xs font-bold transition">
                          <FiUpload /> Subir
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, pedido.id)} accept="image/*,.pdf" />
                        </label>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer outline-none focus:border-[#4a3b2a]"
                        value={pedido.estado}
                        onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CONFIRMADO">Confirmado</option>
                        <option value="ENVIADO">Enviado</option>
                        <option value="ENTREGADO">Entregado</option>
                        <option value="CANCELADO">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR PEDIDO MANUAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col border border-[#d8bf9f]">
            <div className="px-6 py-4 border-b border-[#d8bf9f]/30 flex justify-between items-center bg-[#f9f5f0]">
               <h3 className="font-bold text-xl text-[#4a3b2a]">Cargar Pedido Manual</h3>
               <button onClick={() => setShowCreateModal(false)} className="text-[#4a3b2a] hover:opacity-50"><FiX size={24}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="manual-order-form" onSubmit={handleCreateOrder} className="space-y-6">
                 {/* Datos Cliente */}
                 <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                   <h4 className="font-bold text-xs text-[#4a3b2a] uppercase tracking-widest border-b border-gray-200 pb-2">Datos del Cliente</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input placeholder="Nombre Completo" className="border rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]" required 
                       value={newOrder.nombreCliente} onChange={e => setNewOrder({...newOrder, nombreCliente: e.target.value})} />
                     <input placeholder="Teléfono / WhatsApp" className="border rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]" required 
                       value={newOrder.telefono} onChange={e => setNewOrder({...newOrder, telefono: e.target.value})} />
                   </div>
                   <input placeholder="Dirección de Envío Completa" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]" required 
                     value={newOrder.direccionEnvio} onChange={e => setNewOrder({...newOrder, direccionEnvio: e.target.value})} />
                   
                   <div className="flex items-center gap-3">
                      <label className="text-sm font-bold text-gray-600">Método de Pago:</label>
                      <select className="border rounded-lg px-3 py-1 bg-white outline-none focus:border-[#4a3b2a]" value={newOrder.metodoPago} onChange={e => setNewOrder({...newOrder, metodoPago: e.target.value})}>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Tarjeta">Tarjeta</option>
                      </select>
                   </div>
                 </div>

                 {/* Selector de Productos */}
                 <div className="space-y-3">
                   <h4 className="font-bold text-xs text-[#4a3b2a] uppercase tracking-widest border-b border-gray-200 pb-2">Agregar Productos</h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-[#f9f5f0] p-4 rounded-xl border border-[#d8bf9f]/30 items-end">
                     {/* 1. Producto */}
                     <div className="md:col-span-4">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">PRODUCTO</label>
                        <select className="w-full border rounded-lg px-3 py-2 outline-none bg-white text-sm" 
                          value={tempItem.productoId} onChange={e => setTempItem({ productoId: e.target.value, color: '', talle: '', cantidad: 1 })}>
                           <option value="">Seleccionar...</option>
                           {productos.map(prod => (
                             <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                           ))}
                        </select>
                     </div>

                     {/* 2. Color (Dinámico) */}
                     <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">COLOR</label>
                        <select 
                          className="w-full border rounded-lg px-3 py-2 outline-none bg-white text-sm disabled:bg-gray-100"
                          value={tempItem.color} 
                          onChange={e => setTempItem({...tempItem, color: e.target.value, talle: ''})}
                          disabled={!selectedProductObj || availableColors.length === 0}
                        >
                           <option value="">Elegir...</option>
                           {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>

                     {/* 3. Talle (Dinámico) */}
                     <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">TALLE</label>
                        <select 
                          className="w-full border rounded-lg px-3 py-2 outline-none bg-white text-sm disabled:bg-gray-100"
                          value={tempItem.talle} 
                          onChange={e => setTempItem({...tempItem, talle: e.target.value})}
                          disabled={!tempItem.color || availableSizes.length === 0}
                        >
                           <option value="">...</option>
                           {availableSizes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>

                     {/* 4. Cantidad */}
                     <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">CANT.</label>
                        <input type="number" className="w-full border rounded-lg px-3 py-2 outline-none text-sm" min="1"
                          value={tempItem.cantidad} onChange={e => setTempItem({...tempItem, cantidad: e.target.value})} />
                     </div>

                     {/* Botón */}
                     <div className="md:col-span-1">
                       <button type="button" onClick={addItemToOrder} className="w-full bg-[#4a3b2a] text-[#d8bf9f] py-2 rounded-lg font-bold hover:bg-black transition flex justify-center">
                         <FiPlus />
                       </button>
                     </div>
                   </div>

                   {/* Lista de Ítems Agregados */}
                   {newOrder.items.length > 0 && (
                     <div className="border border-gray-200 rounded-xl overflow-hidden">
                       <table className="w-full text-sm text-left">
                         <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                           <tr>
                             <th className="px-4 py-2">Producto</th>
                             <th className="px-4 py-2">Detalle</th>
                             <th className="px-4 py-2">Cant</th>
                             <th className="px-4 py-2">Subtotal</th>
                             <th className="px-4 py-2"></th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           {newOrder.items.map((item, idx) => (
                             <tr key={idx} className="bg-white">
                               <td className="px-4 py-2 font-medium">{item.nombre}</td>
                               <td className="px-4 py-2 text-gray-500">{item.selectedSize}</td>
                               <td className="px-4 py-2">{item.cantidad}</td>
                               <td className="px-4 py-2 font-bold text-[#4a3b2a]">${(item.precio * item.cantidad).toLocaleString()}</td>
                               <td className="px-4 py-2 text-right">
                                 <button type="button" onClick={() => removeItemFromOrder(idx)} className="text-red-400 hover:text-red-600"><FiTrash2/></button>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                         <tfoot className="bg-[#f9f5f0] font-bold border-t border-[#d8bf9f]/20">
                           <tr>
                             <td colSpan="3" className="px-4 py-3 text-right text-[#4a3b2a]">Total Estimado:</td>
                             <td colSpan="2" className="px-4 py-3 text-lg text-[#4a3b2a]">
                               ${newOrder.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toLocaleString()}
                             </td>
                           </tr>
                         </tfoot>
                       </table>
                     </div>
                   )}
                 </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
               <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 text-gray-500 hover:bg-gray-200 rounded-xl font-bold transition">Cancelar</button>
               <button type="submit" form="manual-order-form" className="px-8 py-2 bg-[#4a3b2a] text-[#d8bf9f] rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center gap-2">
                 <FiCheck /> Confirmar Pedido
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;