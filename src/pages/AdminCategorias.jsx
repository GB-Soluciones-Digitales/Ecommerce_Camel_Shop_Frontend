import React, { useState, useEffect } from 'react';
import { categoriaService } from '../services/categoriaService';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLayers } from 'react-icons/fi';

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
          <p className="text-gray-500">Organiza tu catálogo</p>
        </div>
        <button onClick={() => openModal()} className="bg-camel-600 hover:bg-camel-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition">
          <FiPlus /> Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Nombre</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Descripción</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium flex items-center gap-3">
                  <div className="bg-camel-100 p-2 rounded text-camel-600"><FiLayers /></div>
                  {cat.nombre}
                </td>
                <td className="px-6 py-4 text-gray-500">{cat.descripcion || '-'}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openModal(cat)} className="text-gray-400 hover:text-camel-600 transition"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600 transition"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-4 text-center text-gray-500">Cargando...</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{editingCat ? 'Editar' : 'Nueva'} Categoría</h3>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-camel-500 outline-none" 
                  value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-camel-500 outline-none" 
                  value={descripcion} onChange={e => setDescripcion(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-camel-600 text-white rounded-lg hover:bg-camel-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategorias;