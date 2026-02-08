import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { fileService } from '../services/fileService';

const ProductoModal = ({ show, onClose, onSave, editingProduct, categorias, colors }) => {
  const tallesRopa = ['U', 'S', 'M', 'L', 'XL', 'XXL'];
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
      // Aseguramos que stockPorTalle se mapee a stock para el frontend
      const variantesFormateadas = editingProduct.variantes?.map(v => ({
        color: v.color || '',
        stock: v.stockPorTalle || {} 
      })) || [];
      
      setVariantes(variantesFormateadas.length > 0 ? variantesFormateadas : [{ color: '', stock: {} }]);
    } else {
      setFormData({ nombre: '', descripcion: '', precio: '', categoriaId: categorias[0]?.id || '' });
      setVariantes([{ color: '', stock: {} }]); 
      setSelectedFile(null);
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
    // Copia profunda para asegurar inmutabilidad
    const newVars = [...variantes];
    const newStock = { ...newVars[colorIndex].stock };
    
    // Convertimos a entero, si es vacío o inválido, guardamos 0
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    newStock[talle] = isNaN(numericValue) ? 0 : numericValue;
    
    newVars[colorIndex] = { ...newVars[colorIndex], stock: newStock };
    setVariantes(newVars);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = editingProduct?.imagenUrl;
      if (selectedFile) {
        const uploadRes = await fileService.uploadImage(selectedFile);
        finalImageUrl = uploadRes.filename;
      }

      // Calculamos el total sumando todos los talles de todos los colores
      const totalStock = variantes.reduce((acc, v) => {
        const stockVariante = Object.values(v.stock || {}).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        return acc + stockVariante;
      }, 0);

      // Preparamos el payload para el backend
      // IMPORTANTE: Mapeamos 'stock' del front a 'stockPorTalle' del DTO Java
      const payload = {
        ...formData,
        imagenUrl: finalImageUrl,
        stock: totalStock,
        variantes: variantes.map(v => ({
            color: v.color,
            stockPorTalle: v.stock // El backend espera este nombre
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col border border-[#d8bf9f]">
        
        <div className={`px-6 py-4 border-b border-[#d8bf9f]/30 flex justify-between items-center bg-[#f9f5f0]`}>
          <h3 className={`font-bold text-lg text-[#4a3b2a]`}>
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="text-[#4a3b2a] hover:opacity-70"><FiX size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4a3b2a] uppercase">Nombre</label>
              <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]"
                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4a3b2a] uppercase">Categoría</label>
              <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white focus:border-[#4a3b2a]"
                value={formData.categoriaId} onChange={e => setFormData({...formData, categoriaId: e.target.value})}>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4a3b2a] uppercase">Precio ($)</label>
              <input required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]"
                value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4a3b2a] uppercase">Imagen Principal</label>
              <input type="file" onChange={e => setSelectedFile(e.target.files[0])} className="text-sm w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#d8bf9f]/30 pb-2">
              <label className="text-sm font-bold text-[#4a3b2a]">GESTIÓN DE STOCK (COLOR Y TALLE)</label>
              <button type="button" onClick={addColorRow} className="text-xs bg-[#4a3b2a] text-[#d8bf9f] px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black transition">
                <FiPlus /> Agregar Color
              </button>
            </div>

            <div className="space-y-3">
              {variantes.map((v, idx) => (
                <div key={idx} className="p-4 bg-[#f9f5f0] rounded-xl border border-gray-200 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">COLOR</label>
                      <input 
                        placeholder="Ej: Gris"
                        className="w-full border-b border-gray-300 bg-transparent outline-none focus:border-[#4a3b2a] py-1 text-sm font-bold"
                        value={v.color}
                        onChange={(e) => updateVariante(idx, 'color', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] font-bold text-gray-400 block mb-1 text-center md:text-left">STOCK POR TALLE</label>
                      <div className="flex flex-wrap justify-between gap-2">
                        {tallesRopa.map(talle => (
                          <div key={talle} className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-[#4a3b2a]">{talle}</span>
                            <input 
                              type="number" 
                              className="w-10 text-center border rounded py-1 text-xs focus:border-[#4a3b2a] outline-none"
                              value={v.stock?.[talle] || ''} 
                              onChange={(e) => updateStock(idx, talle, e.target.value)}
                            />
                          </div>
                        ))}
                        <button type="button" onClick={() => removeColorRow(idx)} className="text-red-400 hover:text-red-600 self-end mb-1 ml-2">
                          <FiTrash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#4a3b2a] uppercase">Descripción</label>
            <textarea rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#4a3b2a]"
              value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Cancelar</button>
            <button type="submit" disabled={uploading} className="bg-[#4a3b2a] text-[#d8bf9f] px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-black transition disabled:opacity-50">
              {uploading ? 'Guardando...' : 'Confirmar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;