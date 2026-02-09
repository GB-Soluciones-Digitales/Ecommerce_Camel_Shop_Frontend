import React, { useState, useEffect } from 'react';
import { pedidoService } from '../services/pedidoService';
import { productoService } from '../services/productoService';
import { fileService } from '../services/fileService';
import { FiPlus, FiUpload, FiFileText, FiSearch, FiFilter, FiTrash2, FiX, FiCheck, FiPackage, FiEye, FiUser, FiMapPin, FiPhone, FiCreditCard, FiAlertCircle } from 'react-icons/fi';

const AdminOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Estados de Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Estado para el nuevo pedido manual
  const [newOrder, setNewOrder] = useState({
    nombreCliente: '', telefono: '', direccionEnvio: '', metodoPago: 'Efectivo', items: [] 
  });

  // Estado para el ítem temporal (Producto > Color > Talle > Cantidad)
  const [tempItem, setTempItem] = useState({ 
    productoId: '', 
    color: '', 
    talle: '', 
    cantidad: 1 
  });

  // --- LÓGICA DE STOCK INTELIGENTE ---
  const selectedProductObj = productos.find(p => p.id === parseInt(tempItem.productoId));
  
  // 1. Obtenemos colores disponibles del producto seleccionado
  const availableColors = selectedProductObj?.variantes?.map(v => v.color) || [];
  
  // 2. Obtenemos el objeto variante del color seleccionado
  const selectedVariantObj = selectedProductObj?.variantes?.find(v => v.color === tempItem.color);
  
  // 3. Obtenemos los talles y su stock de esa variante
  const availableSizes = selectedVariantObj ? Object.keys(selectedVariantObj.stockPorTalle) : [];

  // 4. Stock específico de la combinación seleccionada
  const currentStock = (selectedVariantObj && tempItem.talle) 
    ? selectedVariantObj.stockPorTalle[tempItem.talle] 
    : 0;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pedRes, prodRes] = await Promise.all([
        pedidoService.getPedidosAdmin(),
        productoService.getAllProductos()
      ]);
      
      // Blindaje contra respuestas nulas
      setPedidos(Array.isArray(pedRes.data) ? pedRes.data : []);
      setProductos(Array.isArray(prodRes.data) ? prodRes.data : []);
      
    } catch (error) {
      console.error("Error cargando datos", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await pedidoService.cambiarEstado(id, nuevoEstado);
      loadData();
      // Si estamos viendo el detalle, actualizamos el estado en el modal también
      if (selectedOrder && selectedOrder.id === id) {
         setSelectedOrder(prev => ({ ...prev, estado: nuevoEstado }));
      }
    } catch (error) { alert("Error al actualizar estado"); }
  };

  const handleViewOrder = (pedido) => {
    setSelectedOrder(pedido);
    setShowDetailModal(true);
  };

  const handleFileUpload = async (e, pedidoId) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await pedidoService.subirFactura(pedidoId, file);
      alert('Comprobante subido con éxito');
      loadData();
      if (selectedOrder && selectedOrder.id === pedidoId) {
         // Recargamos el pedido seleccionado para ver el cambio
         const updatedOrder = await pedidoService.getPedidoById(pedidoId); // Asumiendo que tenés este método o recargás todo
         setSelectedOrder(updatedOrder.data); // O simplemente cerrás el modal
      }
    } catch (error) { alert('Error al subir el archivo'); }
  };

  const addItemToOrder = () => {
    if (!selectedProductObj) return;
    
    // Validaciones de Selección
    if (!tempItem.color && availableColors.length > 0) { alert("Seleccioná un color"); return; }
    if (!tempItem.talle && availableSizes.length > 0) { alert("Seleccioná un talle"); return; }
    
    // CONTROL DE STOCK
    if (availableSizes.length > 0) {
        if (currentStock === 0) {
            alert("No hay stock disponible para esta variante.");
            return;
        }
        if (parseInt(tempItem.cantidad) > currentStock) {
            alert(`Solo hay ${currentStock} unidades disponibles.`);
            return;
        }
    }

    const item = {
      productoId: selectedProductObj.id,
      nombre: selectedProductObj.nombre,
      cantidad: parseInt(tempItem.cantidad),
      precio: selectedProductObj.precio,
      // Guardamos la info completa
      color: tempItem.color,
      talle: tempItem.talle,
      selectedSize: `${tempItem.color} - ${tempItem.talle}`, 
      imagenUrl: selectedProductObj.imagenes?.[0] || selectedProductObj.imagenUrl
    };
    
    setNewOrder({ ...newOrder, items: [...newOrder.items, item] });
    // Reseteamos solo la selección de variante, mantenemos el producto por si quiere agregar otro talle
    setTempItem({ ...tempItem, color: '', talle: '', cantidad: 1 });
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
          // Enviamos el string combinado o el objeto según tu DTO de backend
          talle: i.selectedSize, 
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

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  const filteredOrders = pedidos.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
        (p.nombreCliente && p.nombreCliente.toLowerCase().includes(term)) || 
        (p.id && p.id.toString().includes(term));
    
    const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="p-6 md:p-8 bg-[#f9f5f0] min-h-screen font-sans">
      
      {/* HEADER */}
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

      {/* FILTROS */}
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

      {/* TABLA DE PEDIDOS */}
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
                <th className="px-6 py-4 text-center">Detalle</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Cargando...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No hay pedidos registrados.</td></tr>
              ) : (
                filteredOrders.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[#f9f5f0] transition group">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#4a3b2a]">#{pedido.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{pedido.nombreCliente || 'Cliente Mostrador'}</div>
                      <div className="text-xs text-gray-500">{pedido.telefono || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#4a3b2a]">${pedido.total?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4">{getStatusBadge(pedido.estado)}</td>
                    
                    {/* BOTÓN VER DETALLE (OJO) */}
                    <td className="px-6 py-4 text-center">
                        <button onClick={() => handleViewOrder(pedido)} className="text-gray-400 hover:text-[#4a3b2a] p-2 bg-gray-50 hover:bg-white rounded-full transition border border-transparent hover:border-gray-200">
                            <FiEye size={18} />
                        </button>
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

      {/* MODAL 1: DETALLE DE PEDIDO (PARA PREPARAR) */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-[#d8bf9f] max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="px-8 py-6 bg-[#f9f5f0] border-b border-[#d8bf9f]/30 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black text-[#4a3b2a]">Pedido #{selectedOrder.id}</h3>
                            {getStatusBadge(selectedOrder.estado)}
                        </div>
                        <p className="text-sm text-gray-500">{new Date(selectedOrder.fecha).toLocaleString()}</p>
                    </div>
                    <button onClick={() => setShowDetailModal(false)} className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-600 shadow-sm transition"><FiX size={20}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    
                    {/* Datos Cliente y Envío */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Cliente</h4>
                            <div className="flex items-start gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg text-[#4a3b2a]"><FiUser /></div>
                                <div>
                                    <p className="font-bold text-gray-800">{selectedOrder.nombreCliente}</p>
                                    <a href={`https://wa.me/${selectedOrder.telefono?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline flex items-center gap-1">
                                        <FiPhone size={12}/> {selectedOrder.telefono}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Envío y Pago</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-[#4a3b2a]"><FiMapPin /></div>
                                    <p className="text-sm text-gray-600 font-medium">{selectedOrder.direccionEnvio}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-[#4a3b2a]"><FiCreditCard /></div>
                                    <span className="bg-[#f9f5f0] text-[#4a3b2a] text-xs font-bold px-3 py-1 rounded-full border border-[#d8bf9f]/30">
                                        {selectedOrder.metodoPago}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items a Preparar */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Items a Preparar</h4>
                        <div className="space-y-3">
                            {selectedOrder.detalles?.map((detalle, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:border-[#d8bf9f]/50 transition">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img 
                                            src={getImgUrl(detalle.producto?.imagenes?.[0])} 
                                            alt={detalle.producto?.nombre} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=IMG'; }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-[#4a3b2a]">{detalle.producto?.nombre}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-[#4a3b2a] text-[#d8bf9f] text-xs font-bold px-2 py-0.5 rounded">
                                                {detalle.talleSeleccionado || 'Único'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 uppercase font-bold">Cant.</div>
                                        <div className="text-xl font-black text-[#4a3b2a]">{detalle.cantidad}</div>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <div className="text-xs text-gray-400 uppercase font-bold">Subtotal</div>
                                        <div className="font-bold text-gray-800">${detalle.subtotal?.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Modal Detalle */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-left">
                        <span className="text-xs font-bold text-gray-400 uppercase block">Total a Cobrar</span>
                        <span className="text-2xl font-black text-[#4a3b2a]">${selectedOrder.total?.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <input type="file" id="modal-upload" className="hidden" onChange={(e) => handleFileUpload(e, selectedOrder.id)} accept="image/*,.pdf"/>
                            <label htmlFor="modal-upload" className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition flex items-center gap-2">
                                <FiUpload /> {selectedOrder.facturaUrl ? 'Cambiar Factura' : 'Subir Factura'}
                            </label>
                        </div>
                        {selectedOrder.estado === 'PENDIENTE' && (
                            <button onClick={() => handleEstadoChange(selectedOrder.id, 'CONFIRMADO')} className="bg-[#4a3b2a] text-[#d8bf9f] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition flex items-center gap-2 shadow-lg">
                                <FiCheck /> Confirmar Pedido
                            </button>
                        )}
                         {selectedOrder.estado === 'CONFIRMADO' && (
                            <button onClick={() => handleEstadoChange(selectedOrder.id, 'ENVIADO')} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition flex items-center gap-2 shadow-lg">
                                <FiPackage /> Marcar Enviado
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL 2: CREAR PEDIDO MANUAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col border border-[#d8bf9f]" onClick={e => e.stopPropagation()}>
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

                     {/* 4. Cantidad (Con límite de stock) */}
                     <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 flex justify-between">
                            <span>CANT.</span>
                            {currentStock > 0 && <span className="text-green-600 font-bold">Max: {currentStock}</span>}
                        </label>
                        <input 
                            type="number" 
                            className="w-full border rounded-lg px-3 py-2 outline-none text-sm" 
                            min="1"
                            max={currentStock} // Límite visual
                            value={tempItem.cantidad} 
                            onChange={e => setTempItem({...tempItem, cantidad: e.target.value})} 
                        />
                     </div>

                     {/* Botón */}
                     <div className="md:col-span-1">
                       <button 
                         type="button" 
                         onClick={addItemToOrder} 
                         disabled={!tempItem.talle || currentStock === 0 || tempItem.cantidad > currentStock}
                         className="w-full bg-[#4a3b2a] text-[#d8bf9f] py-2 rounded-lg font-bold hover:bg-black transition flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <FiPlus />
                       </button>
                     </div>
                   </div>
                   
                   {/* Mensaje de error de stock */}
                   {tempItem.talle && currentStock === 0 && (
                        <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <FiAlertCircle /> No hay stock disponible para esta variante.
                        </p>
                   )}

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