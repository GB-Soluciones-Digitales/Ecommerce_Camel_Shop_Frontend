import React, { useState, useEffect, useId, useMemo } from 'react';
import { FiX, FiPlus, FiTrash2, FiImage, FiLayers, FiUploadCloud, FiCheck, FiTag, FiAlignLeft } from 'react-icons/fi';
import { fileService } from '../services/fileService';
import { sileo } from "sileo"; 

const ProductoModal = ({ show, onClose, onSave, editingProduct, categorias }) => {
  const tallesRopa = useMemo(() => ['U', 'S', 'M', 'L', 'XL', 'XXL'], []);
  const baseId = useId();

  const [state, setState] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    enOferta: false,
    porcentajeDescuento: '',
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
        enOferta: editingProduct.enOferta || false,
        porcentajeDescuento: editingProduct.porcentajeDescuento || '',
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
        enOferta: false,
        porcentajeDescuento: '',
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
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      const newPreviews = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setState(prev => ({ ...prev, newFiles: [...prev.newFiles, ...newPreviews] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, uploading: true }));
    try {
      const uploadPromises = state.newFiles.map(item => fileService.uploadImage(item.file));
      const uploadResponses = await Promise.all(uploadPromises);

      const uploadedUrls = uploadResponses.map(res => res.filename || res);

      const totalStock = state.variantes.reduce((acc, v) => 
        acc + Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0), 0
      );

      const payload = {
        nombre: state.nombre,
        descripcion: state.descripcion,
        precio: parseFloat(state.precio),
        enOferta: state.enOferta,
        porcentajeDescuento: state.enOferta ? (parseInt(state.porcentajeDescuento) || 0) : 0,
        categoriaId: parseInt(state.categoriaId),
        imagenes: [...state.existingImages, ...uploadedUrls],
        stock: totalStock,
        variantes: state.variantes.map(v => ({ color: v.color, stockPorTalle: v.stock })),
      };

      await onSave(payload);

      sileo.success({
        title: "Pieza guardada",
        description: "El producto se actualizó en el catálogo."
      });

    } catch (error) {
      sileo.error({
        title: "Error de conexión",
        description: "No pudimos guardar la pieza. Intentá nuevamente."
      });
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="bg-crema rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden max-h-[92vh] flex flex-col border border-brand-muted" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-brand-muted flex justify-between items-center bg-white">
          <div>
            <h3 className="font-serif font-bold text-2xl text-brand-dark">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">Gestión de Catálogo</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar modal" className="text-brand-secondary hover:text-brand-dark p-2 hover:bg-brand-light rounded-full transition-all">
            <FiX size={28}/>
          </button>
        </div>

        <form id="prod-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Galería */}
            <section className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-brand-muted shadow-sm space-y-4 h-fit">
              <div className="flex items-center gap-3 border-b border-brand-muted pb-3">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                  <FiImage size={14}/>
                </div>
                <h4 className="font-bold text-xs text-brand-dark uppercase tracking-[0.2em]">Galería</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {state.existingImages.map((img) => (
                  <div key={img} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-brand-muted shadow-sm">
                    <img src={img.startsWith('http') ? img : fileService.getImageUrl(img)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Producto" />
                    <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button type="button" onClick={() => setState(p => ({...p, existingImages: p.existingImages.filter(url => url !== img)}))} className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 transition-transform transform hover:scale-110 shadow-lg">
                        <FiTrash2 size={16}/>
                      </button>
                    </div>
                  </div>
                ))}

                {state.newFiles.map((fileObj, idx) => (
                  <div key={`new-${idx}`} className="relative group aspect-[3/4] rounded-xl overflow-hidden border-2 border-brand-primary shadow-sm">
                    <img src={fileObj.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview Nueva" />
                    
                    <div className="absolute top-2 left-2 bg-brand-primary text-crema text-[9px] font-black uppercase px-2 py-1 rounded shadow-md tracking-widest">
                      Nueva
                    </div>

                    <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button type="button" onClick={() => setState(p => ({...p, newFiles: p.newFiles.filter((_, i) => i !== idx)}))} className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 transition-transform transform hover:scale-110 shadow-lg">
                        <FiTrash2 size={16}/>
                      </button>
                    </div>
                  </div>
                ))}
                
                <label className="aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-brand-muted bg-brand-light/30 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-brand-light transition-all group">
                  <FiUploadCloud className="text-brand-secondary group-hover:text-brand-primary transition-colors mb-2" size={28}/>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary group-hover:text-brand-primary">Subir</span>
                  <input type="file" multiple onChange={handleFileSelect} className="hidden" accept="image/*" />
                </label>
              </div>
            </section>

            {/* Información y Stock */}
            <section className="lg:col-span-8 space-y-8">
              
              {/* Información Básica */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-muted shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-brand-muted pb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary"><FiTag size={14}/></div>
                  <h4 className="font-bold text-xs text-brand-dark uppercase tracking-[0.2em]">Información General</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor={`${baseId}-nombre`} className="text-[10px] font-black text-brand-secondary uppercase tracking-widest ml-1">Nombre de la Pieza</label>
                    <input id={`${baseId}-nombre`} required className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-serif text-lg text-brand-dark" placeholder="Ej: Remera Over Camel" value={state.nombre} onChange={e => setState({...state, nombre: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`${baseId}-precio`} className="text-[10px] font-black text-brand-secondary uppercase tracking-widest ml-1">Precio ($)</label>
                    <input id={`${baseId}-precio`} type="number" required className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-brand-dark" placeholder="0.00" value={state.precio} onChange={e => setState({...state, precio: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor={`${baseId}-cat`} className="text-[10px] font-black text-brand-secondary uppercase tracking-widest ml-1">Categoría</label>
                    <select id={`${baseId}-cat`} required className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all text-sm font-bold text-brand-dark cursor-pointer appearance-none" value={state.categoriaId} onChange={e => setState({...state, categoriaId: e.target.value})}>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor={`${baseId}-desc`} className="text-[10px] font-black text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2"><FiAlignLeft/> Descripción</label>
                    <textarea id={`${baseId}-desc`} rows="3" className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all text-sm text-brand-dark" placeholder="Detalles de la tela, calce, cuidados..." value={state.descripcion} onChange={e => setState({...state, descripcion: e.target.value})} />
                  </div>
                  {/* Aca dentro un checkbox/switch para marcar como oferta y activar un input para agregar el porcentaje de descuento */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={state.enOferta}
                          onChange={(e) => setState({ ...state, enOferta: e.target.checked })}
                        />
                      </div>
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                      <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest flex items-center gap-2">
                        <FiTag className={state.enOferta ? "text-rose-500" : ""} />
                        Pieza en Oferta (Sale)
                      </span>
                    </label>

                    {state.enOferta && (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                        <span className="text-xs font-bold text-brand-dark ml-2">Descuento:</span>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          placeholder="Ej: 20"
                          className="w-20 bg-white border border-brand-muted rounded-xl px-3 py-2 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all font-bold text-brand-dark text-center"
                          value={state.porcentajeDescuento}
                          onChange={(e) => setState({ ...state, porcentajeDescuento: e.target.value })}
                          required={state.enOferta}
                        />
                        <span className="text-xs font-black text-rose-500">% OFF</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Variantes y Stock */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-muted shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-brand-muted pb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary"><FiLayers size={14}/></div>
                  <h4 className="font-bold text-xs text-brand-dark uppercase tracking-[0.2em]">Variantes y Stock</h4>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {state.variantes.map((v) => (
                    <div key={v.tempId} className="p-6 bg-brand-light/30 rounded-2xl border border-brand-muted shadow-sm flex flex-col md:flex-row gap-6 relative group">
                      <div className="flex-1 space-y-2">
                        <label htmlFor={`${v.tempId}-color`} className="text-[10px] font-black text-brand-secondary uppercase tracking-widest ml-1">Color / Variante</label>
                        <input 
                          id={`${v.tempId}-color`}
                          placeholder="Ej: Crudo, Negro, Único..."
                          className="w-full bg-white border border-brand-muted rounded-xl px-4 py-2.5 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all text-sm font-bold text-brand-dark"
                          value={v.color}
                          onChange={(e) => updateVariante(v.tempId, 'color', e.target.value)}
                        />
                      </div>
                      
                      <div className="flex-2">
                        <label className="text-[10px] font-black text-brand-secondary uppercase tracking-widest ml-1 mb-2 block">Stock por Talle</label>
                        <div className="flex flex-wrap gap-2">
                          {tallesRopa.map(talle => (
                            <div key={`${v.tempId}-${talle}`} className="flex flex-col items-center gap-1 w-12">
                              <label htmlFor={`${v.tempId}-${talle}`} className="text-[9px] font-bold text-brand-dark bg-white w-full text-center py-1 rounded-t-md border border-brand-muted border-b-0">{talle}</label>
                              <input id={`${v.tempId}-${talle}`} type="number" min="0" placeholder="0" className="w-full text-center border border-brand-muted rounded-b-md py-1.5 text-xs font-bold outline-none focus:border-brand-primary focus:bg-brand-light transition-colors" value={v.stock?.[talle] || ''} onChange={(e) => updateStock(v.tempId, talle, e.target.value)} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <button type="button" onClick={() => setState(prev => ({...prev, variantes: prev.variantes.filter(item => item.tempId !== v.tempId)}))} className="absolute -top-3 -right-3 bg-rose-50 text-rose-500 border border-rose-200 p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <FiTrash2 size={14}/>
                      </button>
                    </div>
                  ))}
                  
                  <button type="button" onClick={() => setState(prev => ({...prev, variantes: [...prev.variantes, { color: '', stock: {}, tempId: crypto.randomUUID() }]}))} className="border-2 border-dashed border-brand-muted bg-white rounded-2xl p-4 text-[10px] tracking-[0.2em] uppercase text-brand-secondary font-bold hover:border-brand-primary hover:text-brand-primary hover:bg-brand-light transition-all flex items-center justify-center gap-2">
                    <FiPlus size={16}/> Agregar Nueva Variante
                  </button>
                </div>
              </div>
            </section>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-brand-muted flex justify-between items-center bg-brand-light/50">
          <div className="hidden md:block">
            <span className="text-[10px] text-brand-secondary uppercase tracking-widest font-bold">Asegurate de guardar los cambios</span>
          </div>
          <div className="flex gap-4 w-full md:w-auto justify-end">
            <button type="button" onClick={onClose} className="px-6 py-3 text-brand-secondary font-bold text-xs uppercase tracking-widest hover:text-brand-dark transition-colors">
              Cancelar
            </button>
            <button type="submit" form="prod-form" disabled={state.uploading} className="bg-brand-dark text-crema px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:bg-black transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none">
              {state.uploading ? (
                <>Procesando...</>
              ) : (
                <><FiCheck size={18}/> Guardar Pieza</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;