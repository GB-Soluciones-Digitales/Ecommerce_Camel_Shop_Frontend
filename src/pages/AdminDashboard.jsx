import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { fileService } from '../services/fileService';
import { FiEdit2, FiTrash2, FiPlus, FiImage, FiToggleLeft, FiToggleRight, FiSearch, FiX } from 'react-icons/fi';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Talles
  const [tipoTalle, setTipoTalle] = useState('ROPA'); 
  const [tallesSeleccionados, setTallesSeleccionados] = useState([]);
  const [nuevoTalleNumerico, setNuevoTalleNumerico] = useState('');
  const tallesRopa = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', categoriaId: '', imagenUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Paleta de Colores
  const colors = {
    bgPage: 'bg-[#f9f5f0]',
    textMain: 'text-[#4a3b2a]',
    buttonPrimary: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]',
    buttonSecondary: 'bg-[#d8bf9f] hover:bg-[#c5a57f] text-[#4a3b2a]',
    accent: 'text-[#d8bf9f]',
    borderFocus: 'focus:border-[#4a3b2a] focus:ring-[#4a3b2a]'
  };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productoService.getAllProductos(),
        categoriaService.getCategoriasAdmin(),
      ]);
      setProductos(prodRes.data);
      setCategorias(catRes.data);
    } catch (error) { console.error('Error cargando datos'); } 
    finally { setLoading(false); }
  };

  const openModal = (producto = null) => {
    setEditingProduct(producto);
    setTipoTalle(producto?.tipoTalle || 'ROPA');
    setTallesSeleccionados(producto?.talles || []);
    
    setFormData(producto ? {
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      categoriaId: producto.categoriaId,
      imagenUrl: producto.imagenUrl || '',
    } : {
      nombre: '', descripcion: '', precio: '', stock: '', categoriaId: categorias[0]?.id || '', imagenUrl: ''
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const toggleTalleRopa = (talle) => {
    if (tallesSeleccionados.includes(talle)) {
      setTallesSeleccionados(prev => prev.filter(t => t !== talle));
    } else {
      setTallesSeleccionados(prev => [...prev, talle]);
    }
  };

  const addTalleNumerico = () => {
    if (nuevoTalleNumerico && !tallesSeleccionados.includes(nuevoTalleNumerico)) {
      setTallesSeleccionados(prev => [...prev, nuevoTalleNumerico].sort((a, b) => a - b));
      setNuevoTalleNumerico('');
    }
  };

  const removeTalle = (talle) => setTallesSeleccionados(prev => prev.filter(t => t !== talle));

  const handleTipoTalleChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipoTalle(nuevoTipo);
    setTallesSeleccionados([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let finalImageUrl = formData.imagenUrl;
      
      if (selectedFile) {
        const uploadRes = await fileService.uploadImage(selectedFile);
        finalImageUrl = uploadRes.filename;
      }

      const payload = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoriaId: parseInt(formData.categoriaId),
        imagenUrl: finalImageUrl,
        tipoTalle,
        talles: tipoTalle === 'UNICO' ? [] : tallesSeleccionados 
      };

      if (editingProduct) {
        await productoService.actualizarProducto(editingProduct.id, payload);
      } else {
        await productoService.crearProducto(payload);
      }
      setShowModal(false);
      loadData();
    } catch (error) { alert('Error al guardar'); } 
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      await productoService.eliminarProducto(id);
      loadData();
    }
  };

  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`min-h-screen ${colors.bgPage} flex`}>
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className={`text-2xl font-bold ${colors.textMain}`}>Gestión de Productos</h2>
          <button onClick={() => openModal()} className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 font-bold`}>
            <FiPlus /> Nuevo Producto
          </button>
        </header>

        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-4 border border-[#d8bf9f]/20">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o categoría..." 
              className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 ${colors.borderFocus} transition`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#d8bf9f]/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#4a3b2a]/5 text-[#4a3b2a] text-sm uppercase tracking-wider border-b border-[#d8bf9f]/20">
                  <th className="px-6 py-4 font-bold">Producto</th>
                  <th className="px-6 py-4 font-bold">Categoría</th>
                  <th className="px-6 py-4 font-bold">Precio</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold text-center">Estado</th>
                  <th className="px-6 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8bf9f]/10">
                {filteredProducts.map((producto) => (
                  <tr key={producto.id} className="hover:bg-[#f9f5f0] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          {fileService.getImageUrl ? (
                            <img src={fileService.getImageUrl(producto.imagenes?.[0])} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <FiImage className="h-full w-full p-2 text-gray-300" />
                          )}
                        </div>
                        <span className={`font-bold ${colors.textMain}`}>{producto.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{producto.categoriaNombre}</td>
                    <td className="px-6 py-4 font-bold text-[#4a3b2a]">${parseFloat(producto.precio).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${producto.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {producto.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => productoService.toggleEstadoProducto(producto.id).then(loadData)}
                        className={`text-2xl transition ${producto.activo ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'}`}
                      >
                        {producto.activo ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openModal(producto)} className="text-gray-400 hover:text-[#4a3b2a] transition p-1"><FiEdit2 size={18}/></button>
                      <button onClick={() => handleDelete(producto.id)} className="text-gray-400 hover:text-red-600 transition p-1"><FiTrash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3b2a]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-[#d8bf9f]">
            
            <div className={`px-6 py-4 border-b border-[#d8bf9f]/30 flex justify-between items-center ${colors.bgPage}`}>
              <h3 className={`font-bold text-lg ${colors.textMain}`}>{editingProduct ? 'Editar' : 'Nuevo'} Producto</h3>
              <button onClick={() => setShowModal(false)} className="text-[#4a3b2a] hover:opacity-70"><FiX size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4a3b2a] uppercase">Nombre</label>
                  <input required className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 ${colors.borderFocus}`} 
                    value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4a3b2a] uppercase">Categoría</label>
                  <select required className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white focus:ring-1 ${colors.borderFocus}`}
                    value={formData.categoriaId} onChange={e => setFormData({...formData, categoriaId: e.target.value})}>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4a3b2a] uppercase">Precio ($)</label>
                  <input required type="number" step="0.01" className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 ${colors.borderFocus}`}
                    value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4a3b2a] uppercase">Stock</label>
                  <input required type="number" className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 ${colors.borderFocus}`}
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              {/* SECCIÓN TALLES */}
              <div className="p-4 bg-[#f9f5f0] rounded-xl border border-[#d8bf9f]/30 space-y-3">
                <div className="flex justify-between items-center">
                   <label className={`text-sm font-bold ${colors.textMain}`}>Configuración de Talles</label>
                   <select 
                      value={tipoTalle} 
                      onChange={handleTipoTalleChange}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white outline-none focus:border-[#4a3b2a]"
                   >
                      <option value="ROPA">Indumentaria (S, M, L)</option>
                      <option value="CALZADO">Calzado (Numérico)</option>
                      <option value="UNICO">Talle Único</option>
                   </select>
                </div>

                {tipoTalle === 'ROPA' && (
                  <div className="flex flex-wrap gap-2">
                    {tallesRopa.map(talle => (
                      <button key={talle} type="button" onClick={() => toggleTalleRopa(talle)}
                        className={`px-3 py-1 rounded-md text-sm font-bold border transition ${
                          tallesSeleccionados.includes(talle)
                            ? 'bg-[#4a3b2a] text-[#d8bf9f] border-[#4a3b2a]'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-[#4a3b2a]'
                        }`}
                      >
                        {talle}
                      </button>
                    ))}
                  </div>
                )}

                {tipoTalle === 'CALZADO' && (
                   <div className="flex gap-2">
                      <input type="number" placeholder="Ej: 40" 
                         className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4a3b2a]"
                         value={nuevoTalleNumerico} onChange={e => setNuevoTalleNumerico(e.target.value)}
                      />
                      <button type="button" onClick={addTalleNumerico} className="bg-[#4a3b2a] text-[#d8bf9f] px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition">Agregar</button>
                   </div>
                )}

                {tipoTalle !== 'UNICO' && tallesSeleccionados.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[#d8bf9f]/20">
                    {tallesSeleccionados.map(talle => (
                      <span key={talle} className="bg-white border border-[#4a3b2a]/20 text-[#4a3b2a] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        {talle} <button type="button" onClick={() => removeTalle(talle)} className="hover:text-red-500">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a3b2a] uppercase">Descripción</label>
                <textarea rows="3" className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 ${colors.borderFocus}`}
                  value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a3b2a] uppercase">Imagen</label>
                <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#d8bf9f] file:text-[#4a3b2a] hover:file:bg-[#c5a57f] cursor-pointer"/>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d8bf9f]/20">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Cancelar</button>
                <button type="submit" disabled={uploading} className={`${colors.buttonPrimary} px-6 py-2 rounded-lg font-bold shadow-lg shadow-[#4a3b2a]/20 transition transform hover:-translate-y-0.5`}>
                  {uploading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;