import React, { useState, useEffect } from 'react';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import ProductoModal from '../components/ProductoModal'; 
import { fileService } from '../services/fileService';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const colors = {
    bgPage: 'bg-[#f9f5f0]',
    textMain: 'text-[#4a3b2a]',
    buttonPrimary: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]',
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

  const handleOpenModal = (producto = null) => {
    setEditingProduct(producto);
    setShowModal(true);
  };

  const handleSaveProduct = async (payload) => {
    try {
      if (editingProduct) {
        await productoService.actualizarProducto(editingProduct.id, payload);
      } else {
        await productoService.crearProducto(payload);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert("Error al guardar producto");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto definitivamente?')) {
      await productoService.eliminarProducto(id);
      loadData();
    }
  };

  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${colors.bgPage} p-8`}>
      <header className="flex justify-between items-center mb-8">
        <h2 className={`text-2xl font-bold ${colors.textMain}`}>Panel de Control</h2>
        <button onClick={() => handleOpenModal()} className={`${colors.buttonPrimary} px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg transition`}>
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

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#d8bf9f]/20">
        <table className="w-full text-left">
          <thead className="bg-[#4a3b2a]/5 text-[#4a3b2a] text-sm uppercase font-bold border-b border-[#d8bf9f]/20">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
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
                      <button 
                        onClick={() => handleOpenModal(producto)} // <--- Antes decía openModal
                        className="text-gray-400 hover:text-[#4a3b2a] transition p-1"
                      >
                        <FiEdit2 size={18}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(producto.id)} 
                        className="text-gray-400 hover:text-red-600 transition p-1"
                      >
                        <FiTrash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
        </table>
      </div>

      <ProductoModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        categorias={categorias}
        colors={colors}
      />
    </div>
  );
};

export default AdminDashboard;