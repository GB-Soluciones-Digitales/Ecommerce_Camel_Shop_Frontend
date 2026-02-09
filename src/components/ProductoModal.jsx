import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiImage, FiLayers, FiUploadCloud } from 'react-icons/fi';
import { fileService } from '../services/fileService';

const ProductoModal = ({ show, onClose, onSave, editingProduct, categorias }) => {
  const tallesRopa = ['U', 'S', 'M', 'L', 'XL', 'XXL'];
  const [uploading, setUploading] = useState(false);
  
  const [existingImages, setExistingImages] = useState([]); 
  const [newFiles, setNewFiles] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', precio: '', categoriaId: '',
  });

  const [variantes, setVariantes] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        nombre: editingProduct.nombre,
        descripcion: editingProduct.descripcion || '',
        precio: editingProduct.precio,
        categoriaId: editingProduct.categoriaId,
      });
      
      setExistingImages(editingProduct.imagenes || []);
      setNewFiles([]);

      const variantesFormateadas = editingProduct.variantes?.map(v => ({
        color: v.color || '',
        stock: v.stockPorTalle || {} 
      })) || [];
      
      setVariantes(variantesFormateadas.length > 0 ? variantesFormateadas : [{ color: '', stock: {} }]);
    } else {
      setFormData({ nombre: '', descripcion: '', precio: '', categoriaId: categorias[0]?.id || '' });
      setVariantes([{ color: '', stock: {} }]); 
      setExistingImages([]);
      setNewFiles([]);
    }
  }, [editingProduct, categorias, show]);

  const addColorRow = () => setVariantes([...variantes, { color: '', stock: {} }]);
  
  const removeColorRow = (index) => setVariantes(variantes.filter((_, i) => i !== index));

  const updateVariante = (index, field, value) => {
    const newVars = [...variantes];
    newVars[index] = { ...newVars[index], [field]: value };
    setVariantes(newVars);
  };

  const updateStock = (colorIndex, talle, value) => {
    const newVars = [...variantes];
    const newStock = { ...newVars[colorIndex].stock };
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    newStock[talle] = isNaN(numericValue) ? 0 : numericValue;
    newVars[colorIndex] = { ...newVars[colorIndex], stock: newStock };
    setVariantes(newVars);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);
        setNewFiles(prev => [...prev, { file, preview }]);
    }
  };

  const removeNewFile = (index) => {
      setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
      setExistingImages(prev => prev.filter(img => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const item of newFiles) {
          const uploadRes = await fileService.uploadImage(item.file);
          uploadedUrls.push(uploadRes.filename);
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      const totalStock = variantes.reduce((acc, v) => {
        return acc + Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
      }, 0);

      const payload = {
        ...formData,
        imagenes: finalImages,
        stock: totalStock,
        variantes: variantes.map(v => ({
            color: v.color,
            stockPorTalle: v.stock
        })),
        precio: parseFloat(formData.precio),
        categoriaId: parseInt(formData.categoriaId)
      };

      await onSave(payload);
    } catch (error) {
      console.error(error);
      alert("Error al procesar el producto");
    } finally {
      setUploading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/80 backdrop-blur-md">

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col border border-white/20">
        
        <div className={`px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-sm`}>
          <div>
            <h3 className="text-xl font-black text-[#4a3b2a] uppercase tracking-tight">
                {editingProduct ? 'Editar Producto' : 'Crear Producto'}
            </h3>
            <p className="text-xs font-bold text-[#d8bf9f] uppercase tracking-widest">Panel de Gestión</p>
          </div>
          <button onClick={onClose} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition"><FiX size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 bg-white/90">
          
          {/* DATOS BÁSICOS & GALERÍA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Galería Visual */}
             <div className="lg:col-span-1 space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <FiImage /> Galería ({existingImages.length + newFiles.length})
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                    {/* Imágenes Existentes */}
                    {existingImages.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                            <img src={img.startsWith('http') ? img : fileService.getImageUrl(img)} className="w-full h-full object-cover" alt="preview" />
                            <button type="button" onClick={() => removeExistingImage(img)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"><FiTrash2 size={10}/></button>
                        </div>
                    ))}
                    
                    {/* Imágenes Nuevas */}
                    {newFiles.map((item, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-[#d8bf9f] border-dashed">
                            <img src={item.preview} className="w-full h-full object-cover opacity-80" alt="new" />
                            <button type="button" onClick={() => removeNewFile(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm"><FiX size={10}/></button>
                            <span className="absolute bottom-1 left-1 bg-[#d8bf9f] text-[#4a3b2a] text-[8px] font-bold px-1 rounded">NUEVA</span>
                        </div>
                    ))}

                    {/* Botón Subir */}
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#4a3b2a] hover:bg-gray-50 transition group">
                        <FiPlus className="text-gray-400 group-hover:text-[#4a3b2a]" size={24}/>
                        <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">Agregar</span>
                        <input type="file" onChange={handleFileSelect} className="hidden" accept="image/*" />
                    </label>
                </div>
             </div>

             {/* Datos Principales */}
             <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nombre</label>
                        <input required className="w-full border-b-2 border-gray-200 focus:border-[#4a3b2a] outline-none py-2 font-bold text-[#4a3b2a] bg-transparent text-lg"
                            value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Remera Camel" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Categoría</label>
                        <select required className="w-full border-b-2 border-gray-200 focus:border-[#4a3b2a] outline-none py-2 font-bold text-[#4a3b2a] bg-transparent"
                            value={formData.categoriaId} onChange={e => setFormData({...formData, categoriaId: e.target.value})}>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descripción</label>
                    <textarea rows="3" className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#4a3b2a] text-sm text-gray-600 bg-gray-50"
                        value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} placeholder="Detalles del producto..." />
                </div>

                <div className="space-y-1 w-1/3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Precio</label>
                    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#4a3b2a]">
                        <span className="font-bold text-[#4a3b2a] mr-2">$</span>
                        <input required type="number" step="0.01" className="w-full outline-none py-2 font-bold text-[#4a3b2a] text-xl bg-transparent"
                            value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
                    </div>
                </div>
             </div>
          </div>

          {/* MATRIZ DE STOCK */}
          <div className="border-t border-gray-100 pt-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#4a3b2a]">
                 <FiLayers size={20} />
                 <h4 className="font-black uppercase tracking-tight text-lg">Control de Stock</h4>
              </div>
              <button type="button" onClick={addColorRow} className="text-xs bg-[#4a3b2a] text-[#d8bf9f] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black transition font-bold uppercase tracking-wider shadow-lg shadow-[#4a3b2a]/20">
                <FiPlus /> Nuevo Color
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variantes.map((v, idx) => {
                const totalColor = Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val)||0), 0);
                
                return (
                <div key={idx} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-2/3">
                       <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Nombre del Color</label>
                       <input 
                         placeholder="Ej: Negro Mate"
                         className="w-full border-b border-gray-200 focus:border-[#4a3b2a] outline-none font-bold text-[#4a3b2a] py-1 bg-transparent"
                         value={v.color}
                         onChange={(e) => updateVariante(idx, 'color', e.target.value)}
                       />
                    </div>
                    <div className="text-right">
                       <span className="block text-[9px] font-black text-gray-300 uppercase">Total</span>
                       <span className={`text-lg font-black ${totalColor > 0 ? 'text-[#4a3b2a]' : 'text-red-400'}`}>{totalColor}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {tallesRopa.map(talle => (
                      <div key={talle} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-gray-400">{talle}</span>
                        <input 
                          type="number" 
                          className={`w-full text-center border rounded-md py-1 text-xs font-bold outline-none focus:ring-1 focus:ring-[#d8bf9f] ${v.stock?.[talle] > 0 ? 'bg-[#f9f5f0] border-[#d8bf9f] text-[#4a3b2a]' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                          value={v.stock?.[talle] || ''} 
                          onChange={(e) => updateStock(idx, talle, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                     <button type="button" onClick={() => removeColorRow(idx)} className="text-red-300 hover:text-red-500 text-[10px] font-bold uppercase flex items-center gap-1 transition">
                        <FiTrash2 /> Eliminar Variante
                     </button>
                  </div>
                </div>
              )})}
            </div>
          </div>

        </form>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
           <div className="text-sm text-gray-500 font-medium">
              {uploading ? (
                  <span className="flex items-center gap-2 text-[#4a3b2a] animate-pulse"><FiUploadCloud /> Subiendo imágenes...</span>
              ) : (
                  <span>Listo para guardar</span>
              )}
           </div>
           <div className="flex gap-3">
             <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-500 font-bold hover:text-gray-800 transition">Cancelar</button>
             <button type="submit" onClick={handleSubmit} disabled={uploading} className="bg-[#4a3b2a] text-[#d8bf9f] px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed">
               {uploading ? 'Procesando...' : 'Confirmar Cambios'}
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductoModal;