import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiImage, FiLayers } from 'react-icons/fi';
import { fileService } from '../services/fileService';

const ProductoModal = ({ show, onClose, onSave, editingProduct, categorias, colors }) => {
  const tallesRopa = ['U', 'S', 'M', 'L', 'XL', 'XXL'];
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', precio: '', categoriaId: '' });
  const [variantes, setVariantes] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        nombre: editingProduct.nombre,
        descripcion: editingProduct.descripcion || '',
        precio: editingProduct.precio,
        categoriaId: editingProduct.categoriaId,
        imagenes: editingProduct.imagenes || []
      });
      setVariantes(editingProduct.variantes?.map(v => ({
        color: v.color,
        stock: v.stockPorTalle || {}
      })) || []);
    } else {
      setFormData({ nombre: '', descripcion: '', precio: '', categoriaId: categorias[0]?.id || '', imagenes: [] });
      setVariantes([{ color: '', stock: {} }]);
    }
  }, [editingProduct, categorias, show]);

  const addColorRow = () => setVariantes([...variantes, { color: '', stock: {} }]);
  const removeColorRow = (index) => setVariantes(variantes.filter((_, i) => i !== index));

  const updateStock = (colorIndex, talle, value) => {
    const newVars = [...variantes];
    newVars[colorIndex].stock[talle] = value === '' ? 0 : Number(value);
    setVariantes(newVars);
  };

  const getUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#4a3b2a]/80 backdrop-blur-md">
      {/* Background Immersivo: Usa la imagen del producto como fondo de la modal */}
      <div className="absolute inset-0 z-0 opacity-20 transition-all duration-500"
           style={{ backgroundImage: `url(${getUrl(formData.imagenes?.[0])})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      </div>

      <div className="relative z-10 bg-white/95 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20">
        
        {/* Header con estilo de revista */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="text-2xl font-black text-[#4a3b2a] tracking-tighter uppercase">Gestión de Activos</h3>
            <p className="text-xs font-bold text-[#d8bf9f]">{formData.nombre || 'NUEVO PRODUCTO'}</p>
          </div>
          <button onClick={onClose} className="bg-gray-100 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition"><FiX size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Columna 1: Galería y Visuales */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#4a3b2a] font-bold text-sm uppercase mb-4">
                <FiImage /> Galería de Imágenes
              </div>
              <div className="grid grid-cols-2 gap-2">
                {formData.imagenes?.map((img, i) => (
                  <div key={i} className={`relative group rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-[#4a3b2a]' : 'border-transparent'}`}>
                    <img src={getUrl(img)} className="h-32 w-full object-cover" alt="Gallery" />
                    {i === 0 && <span className="absolute bottom-1 right-1 bg-[#4a3b2a] text-[#d8bf9f] text-[8px] px-1 rounded">PRINCIPAL</span>}
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition">
                   <FiPlus className="text-gray-400" />
                   <span className="text-[10px] font-bold text-gray-400">AÑADIR</span>
                   <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                </label>
              </div>
            </div>

            {/* Columna 2 y 3: Matriz de Variantes */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-[#4a3b2a] font-bold text-sm uppercase">
                  <FiLayers /> Matriz de Stock por Variante
                </div>
                <button type="button" onClick={addColorRow} className="text-[10px] bg-[#4a3b2a] text-[#d8bf9f] px-4 py-2 rounded-full font-black hover:scale-105 transition uppercase tracking-widest">
                  Nuevo Color
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variantes.map((v, idx) => {
                   const totalStockColor = Object.values(v.stock || {}).reduce((a, b) => a + b, 0);
                   return (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <input 
                          placeholder="NOMBRE DEL COLOR"
                          className="font-black text-[#4a3b2a] outline-none border-b border-transparent focus:border-[#d8bf9f] bg-transparent uppercase text-sm w-2/3"
                          value={v.color}
                          onChange={(e) => {
                            const n = [...variantes];
                            n[idx].color = e.target.value;
                            setVariantes(n);
                          }}
                        />
                        <div className="text-right">
                           <span className="block text-[8px] font-bold text-gray-400 uppercase">Total Color</span>
                           <span className="font-black text-xs text-[#4a3b2a]">{totalStockColor} Un.</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-1">
                        {tallesRopa.map(t => (
                          <div key={t} className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-gray-400">{t}</span>
                            <input 
                              type="number"
                              className="w-full text-center bg-gray-50 rounded py-1 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-[#d8bf9f] outline-none"
                              value={v.stock?.[t] || ''}
                              onChange={(e) => updateStock(idx, t, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => removeColorRow(idx)} className="mt-4 text-[10px] text-red-300 hover:text-red-500 font-bold uppercase tracking-tighter">Eliminar Variante</button>
                    </div>
                   );
                })}
              </div>
            </div>

          </div>

          {/* Sección de Datos Generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre Comercial</label>
                <input className="w-full border-b-2 border-gray-100 focus:border-[#4a3b2a] outline-none py-2 font-bold text-[#4a3b2a]" value={formData.nombre} />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría</label>
                <select className="w-full border-b-2 border-gray-100 focus:border-[#4a3b2a] outline-none py-2 font-bold text-[#4a3b2a] bg-transparent">
                   {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio Final</label>
                <div className="flex items-center border-b-2 border-gray-100 focus-within:border-[#4a3b2a]">
                   <span className="font-bold text-[#4a3b2a]">$</span>
                   <input className="w-full outline-none py-2 px-2 font-bold text-[#4a3b2a]" value={formData.precio} />
                </div>
             </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 flex justify-between items-center">
           <div className="text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Resumen de Carga</span>
              <span className="text-xl font-black text-[#4a3b2a] uppercase">Stock Total: {variantes.reduce((acc, v) => acc + Object.values(v.stock).reduce((s, val) => s + val, 0), 0)} Unidades</span>
           </div>
           <div className="flex gap-4">
              <button onClick={onClose} className="px-8 py-3 font-bold text-gray-400 hover:text-gray-600 transition uppercase text-sm">Descartar</button>
              <button className="bg-[#4a3b2a] text-[#d8bf9f] px-10 py-3 rounded-2xl font-black shadow-xl shadow-[#4a3b2a]/20 hover:bg-black hover:-translate-y-1 transition uppercase text-sm tracking-widest">
                Guardar Cambios
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;