import React, { useReducer, useId } from 'react';
import { FiX, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import { orderReducer, initialOrderState } from '../components/OrderReducer';

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
    if (state.items.length === 0) return alert("Agregá al menos un producto");
    onSave(state);
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-[#d8bf9f]" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[#d8bf9f]/30 flex justify-between items-center bg-[#f9f5f0]">
          <h3 className="font-bold text-xl text-[#4a3b2a]">Nuevo Pedido Manual</h3>
          <button onClick={onClose} className="text-[#4a3b2a] hover:opacity-50"><FiX size={24}/></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="manual-order-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
              <h4 className="font-bold text-xs text-[#4a3b2a] uppercase tracking-widest border-b border-gray-200 pb-2">Datos del Cliente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor={`${baseId}-nombre`} className="text-xs font-bold text-gray-500">NOMBRE COMPLETO</label>
                  <input id={`${baseId}-nombre`} placeholder="Ej: Juan Perez" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]" required 
                    value={state.nombreCliente} onChange={e => dispatch({type:'SET_FIELD', field:'nombreCliente', value: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label htmlFor={`${baseId}-tel`} className="text-xs font-bold text-gray-500">TELÉFONO</label>
                  <input id={`${baseId}-tel`} placeholder="WhatsApp" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]" required 
                    value={state.telefono} onChange={e => dispatch({type:'SET_FIELD', field:'telefono', value: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor={`${baseId}-dir`} className="text-xs font-bold text-gray-500">DIRECCIÓN DE ENVÍO</label>
                <input id={`${baseId}-dir`} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]" required 
                  value={state.direccionEnvio} onChange={e => dispatch({type:'SET_FIELD', field:'direccionEnvio', value: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs text-[#4a3b2a] uppercase tracking-widest border-b border-gray-200 pb-2">Agregar Productos</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-[#f9f5f0] p-4 rounded-xl border border-[#d8bf9f]/30 items-end">
                <div className="md:col-span-4 space-y-1">
                  <label htmlFor={`${baseId}-prod`} className="text-[10px] font-bold text-gray-400">PRODUCTO</label>
                  <select id={`${baseId}-prod`} className="w-full border rounded-lg px-3 py-2 bg-white text-sm" 
                    value={state.tempItem.productoId} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { productoId: e.target.value, color: '', talle: '', cantidad: 1 }})}>
                    <option value="">Seleccionar...</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label htmlFor={`${baseId}-color`} className="text-[10px] font-bold text-gray-400">COLOR</label>
                  <select id={`${baseId}-color`} className="w-full border rounded-lg px-3 py-2 bg-white text-sm" disabled={!selectedProduct}
                    value={state.tempItem.color} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { color: e.target.value, talle: '' }})}>
                    <option value="">Elegir...</option>
                    {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor={`${baseId}-talle`} className="text-[10px] font-bold text-gray-400">TALLE</label>
                  <select id={`${baseId}-talle`} className="w-full border rounded-lg px-3 py-2 bg-white text-sm" disabled={!state.tempItem.color}
                    value={state.tempItem.talle} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { talle: e.target.value }})}>
                    <option value="">...</option>
                    {availableSizes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor={`${baseId}-cant`} className="text-[10px] font-bold text-gray-400 flex justify-between">
                    CANT. {currentStock > 0 && <span className="text-green-600">Max: {currentStock}</span>}
                  </label>
                  <input id={`${baseId}-cant`} type="number" min="1" max={currentStock} className="w-full border rounded-lg px-3 py-2 text-sm" 
                    value={state.tempItem.cantidad} onChange={e => dispatch({type:'SET_TEMP_ITEM', payload: { cantidad: e.target.value }})} />
                </div>
                <div className="md:col-span-1">
                  <button type="button" onClick={handleAddItem} disabled={!state.tempItem.talle || currentStock === 0}
                    className="w-full bg-[#4a3b2a] text-[#d8bf9f] py-2 rounded-lg hover:bg-black transition flex justify-center disabled:opacity-30"><FiPlus /></button>
                </div>
              </div>
            </div>

            {state.items.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                    <tr><th className="px-4 py-2">Producto</th><th className="px-4 py-2">Cant</th><th className="px-4 py-2">Subtotal</th><th className="px-4 py-2"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {state.items.map((item, idx) => (
                      <tr key={item.uniqueKey} className="bg-white">
                        <td className="px-4 py-2 font-medium">{item.nombre} <span className="text-xs text-gray-400">({item.selectedSize})</span></td>
                        <td className="px-4 py-2">{item.cantidad}</td>
                        <td className="px-4 py-2 font-bold">${(item.precio * item.cantidad).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          <button type="button" onClick={() => dispatch({type:'REMOVE_ITEM', index: idx})} className="text-red-400 hover:text-red-600"><FiTrash2/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-6 py-2 text-gray-500 font-bold">Cancelar</button>
          <button type="submit" form="manual-order-form" className="px-8 py-2 bg-[#4a3b2a] text-[#d8bf9f] rounded-xl font-bold shadow-lg flex items-center gap-2">
            <FiCheck /> Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;