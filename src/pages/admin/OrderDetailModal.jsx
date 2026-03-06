import React from 'react';
import { FiX, FiUser, FiPhone, FiMapPin, FiCreditCard, FiUpload, FiCheck, FiPackage, FiImage, FiFileText } from 'react-icons/fi';
import { fileService } from '../../services/fileService';

const OrderDetailModal = ({ isOpen, pedido, onClose, onStatusChange, onFileUpload }) => {
  if (!isOpen || !pedido) return null;

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-md" onClick={onClose}>
      <div className="bg-crema rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-brand-muted max-h-[92vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header Premium */}
        <div className="px-8 py-6 border-b border-brand-muted flex justify-between items-center bg-white">
          <div>
            <div className="flex items-center gap-4 mb-1">
              <h3 className="font-serif font-bold text-2xl text-brand-dark">Pedido #{pedido.id}</h3>
              {getStatusBadge(pedido.estado)}
            </div>
            <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">{new Date(pedido.fecha).toLocaleString()}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar detalle" className="text-brand-secondary hover:text-brand-dark p-2 hover:bg-brand-light rounded-full transition-all">
            <FiX size={28}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Cliente */}
            <div className="bg-white p-6 rounded-[2rem] border border-brand-muted shadow-sm space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-brand-secondary uppercase tracking-widest border-b border-brand-muted pb-2">
                 <FiUser /> Información del Cliente
              </h4>
              <div className="space-y-1">
                <p className="font-bold text-brand-dark text-lg">{pedido.nombreCliente || 'Cliente Final'}</p>
                <a href={`https://wa.me/${pedido.telefono?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-2 w-fit">
                  <FiPhone size={14}/> {pedido.telefono || 'Sin teléfono'}
                </a>
              </div>
            </div>

            {/* Envío y Pago */}
            <div className="bg-white p-6 rounded-[2rem] border border-brand-muted shadow-sm space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-brand-secondary uppercase tracking-widest border-b border-brand-muted pb-2">
                <FiMapPin /> Envío y Pago
              </h4>
              <div className="space-y-3">
                <p className="text-sm font-medium text-brand-dark leading-tight flex items-start gap-2">
                  <span className="mt-0.5 text-brand-secondary"><FiMapPin size={14}/></span>
                  {pedido.direccionEnvio || 'Retiro en Local'}
                </p>
                <div className="flex items-center gap-2">
                  <FiCreditCard className="text-brand-secondary" size={14} />
                  <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest bg-brand-light px-3 py-1 rounded-md border border-brand-muted">
                    {pedido.metodoPago || 'A convenir'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items a Preparar */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary"><FiPackage size={14}/></div>
                <h4 className="font-bold text-xs text-brand-dark uppercase tracking-[0.2em]">Artículos a Preparar</h4>
              </div>
            
            <div className="bg-white border border-brand-muted rounded-[2rem] overflow-hidden shadow-inner divide-y divide-brand-muted">
              {pedido.detalles?.map((detalle) => (
                <div key={`${pedido.id}-${detalle.id || Math.random()}`} className="flex items-center gap-6 p-6 hover:bg-crema/20 transition-colors">
                  <div className="w-16 h-20 bg-brand-light rounded-xl overflow-hidden flex-shrink-0 border border-brand-muted">
                    {detalle.producto?.imagenes?.[0] ? (
                        <img 
                            src={getImgUrl(detalle.producto?.imagenes?.[0])} 
                            alt={detalle.producto?.nombre || "Imagen del producto"} 
                            className="w-full h-full object-cover mix-blend-multiply"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=IMG'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex justify-center items-center"><FiImage className="text-brand-muted" size={20}/></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-bold text-brand-dark text-base mb-1">{detalle.producto?.nombre}</h5>
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest bg-brand-light px-2 py-1 rounded">
                      {detalle.talleSeleccionado || 'Único'}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-1">Unidades</div>
                    <div className="text-2xl font-serif font-bold text-brand-dark">{detalle.cantidad}</div>
                  </div>
                </div>
              ))}
              
              {(!pedido.detalles || pedido.detalles.length === 0) && (
                <div className="p-8 text-center text-brand-secondary text-sm font-medium">No hay detalles de artículos para este pedido.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Premium y Acciones */}
        <div className="px-8 py-6 border-t border-brand-muted flex justify-between items-center bg-brand-light/50 flex-wrap gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em]">Total Bruto</span>
            <span className="text-3xl font-serif font-bold text-brand-dark">${pedido.total?.toLocaleString()}</span>
          </div>
          
          <div className="flex gap-4 flex-wrap items-center">
            {/* Upload File Button */}
            <div className="relative flex items-center">
              <input type="file" id="modal-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => onFileUpload(e, pedido.id)} accept="image/*,.pdf"/>
              <label htmlFor="modal-upload" className={`px-6 py-3.5 bg-white border ${pedido.facturaUrl ? 'border-brand-primary text-brand-primary' : 'border-brand-muted text-brand-dark'} rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all hover:border-brand-dark hover:shadow-md flex items-center gap-2`}>
                <FiUpload size={14} /> {pedido.facturaUrl ? 'Actualizar Factura' : 'Adjuntar Factura'}
              </label>
            </div>
            {pedido.facturaUrl && (
              <a href={getImgUrl(pedido.facturaUrl)} target="_blank" rel="noreferrer" className="text-brand-primary hover:text-brand-dark p-3 bg-white rounded-full border border-brand-muted shadow-sm transition-all" title="Ver Factura">
                <FiFileText size={18}/>
              </a>
            )}

            {/* Action Buttons based on Status */}
            {pedido.estado === 'PENDIENTE' && (
              <button onClick={() => onStatusChange(pedido.id, 'CONFIRMADO')} className="bg-brand-dark text-crema px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1 flex items-center gap-2">
                <FiCheck size={18}/> Confirmar Pedido
              </button>
            )}
            {pedido.estado === 'CONFIRMADO' && (
              <button onClick={() => onStatusChange(pedido.id, 'ENVIADO')} className="bg-brand-primary text-crema px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-dark transition-all transform hover:-translate-y-1 flex items-center gap-2">
                <FiPackage size={18}/> Marcar Enviado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;