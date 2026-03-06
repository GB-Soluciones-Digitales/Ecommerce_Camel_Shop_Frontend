import React, { useState, useEffect } from 'react';
import { heroService } from '../../services/heroService';
import { fileService } from '../../services/fileService';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiLayout, FiArrowRight, FiX } from 'react-icons/fi';

const AdminHero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '', 
    subtitulo: '', 
    descripcion: '',
    imagenUrl: '', 
    botonTexto: 'Ver Catálogo', 
    botonLink: '/productos',
    alineacion: 'left', 
    orden: 1, 
    activo: true
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await heroService.getAdminSlides();
      setSlides(res.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const openModal = (slide = null) => {
    setEditingSlide(slide);
    const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.orden)) + 1 : 1;
    
    setFormData(slide || {
      titulo: '', 
      subtitulo: '', 
      descripcion: '',
      imagenUrl: '', 
      botonTexto: 'Ver Catálogo', 
      botonLink: '/productos',
      alineacion: 'left', 
      orden: nextOrder, 
      activo: true
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fileService.uploadImage(file);
      setFormData(prev => ({ ...prev, imagenUrl: res.filename }));
    } catch (error) { alert('Error al subir imagen'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        await heroService.actualizarSlide(editingSlide.id, formData);
      } else {
        await heroService.crearSlide(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) { alert('Error al guardar'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Borrar este slide?')) {
      await heroService.eliminarSlide(id);
      loadData();
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-camel-600"></div></div>;

  return (
    <div className="p-6 md:p-10 bg-crema min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark flex items-center gap-3 font-serif">
            <FiLayout className="text-brand-primary" /> Hero Slider
          </h2>
          <p className="text-brand-secondary text-sm mt-1 font-medium">Impacto visual de la página principal</p>
        </div>
        <button onClick={() => openModal()} className="bg-brand-dark text-crema px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-brand-secondary transition transform hover:-translate-y-1">
          <FiPlus size={18}/> Crear Slide
        </button>
      </div>

      <div className="grid gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-brand-muted flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-all">
            <div className="w-full md:w-40 h-24 bg-brand-light rounded-2xl overflow-hidden flex-shrink-0 relative group border border-brand-muted">
              {slide.imagenUrl ? (
                <img src={fileService.getImageUrl(slide.imagenUrl)} className="w-full h-full object-cover" alt="Slide" />
              ) : (
                <div className="flex items-center justify-center h-full text-brand-primary"><FiImage size={24} /></div>
              )}
            </div>

            <div className="flex-1 space-y-1 text-center md:text-left">
              <h3 className="font-serif font-bold text-xl text-brand-dark">{slide.titulo || '(Sin Título)'}</h3>
              <p className="text-xs text-brand-secondary uppercase tracking-widest">{slide.subtitulo}</p>
            </div>

            <div className="flex items-center gap-3">
              {!slide.activo && <span className="bg-red-50 text-red-600 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">Oculto</span>}
              <button onClick={() => openModal(slide)} className="text-brand-primary hover:text-brand-dark p-3 rounded-full hover:bg-brand-light transition"><FiEdit2 size={20}/></button>
              <button onClick={() => handleDelete(slide.id)} className="text-brand-primary hover:text-red-600 p-3 rounded-full hover:bg-red-50 transition"><FiTrash2 size={20}/></button>
            </div>
          </div>
        ))}
        
        {slides.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No hay slides creados aún.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-crema rounded-[2.5rem] shadow-2xl w-full max-w-4xl my-8 relative flex flex-col max-h-[95vh] border border-brand-muted/50 overflow-hidden font-sans">
            
            {/* Header del Modal */}
            <div className="px-8 py-6 border-b border-brand-muted flex justify-between items-center bg-white">
              <div>
                <h3 className="font-serif font-bold text-2xl text-brand-dark">
                  {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
                </h3>
                <p className="text-brand-secondary text-sm">Personaliza la primera impresión de tu web</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-brand-primary hover:text-brand-dark p-2 hover:bg-brand-light rounded-full transition-all"
              >
                <FiX size={28}/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              
              {/* Vista Previa mejorada */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Vista Previa en Vivo</label>
                  <span className="text-[10px] text-brand-secondary italic">Visualización en tiempo real</span>
                </div>
                
                <div className="relative w-full h-[300px] md:h-[420px] bg-brand-dark rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
                    {formData.imagenUrl ? (
                        <img src={fileService.getImageUrl(formData.imagenUrl)} className="w-full h-full object-cover transition duration-1000" alt='preview'/>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-brand-muted bg-brand-secondary/20 gap-3">
                            <FiImage size={48} className="opacity-50" />
                            <span className="text-sm font-medium tracking-wide">Sube una imagen para previsualizar</span>
                        </div>
                    )}
                    
                    {/* Overlay Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    <div className="absolute inset-0 p-10 md:p-16 flex items-center">
                        <div className={`w-full text-white space-y-5
                            ${formData.alineacion === 'right' ? 'ml-auto text-right items-end flex flex-col' : ''}
                            ${formData.alineacion === 'center' ? 'mx-auto text-center items-center flex flex-col' : ''}
                            ${formData.alineacion === 'left' ? 'items-start flex flex-col' : ''}
                        `}>
                            {formData.subtitulo && (
                                <span className="inline-block px-4 py-1.5 border border-white/40 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-md bg-white/10">
                                    {formData.subtitulo}
                                </span>
                            )}
                            
                            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] drop-shadow-2xl">
                                {formData.titulo || 'Tu Título Principal'}
                            </h1>
                            
                            <p className="text-sm md:text-lg text-white/90 max-w-lg drop-shadow-md font-light">
                                {formData.descripcion || 'Aquí irá la descripción de tu nueva colección.'}
                            </p>

                            <button className="inline-flex items-center gap-3 bg-white text-brand-dark px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl mt-4 transform hover:scale-105 transition">
                                {formData.botonTexto} <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-widest px-1">Título Principal</label>
                    <input className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-serif text-lg" 
                      placeholder="Ej: Nueva Colección"
                      value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-widest px-1">Subtítulo (Badge)</label>
                    <input className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all" 
                      placeholder="Ej: Edición Limitada"
                      value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-widest px-1">Descripción Corta</label>
                    <textarea rows="2" className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all" 
                      placeholder="Escribe un mensaje cautivador..."
                      value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-brand-light/50 p-6 rounded-[2rem] border border-brand-muted">
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">Texto Botón</label>
                      <input className="w-full border border-brand-muted rounded-lg px-3 py-2.5 bg-white outline-none focus:border-brand-primary" 
                        value={formData.botonTexto} onChange={e => setFormData({...formData, botonTexto: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">Link (URL)</label>
                      <input className="w-full border border-brand-muted rounded-lg px-3 py-2.5 bg-white outline-none focus:border-brand-primary" 
                        value={formData.botonLink} onChange={e => setFormData({...formData, botonLink: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">Alineación</label>
                      <select className="w-full border border-brand-muted rounded-lg px-3 py-2.5 bg-white outline-none focus:border-brand-primary appearance-none cursor-pointer" 
                        value={formData.alineacion} onChange={e => setFormData({...formData, alineacion: e.target.value})}>
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-dark uppercase tracking-widest px-1">Orden en el Slider</label>
                      <input type="number" className="w-32 border border-brand-muted rounded-xl px-4 py-3 bg-white outline-none" 
                        value={formData.orden} onChange={e => setFormData({...formData, orden: parseInt(e.target.value)})} />
                  </div>
                  
                  <label className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${formData.activo ? 'bg-brand-primary' : 'bg-brand-secondary/30'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${formData.activo ? 'translate-x-7' : 'translate-x-0'}`}></div>
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} />
                      <span className="text-sm font-bold text-brand-dark uppercase tracking-widest">Slide Activo</span>
                  </label>
                </div>

                {/* Upload de Imagen */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-widest px-1">Imagen de Alta Resolución</label>
                  <div className="border-2 border-dashed border-brand-primary/30 rounded-[2rem] p-10 text-center hover:bg-brand-light transition-all cursor-pointer relative overflow-hidden group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-brand-dark font-bold animate-pulse">Procesando imagen...</span>
                        </div>
                    ) : (
                        <div className="text-brand-secondary flex flex-col items-center gap-3">
                          <div className="bg-brand-muted p-4 rounded-full group-hover:scale-110 transition-transform">
                            <FiImage size={32} className="text-brand-dark" />
                          </div>
                          <div>
                            <p className="text-brand-dark font-bold text-sm">Click para seleccionar o arrastra la imagen</p>
                            <p className="text-[10px] uppercase tracking-tighter mt-1 text-brand-primary">Recomendado: 1920x800px • JPG/WEBP</p>
                          </div>
                        </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción Footer */}
                <div className="flex justify-end gap-4 pt-10 border-t border-brand-muted">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="px-8 py-3.5 text-brand-secondary hover:text-brand-dark font-bold uppercase text-[10px] tracking-widest transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploading} 
                    className="px-12 py-3.5 bg-brand-dark hover:bg-black text-crema rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-brand-dark/20 transition-all transform hover:-translate-y-1 disabled:opacity-50"
                  >
                    {uploading ? 'Cargando...' : 'Publicar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHero;