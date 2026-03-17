import React, { useReducer, useId } from 'react';
import { FiX, FiPlus, FiTrash2, FiCheck, FiUser, FiMapPin, FiSmartphone } from 'react-icons/fi';
import { orderReducer, initialOrderState } from '../../components/OrderReducer';
import { sileo } from 'sileo';

const CreateOrderModal = ({ isOpen, onClose, productos, onSave }) => {
  const [state, dispatch] = useReducer(orderReducer, initialOrderState);
  const baseId = useId();

  if (!isOpen) return null;

  const selectedProduct = productos.find(p => p.id === parseInt(state.tempItem.productoId));
  const availableColors = selectedProduct?.variantes?.map(v => v.color) || [];
  const selectedVariant = selectedProduct?.variantes?.find(v => v.color === state.tempItem.color);
  const availableSizes = selectedVariant ? Object.keys(selectedVariant.stockPorTalle) : [];
  const currentStock = (selectedVariant && state.tempItem.talle) 
    ? selectedVariant.stockPorTalle[state.tempItem.talle] 
    : 0;

  const handleAddItem = () => {
    if (!selectedProduct || !state.tempItem.talle) return;
    
    const newItem = {
      productoId: selectedProduct.id,
      nombre: selectedProduct.nombre,
      cantidad: parseInt(state.tempItem.cantidad),
      precio: selectedProduct.precio,
      selectedSize: `${state.tempItem.color} - ${state.tempItem.talle}`,
      uniqueKey: `${selectedProduct.id}-${state.tempItem.color}-${state.tempItem.talle}-${Date.now()}`
    };
    dispatch({ type: 'ADD_ITEM', item: newItem });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.items.length === 0) {
      return sileo.error({ 
        title: "Selección vacía", 
        description: "Agregá al menos un artículo para generar la orden." 
      });
    }
    onSave(state);
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-md">
      <div className="bg-crema rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border border-brand-muted" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-brand-muted flex justify-between items-center bg-white">
          <div>
            <h3 className="font-serif font-bold text-2xl text-brand-dark">Registrar Pedido</h3>
            <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">Gestión de Venta Interna</p>
          </div>
          <button onClick={onClose} className="text-brand-secondary hover:text-brand-dark p-2 hover:bg-brand-light rounded-full transition-all">
            <FiX size={28}/>
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 space-y-10">
          <form id="manual-order-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Sección Cliente */}
            <section className="bg-white p-8 rounded-[2rem] border border-brand-muted shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                  <FiUser size={14}/>
                </div>
                <h4 className="font-bold text-xs text-brand-dark uppercase tracking-[0.2em]">Información del Cliente</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FiUser size={10}/> Nombre Completo
                  </label>
                  <input className="w-full bg-crema/50 border border-brand-muted rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium" 
                    required placeholder="Ej: Julian Alvarez"
                    value={state.nombreCliente} onChange={e => dispatch({type:'SET_FIELD', field:'nombreCliente', value: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FiSmartphone size={10}/> Teléfono / WhatsApp
                  </label>
                  <input className="w-full bg-crema/50 border border-brand-muted rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium" 
                    required placeholder="Ej: +54 9 11..."
                    value={state.telefono} onChange={e => dispatch({type:'SET_FIELD', field:'telefono', value: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FiMapPin size={10}/> Dirección de Envío
                </label>
                <input className="w-full bg-crema/50 border border-brand-muted rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium" 
                  required placeholder="Calle, Número, Localidad..."
                  value={state.direccionEnvio} onChange={e => dispatch({type:'SET_FIELD', field:'direccionEnvio', value: e.target.value})} />
              </div>
            </section>

            {/* Selector de Productos */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary"><FiPlus size={14}/></div>
                <h4 className="font-bold text-xs text-brand-dark uppercase tracking-[0.2em]">Selección de Artículos</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-brand-primary p-6 rounded-[2rem] shadow-2xl items-end border-4 border-white">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[11px] font-black text-crema/60 uppercase tracking-widest ml-1">Producto</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:bg-white/20 transition-all"
                    value={state.tempItem.productoId} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { productoId: e.target.value, color: '', talle: '', cantidad: 1 }})}>
                    <option value="" className="text-brand-dark">Buscar producto...</option>
                    {productos.map(p => <option key={p.id} value={p.id} className="text-brand-dark">{p.nombre}</option>)}
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-black text-crema/60 uppercase tracking-widest ml-1">Color</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:bg-white/20 transition-all disabled:opacity-30" 
                    disabled={!selectedProduct}
                    value={state.tempItem.color} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { color: e.target.value, talle: '' }})}>
                    <option value="" className="text-brand-dark">Elegir...</option>
                    {availableColors.map(c => <option key={c} value={c} className="text-brand-dark">{c}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-crema/60 uppercase tracking-widest ml-1">Talle</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:bg-white/20 transition-all disabled:opacity-30" 
                    disabled={!state.tempItem.color}
                    value={state.tempItem.talle} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { talle: e.target.value }})}>
                    <option value="" className="text-brand-dark">...</option>
                    {availableSizes.map(t => <option key={t} value={t} className="text-brand-dark">{t}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-crema/60 uppercase tracking-widest ml-1 flex justify-between">
                    Cant. {currentStock > 0 && <span className="text-emerald-400">Max: {currentStock}</span>}
                  </label>
                  <input type="number" min="1" max={currentStock} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:bg-white/20 transition-all" 
                    value={state.tempItem.cantidad} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { cantidad: e.target.value }})} />
                </div>

                <div className="md:col-span-1">
                  <button type="button" onClick={handleAddItem} disabled={!state.tempItem.talle || currentStock === 0}
                    className="w-full h-[48px] bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-all flex items-center justify-center shadow-lg transform active:scale-95 disabled:opacity-20 disabled:grayscale">
                    <FiPlus size={24}/>
                  </button>
                </div>
              </div>
            </section>

            {/* Tabla de Items */}
            {state.items.length > 0 && (
              <div className="bg-white border border-brand-muted rounded-[2rem] overflow-hidden shadow-inner">
                <table className="w-full text-sm">
                  <thead className="bg-brand-light/30 text-xs font-black text-brand-secondary uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5 text-left">Producto</th>
                      <th className="px-8 py-5 text-center">Unidades</th>
                      <th className="px-8 py-5 text-right">Subtotal</th>
                      <th className="px-8 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-muted">
                    {state.items.map((item, idx) => (
                      <tr key={item.uniqueKey} className="hover:bg-crema/20 transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-bold text-brand-dark">{item.nombre}</p>
                          <p className="text-xs text-brand-primary font-black uppercase tracking-tighter">{item.selectedSize}</p>
                        </td>
                        <td className="px-8 py-5 text-center font-bold text-brand-dark text-lg">{item.cantidad}</td>
                        <td className="px-8 py-5 text-right font-serif font-bold text-brand-dark text-xl">${(item.precio * item.cantidad).toLocaleString()}</td>
                        <td className="px-8 py-5 text-right">
                          <button type="button" onClick={() => dispatch({type:'REMOVE_ITEM', index: idx})} className="text-rose-400 hover:text-rose-600 p-2 transition-transform hover:scale-110">
                            <FiTrash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-black text-brand-secondary uppercase tracking-[0.2em]">Total Final</span>
              <span className="text-3xl font-serif font-bold text-brand-dark">
                ${state.items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0).toLocaleString()}
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-brand-muted flex justify-between items-center bg-brand-light/50">
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 text-brand-secondary font-bold text-xs uppercase tracking-widest hover:text-brand-dark transition-colors">
              Cancelar
            </button>
            <button type="submit" form="manual-order-form" className="bg-brand-dark text-crema px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:bg-black transition-all transform hover:-translate-y-1">
              <FiCheck size={18}/> Confirmar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;