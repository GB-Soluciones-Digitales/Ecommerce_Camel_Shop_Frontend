import React from 'react';
import { FiX, FiUser, FiPhone, FiMapPin, FiCreditCard, FiUpload, FiCheck, FiPackage } from 'react-icons/fi';
import { fileService } from '../services/fileService';

const OrderDetailModal = ({ isOpen, pedido, onClose, onStatusChange, onFileUpload }) => {
  if (!isOpen || !pedido) return null;

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-[#d8bf9f] max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-8 py-6 bg-[#f9f5f0] border-b border-[#d8bf9f]/30 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-black text-[#4a3b2a]">Pedido #{pedido.id}</h3>
              {getStatusBadge(pedido.estado)}
            </div>
            <p className="text-sm text-gray-500">{new Date(pedido.fecha).toLocaleString()}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar detalle" className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-600 shadow-sm transition">
            <FiX size={20}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Cliente</h4>
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg text-[#4a3b2a]"><FiUser /></div>
                <div>
                  <p className="font-bold text-gray-800">{pedido.nombreCliente}</p>
                  <a href={`https://wa.me/${pedido.telefono?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline flex items-center gap-1">
                    <FiPhone size={12}/> {pedido.telefono}
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Envío y Pago</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg text-[#4a3b2a]"><FiMapPin /></div>
                  <p className="text-sm text-gray-600 font-medium">{pedido.direccionEnvio}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg text-[#4a3b2a]"><FiCreditCard /></div>
                  <span className="bg-[#f9f5f0] text-[#4a3b2a] text-xs font-bold px-3 py-1 rounded-full border border-[#d8bf9f]/30">
                    {pedido.metodoPago}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Items a Preparar</h4>
            <div className="space-y-3">
              {pedido.detalles?.map((detalle) => (
                <div key={`${pedido.id}-${detalle.id || Math.random()}`} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white hover:border-[#d8bf9f]/50 transition">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img 
                      src={getImgUrl(detalle.producto?.imagenes?.[0])} 
                      alt={detalle.producto?.nombre || "Imagen del producto"} // Arregla error 'Missing alt'
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=IMG'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-[#4a3b2a]">{detalle.producto?.nombre}</h5>
                    <span className="bg-[#4a3b2a] text-[#d8bf9f] text-xs font-bold px-2 py-0.5 rounded">
                      {detalle.talleSeleccionado || 'Único'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase font-bold">Cant.</div>
                    <div className="text-xl font-black text-[#4a3b2a]">{detalle.cantidad}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-left">
            <span className="text-xs font-bold text-gray-400 uppercase block">Total</span>
            <span className="text-2xl font-black text-[#4a3b2a]">${pedido.total?.toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <input type="file" id="modal-upload" className="hidden" onChange={(e) => onFileUpload(e, pedido.id)} accept="image/*,.pdf"/>
              <label htmlFor="modal-upload" className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition flex items-center gap-2">
                <FiUpload /> {pedido.facturaUrl ? 'Cambiar Factura' : 'Subir Factura'}
              </label>
            </div>
            {pedido.estado === 'PENDIENTE' && (
              <button onClick={() => onStatusChange(pedido.id, 'CONFIRMADO')} className="bg-[#4a3b2a] text-[#d8bf9f] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition flex items-center gap-2 shadow-lg">
                <FiCheck /> Confirmar
              </button>
            )}
            {pedido.estado === 'CONFIRMADO' && (
              <button onClick={() => onStatusChange(pedido.id, 'ENVIADO')} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition flex items-center gap-2 shadow-lg">
                <FiPackage /> Marcar Enviado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;