import React, { useState, useEffect, useId, useMemo } from 'react';
import { FiX, FiPlus, FiTrash2, FiImage, FiLayers, FiUploadCloud } from 'react-icons/fi';
import { fileService } from '../services/fileService';

const ProductoModal = ({ show, onClose, onSave, editingProduct, categorias }) => {
  const tallesRopa = useMemo(() => ['U', 'S', 'M', 'L', 'XL', 'XXL'], []);
  const baseId = useId();

  const [state, setState] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    variantes: [{ color: '', stock: {}, tempId: crypto.randomUUID() }],
    existingImages: [],
    newFiles: [],
    uploading: false
  });

  useEffect(() => {
    if (!show) return;

    if (editingProduct) {
      setState(prev => ({
        ...prev,
        nombre: editingProduct.nombre,
        descripcion: editingProduct.descripcion || '',
        precio: editingProduct.precio,
        categoriaId: editingProduct.categoriaId,
        existingImages: editingProduct.imagenes || [],
        newFiles: [],
        variantes: editingProduct.variantes?.map(v => ({
          color: v.color || '',
          stock: v.stockPorTalle || {},
          tempId: crypto.randomUUID()
        })) || [{ color: '', stock: {}, tempId: crypto.randomUUID() }]
      }));
    } else {
      setState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoriaId: categorias[0]?.id || '',
        variantes: [{ color: '', stock: {}, tempId: crypto.randomUUID() }],
        existingImages: [],
        newFiles: [],
        uploading: false
      });
    }
  }, [editingProduct, categorias, show]);

  const updateVariante = (tempId, field, value) => {
    setState(prev => ({
      ...prev,
      variantes: prev.variantes.map(v => v.tempId === tempId ? { ...v, [field]: value } : v)
    }));
  };

  const updateStock = (tempId, talle, value) => {
    setState(prev => ({
      ...prev,
      variantes: prev.variantes.map(v => {
        if (v.tempId === tempId) {
          const newStock = { ...v.stock };
          newStock[talle] = value === '' ? 0 : parseInt(value, 10) || 0;
          return { ...v, stock: newStock };
        }
        return v;
      })
    }));
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setState(prev => ({ ...prev, newFiles: [...prev.newFiles, { file, preview }] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, uploading: true }));
    try {
      const uploadedUrls = [];
      for (const item of state.newFiles) {
        const uploadRes = await fileService.uploadImage(item.file);
        uploadedUrls.push(uploadRes.filename);
      }

      const totalStock = state.variantes.reduce((acc, v) => 
        acc + Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0), 0
      );

      const payload = {
        nombre: state.nombre,
        descripcion: state.descripcion,
        precio: parseFloat(state.precio),
        categoriaId: parseInt(state.categoriaId),
        imagenes: [...state.existingImages, ...uploadedUrls],
        stock: totalStock,
        variantes: state.variantes.map(v => ({ color: v.color, stockPorTalle: v.stock })),
      };

      await onSave(payload);
    } catch (error) {
      alert("Error al procesar el producto");
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="bg-crema rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
        <header className="px-8 py-5 border-b border-brand-primary/30 flex justify-between items-center">
          <h3 className="text-xl font-black text-brand-dark uppercase font-serif">{editingProduct ? 'Editar' : 'Crear'} Producto</h3>
          <button onClick={onClose} aria-label="Cerrar modal" className="p-2 rounded-full text-brand-secondary hover:bg-brand-primary/20 hover:text-brand-dark transition"><FiX size={20}/></button>
        </header>

        <form id="prod-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1 space-y-3">
              <p className="text-xs font-black text-brand-secondary uppercase tracking-widest flex items-center gap-2"><FiImage /> Galería</p>
              <div className="grid grid-cols-2 gap-2">
                {state.existingImages.map((img) => (
                  <div key={img} className="relative group aspect-square rounded-xl overflow-hidden border">
                    <img src={img.startsWith('http') ? img : fileService.getImageUrl(img)} className="w-full h-full object-cover" alt="Producto" />
                    <button type="button" onClick={() => setState(p => ({...p, existingImages: p.existingImages.filter(url => url !== img)}))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><FiTrash2 size={10}/></button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#4a3b2a] transition">
                  <FiPlus className="text-brand-secondary" size={24}/>
                  <input type="file" onChange={handleFileSelect} className="hidden" accept="image/*" />
                </label>
              </div>
            </section>

            <section className="lg:col-span-2 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label htmlFor={`${baseId}-nombre`} className="text-xs font-black text-brand-secondary uppercase tracking-widest">Nombre</label>
                  <input id={`${baseId}-nombre`} required className="w-full border-b-2 border-brand-primary/30 focus:border-brand-dark outline-none py-2 font-bold text-brand-dark bg-transparent text-lg" value={state.nombre} onChange={e => setState({...state, nombre: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label htmlFor={`${baseId}-cat`} className="text-xs font-black text-brand-secondary uppercase tracking-widest">Categoría</label>
                  <select id={`${baseId}-cat`} required className="w-full border-b-2 border-brand-primary/30 focus:border-brand-dark outline-none py-2 font-bold text-brand-dark bg-transparent text-lg" value={state.categoriaId} onChange={e => setState({...state, categoriaId: e.target.value})}>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor={`${baseId}-desc`} className="text-xs font-black text-brand-secondary uppercase tracking-widest">Descripción</label>
                <textarea id={`${baseId}-desc`} rows="3" className="w-full border border-brand-primary/30 rounded-xl p-3 outline-none focus:border-brand-dark text-sm text-brand-secondary bg-brand-light" value={state.descripcion} onChange={e => setState({...state, descripcion: e.target.value})} />
              </div>
            </section>
          </div>

          <section className="border-t pt-8 space-y-6">
            <h4 className="font-black uppercase tracking-tight text-lg flex items-center gap-2"><FiLayers /> Control de Stock</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.variantes.map((v) => (
                <div key={v.tempId} className="p-5 bg-crema rounded-2xl border border-brand-primary/30 shadow-sm transition">
                  <div className="mb-4">
                    <label htmlFor={`${v.tempId}-color`} className="text-[10px] font-bold text-brand-secondary block mb-1 uppercase">Color</label>
                    <input 
                      id={`${v.tempId}-color`}
                      className="w-full border-b-2 border-brand-primary/30 focus:border-brand-dark outline-none py-2 font-bold text-brand-dark bg-transparent text-lg"
                      value={v.color}
                      onChange={(e) => updateVariante(v.tempId, 'color', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {tallesRopa.map(talle => (
                      <div key={`${v.tempId}-${talle}`} className="flex flex-col items-center gap-1">
                        <label htmlFor={`${v.tempId}-${talle}`} className="text-[9px] font-bold text-brand-secondary">{talle}</label>
                        <input id={`${v.tempId}-${talle}`} type="number" className="w-full text-center border border-brand-primary/30 rounded-md py-1 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-primar" value={v.stock?.[talle] || ''} onChange={(e) => updateStock(v.tempId, talle, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setState(prev => ({...prev, variantes: prev.variantes.filter(item => item.tempId !== v.tempId)}))} className="mt-4 text-brand-secondary hover:text-brand-dark text-[10px] font-bold uppercase flex items-center gap-1 transition"><FiTrash2 /> Eliminar</button>
                </div>
              ))}
              <button type="button" onClick={() => setState(prev => ({...prev, variantes: [...prev.variantes, { color: '', stock: {}, tempId: crypto.randomUUID() }]}))} className="border-2 border-dashed border-brand-primary/30 rounded-2xl p-5 text-brand-secondary font-bold hover:border-brand-dark hover:text-brand-dark transition flex items-center justify-center gap-2">
                <FiPlus /> Agregar Variante
              </button>
            </div>
          </section>
        </form>

        <footer className="px-8 py-5 bg-brand-light border-t border-brand-primary/30 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-brand-secondary font-bold hover:text-brand-dark transition">Cancelar</button>
          <button type="submit" form="prod-form" disabled={state.uploading} className="bg-brand-dark text-brand-muted px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-brand-secondary transition disabled:opacity-50">
            {state.uploading ? 'Guardando...' : 'Confirmar'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProductoModal;