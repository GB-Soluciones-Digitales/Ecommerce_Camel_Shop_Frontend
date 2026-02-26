import React, { useState, useEffect } from 'react';
import { heroService } from '../services/heroService';
import { fileService } from '../services/fileService';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiCheckCircle, FiXCircle, FiLayout, FiArrowRight, FiX } from 'react-icons/fi';

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiLayout /> Configurar Hero Slider
        </h2>
        <button onClick={() => openModal()} className="bg-camel-600 hover:bg-camel-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5">
          <FiPlus /> Nuevo Slide
        </button>
      </div>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition">
            <div className="w-full md:w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative group">
              {slide.imagenUrl ? (
                <img src={fileService.getImageUrl(slide.imagenUrl)} alt="Slide" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400"><FiImage size={24} /></div>
              )}
              <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                #{slide.orden}
              </div>
            </div>

            <div className="flex-1 space-y-1 text-center md:text-left w-full">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="font-bold text-gray-800">{slide.titulo || '(Sin Título)'}</h3>
                {!slide.activo && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">PAUSADO</span>}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{slide.subtitulo} - {slide.descripcion}</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => openModal(slide)} className="text-gray-400 hover:text-camel-600 p-2 rounded-full hover:bg-camel-50 transition"><FiEdit2 size={18}/></button>
              <button onClick={() => handleDelete(slide.id)} className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"><FiTrash2 size={18}/></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-800">{editingSlide ? 'Editar Slide' : 'Nuevo Slide'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-camel-600 uppercase tracking-wider">Vista Previa en Vivo</label>
                  <span className="text-xs text-gray-400">Así se verá en la web</span>
                </div>
                
                <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900 rounded-xl overflow-hidden shadow-inner group">
                    {formData.imagenUrl ? (
                        <img src={fileService.getImageUrl(formData.imagenUrl)} className="w-full h-full object-cover transition duration-700" alt='preview'/>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-800 gap-2">
                           <FiImage size={40} />
                           <span className="text-sm">Subí una imagen para ver el fondo</span>
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="absolute inset-0 p-8 md:p-12 flex items-center">
                        <div className={`w-full text-white space-y-4
                            ${formData.alineacion === 'right' ? 'ml-auto text-right items-end flex flex-col' : ''}
                            ${formData.alineacion === 'center' ? 'mx-auto text-center items-center flex flex-col' : ''}
                            ${formData.alineacion === 'left' ? 'items-start flex flex-col' : ''}
                        `}>
                            {formData.subtitulo && (
                                <span className="inline-block px-3 py-1 border border-white/30 rounded-full text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
                                    {formData.subtitulo}
                                </span>
                            )}
                            
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                                {formData.titulo || 'Tu Título Principal'}
                            </h1>
                            
                            <p className="text-sm md:text-base text-gray-200 max-w-lg drop-shadow-md">
                                {formData.descripcion || 'Aquí irá la descripción corta de tu promoción o colección.'}
                            </p>

                            <button className="inline-flex items-center gap-2 bg-camel-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg mt-2">
                                {formData.botonTexto} <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Título Principal</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-camel-500 focus:ring-1 focus:ring-camel-500 transition" 
                      placeholder="Ej: Nueva Colección"
                      value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Subtítulo (Badge)</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-camel-500 focus:ring-1 focus:ring-camel-500 transition" 
                      placeholder="Ej: Verano 2026"
                      value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                    <textarea rows="2" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-camel-500 focus:ring-1 focus:ring-camel-500 transition" 
                      placeholder="Texto descriptivo..."
                      value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Texto Botón</label>
                     <input className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white" 
                       value={formData.botonTexto} onChange={e => setFormData({...formData, botonTexto: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Link Destino</label>
                     <input className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white" 
                       value={formData.botonLink} onChange={e => setFormData({...formData, botonLink: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Alineación</label>
                     <select className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white" 
                       value={formData.alineacion} onChange={e => setFormData({...formData, alineacion: e.target.value})}>
                       <option value="left">Izquierda</option>
                       <option value="center">Centro</option>
                       <option value="right">Derecha</option>
                     </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 items-end">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Orden de aparición</label>
                      <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                        value={formData.orden} onChange={e => setFormData({...formData, orden: parseInt(e.target.value)})} />
                   </div>
                   
                   <label className="flex items-center gap-3 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition h-[42px]">
                      <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${formData.activo ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formData.activo ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.activo} onChange={e => setFormData({...formData, activo: e.target.checked})} />
                      <span className="text-sm font-medium text-gray-700 select-none">Mostrar Slide</span>
                   </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Imagen de Fondo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                     <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                     {uploading ? (
                        <span className="text-camel-600 font-bold animate-pulse">Subiendo imagen...</span>
                     ) : (
                        <div className="text-gray-500 flex flex-col items-center gap-2">
                          <FiImage size={24} />
                          <span className="text-sm">Click o arrastra para cambiar la imagen (1920x800 px)</span>
                        </div>
                     )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Cancelar</button>
                  <button type="submit" disabled={uploading} className="px-8 py-2.5 bg-camel-600 hover:bg-camel-700 text-white rounded-lg font-bold shadow-lg shadow-camel-500/20 transition transform hover:-translate-y-0.5">
                    {uploading ? 'Procesando...' : 'Guardar Cambios'}
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