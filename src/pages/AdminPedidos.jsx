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
  const [newOrder, setNewOrder] = useState({
    nombreCliente: '', telefono: '', direccionEnvio: '', metodoPago: 'Efectivo',
    items: [] 
  });
  const [tempItem, setTempItem] = useState({ productoId: '', cantidad: 1, talle: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pedRes, prodRes] = await Promise.all([
        pedidoService.getPedidosAdmin(),
        productoService.getAllProductos()
      ]);
      setPedidos(pedRes.data);
      setProductos(prodRes.data);
    } catch (error) {
      console.error("Error cargando datos", error);
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
    const prod = productos.find(p => p.id === parseInt(tempItem.productoId));
    if (!prod) return;
    
    const talleFinal = tempItem.talle || (prod.talles && prod.talles.length > 0 ? prod.talles[0] : 'Único');

    const item = {
      productoId: prod.id,
      nombre: prod.nombre,
      cantidad: parseInt(tempItem.cantidad),
      precio: prod.precio,
      selectedSize: talleFinal,
      imagenUrl: prod.imagenes?.[0] || prod.imagenUrl
    };
    
    setNewOrder({ ...newOrder, items: [...newOrder.items, item] });
    setTempItem({ productoId: '', cantidad: 1, talle: '' });
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
          selectedSize: i.selectedSize,
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

  const filteredOrders = pedidos.filter(p => {
    const matchSearch = p.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm);
    const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiPackage /> Gestión de Pedidos
          </h2>
          <p className="text-sm text-gray-500">Administra ventas, estados y facturación.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="bg-camel-600 hover:bg-camel-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition transform hover:-translate-y-0.5">
          <FiPlus /> Nuevo Pedido Manual
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-camel-500" 
             placeholder="Buscar cliente o ID..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="relative">
           <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <select 
             className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-camel-500 bg-white cursor-pointer"
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Factura/Comprobante</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Cargando pedidos...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No se encontraron pedidos.</td></tr>
              ) : (
                filteredOrders.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold">#{pedido.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{pedido.nombreCliente}</div>
                      <div className="text-xs text-gray-500">{pedido.telefono}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${pedido.total.toLocaleString()}</td>
                    <td className="px-6 py-4">{getStatusBadge(pedido.estado)}</td>
                    <td className="px-6 py-4">
                      {pedido.facturaUrl ? (
                        <a href={fileService.getImageUrl(pedido.facturaUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 px-2 py-1 rounded text-xs font-bold transition">
                          <FiFileText /> Ver Archivo
                        </a>
                      ) : (
                        <label className="cursor-pointer inline-flex items-center gap-1 text-camel-600 hover:text-camel-800 bg-camel-50 px-2 py-1 rounded text-xs font-bold transition">
                          <FiUpload /> Subir
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, pedido.id)} accept="image/*,.pdf" />
                        </label>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:border-camel-500 cursor-pointer outline-none"
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-xl text-gray-800">Cargar Pedido Manual</h3>
               <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="manual-order-form" onSubmit={handleCreateOrder} className="space-y-6">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                   <h4 className="font-bold text-sm text-camel-600 uppercase tracking-wide">Datos del Cliente</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input placeholder="Nombre Completo" className="border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-camel-500" required 
                       value={newOrder.nombreCliente} onChange={e => setNewOrder({...newOrder, nombreCliente: e.target.value})} />
                     <input placeholder="Teléfono / WhatsApp" className="border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-camel-500" required 
                       value={newOrder.telefono} onChange={e => setNewOrder({...newOrder, telefono: e.target.value})} />
                   </div>
                   <input placeholder="Dirección de Envío Completa" className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-camel-500" required 
                     value={newOrder.direccionEnvio} onChange={e => setNewOrder({...newOrder, direccionEnvio: e.target.value})} />
                   
                   <div className="flex items-center gap-2">
                      <label className="text-sm font-bold text-gray-600">Método de Pago:</label>
                      <select className="border rounded-lg px-3 py-1 bg-white" value={newOrder.metodoPago} onChange={e => setNewOrder({...newOrder, metodoPago: e.target.value})}>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Tarjeta">Tarjeta</option>
                      </select>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <h4 className="font-bold text-sm text-camel-600 uppercase tracking-wide">Productos</h4>
                   <div className="flex flex-col md:flex-row gap-2 bg-gray-100 p-3 rounded-lg">
                     <select className="flex-1 border rounded-lg px-3 py-2 outline-none" 
                       value={tempItem.productoId} onChange={e => setTempItem({...tempItem, productoId: e.target.value})}>
                        <option value="">Seleccionar Producto...</option>
                        {productos.map(prod => (
                          <option key={prod.id} value={prod.id}>{prod.nombre} (Stock: {prod.stock})</option>
                        ))}
                     </select>
                     <input type="number" placeholder="Cant" className="w-20 border rounded-lg px-3 py-2 outline-none" min="1"
                       value={tempItem.cantidad} onChange={e => setTempItem({...tempItem, cantidad: e.target.value})} />
                     <input type="text" placeholder="Talle" className="w-24 border rounded-lg px-3 py-2 outline-none" 
                       value={tempItem.talle} onChange={e => setTempItem({...tempItem, talle: e.target.value})} />
                     <button type="button" onClick={addItemToOrder} className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition">
                       <FiPlus />
                     </button>
                   </div>

                   {newOrder.items.length > 0 && (
                     <div className="border border-gray-200 rounded-lg overflow-hidden">
                       <table className="w-full text-sm text-left">
                         <thead className="bg-gray-50 text-gray-500">
                           <tr>
                             <th className="px-4 py-2">Producto</th>
                             <th className="px-4 py-2">Talle</th>
                             <th className="px-4 py-2">Cant</th>
                             <th className="px-4 py-2">Subtotal</th>
                             <th className="px-4 py-2"></th>
                           </tr>
                         </thead>
                         <tbody>
                           {newOrder.items.map((item, idx) => (
                             <tr key={idx} className="border-t border-gray-100">
                               <td className="px-4 py-2">{item.nombre}</td>
                               <td className="px-4 py-2">{item.selectedSize}</td>
                               <td className="px-4 py-2">{item.cantidad}</td>
                               <td className="px-4 py-2 font-bold">${(item.precio * item.cantidad).toLocaleString()}</td>
                               <td className="px-4 py-2 text-right">
                                 <button type="button" onClick={() => removeItemFromOrder(idx)} className="text-red-500 hover:text-red-700"><FiTrash2/></button>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                         <tfoot className="bg-gray-50 font-bold">
                           <tr>
                             <td colSpan="3" className="px-4 py-3 text-right">Total Pedido:</td>
                             <td colSpan="2" className="px-4 py-3 text-lg text-camel-600">
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

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
               <button type="submit" form="manual-order-form" className="px-6 py-2 bg-camel-600 hover:bg-camel-700 text-white rounded-lg font-bold shadow-lg shadow-camel-500/30 flex items-center gap-2">
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