import React, { useState, useEffect } from 'react';
import { categoriaService } from '../../services/categoriaService';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLayers } from 'react-icons/fi';
import { BiCategoryAlt } from "react-icons/bi";

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await categoriaService.getCategoriasAdmin();
      setCategorias(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cat = null) => {
    setEditingCat(cat);
    setNombre(cat ? cat.nombre : '');
    setDescripcion(cat ? cat.descripcion : '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { nombre, descripcion };
      if (editingCat) {
        await categoriaService.actualizarCategoria(editingCat.id, payload);
      } else {
        await categoriaService.crearCategoria(payload);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert('Error al guardar categoría');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
      try {
        await categoriaService.eliminarCategoria(id);
        loadData();
      } catch (error) {
        alert('No se puede eliminar porque tiene productos asociados.');
      }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-crema min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark flex items-center gap-3 font-serif">
            <BiCategoryAlt className="text-brand-primary"/>Categorías
          </h2>
          <p className="text-brand-secondary text-sm mt-1 font-medium">Define las categorias de tu colección</p>
        </div>
        <button onClick={() => openModal()} className="bg-brand-dark text-crema px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-brand-secondary transition transform hover:-translate-y-1">
          <FiPlus size={18}/> Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-dark/5 overflow-hidden border border-brand-muted">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-light/50 text-xs font-black text-brand-primary uppercase tracking-[0.2em] border-b border-brand-muted">
              <tr>
                <th className="px-6 py-4 text-xs">Nombre</th>
                <th className="px-6 py-4 text-xs">Descripción</th>
                <th className="px-6 py-4 text-xs text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-muted">
              {categorias.map((cat) => (
                <tr key={cat.id} className="hover:bg-crema/30 transition group">
                  <td className="px-6 py-4 font-serif font-bold text-brand-dark flex items-center gap-3">
                    <div className="bg-brand-muted p-2 rounded-lg text-brand-dark"><FiLayers /></div>
                    {cat.nombre}
                  </td>
                  <td className="px-6 py-4 text-brand-secondary text-sm">{cat.descripcion || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openModal(cat)} className="text-brand-primary hover:text-brand-dark transition p-2"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(cat.id)} className="text-brand-primary hover:text-red-600 transition p-2"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="p-4 text-center text-gray-500">Cargando...</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md">
          <div className="bg-crema rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-brand-muted">
            <div className="px-8 py-6 border-b border-brand-muted flex justify-between items-center bg-white">
              <h3 className="text-2xl font-bold text-brand-dark uppercase font-serif tracking-tight">
                {editingCat ? 'Editar' : 'Nueva'} Categoría
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full text-brand-secondary hover:bg-brand-light transition">
                <FiX size={24}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest px-1">Nombre de Categoría</label>
                <input required className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-serif text-lg" 
                  value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Colección Otoño" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest px-1">Descripción</label>
                <textarea rows="3" className="w-full bg-white border border-brand-muted rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all" 
                  value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Breve descripción para la web..." />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-brand-secondary font-bold text-xs uppercase tracking-widest hover:text-brand-dark">
                  Cancelar
                </button>
                <button type="submit" className="bg-brand-dark text-crema px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-brand-secondary transition-all transform hover:-translate-y-1">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategorias;