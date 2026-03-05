import React, { useState, useEffect } from 'react';
import { productoService } from '../../services/productoService';
import { categoriaService } from '../../services/categoriaService';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiToggleLeft, FiToggleRight, FiImage } from 'react-icons/fi';
import ProductoModal from '../../components/ProductoModal'; 
import { fileService } from '../../services/fileService';

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
    <div className="min-h-screen bg-crema p-8 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark">Panel de Control</h2>
          <p className="text-brand-secondary">Gestiona el inventario de piezas</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-brand-dark hover:bg-black text-brand-muted px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-1 font-bold uppercase tracking-widest text-xs"
        >
          <FiPlus /> Nuevo Producto
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-4 border border-brand-primary/10">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            className="w-full pl-10 pr-4 py-2 bg-crema/30 border border-brand-muted rounded-lg outline-none focus:ring-2 focus:ring-brand-primary/20 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-brand-muted">
        <table className="w-full text-left">
          <thead className="bg-brand-light text-brand-dark text-[10px] uppercase font-bold tracking-[0.15em] border-b border-brand-muted">
            <tr>
              <th className="px-6 py-5">Producto</th>
              <th className="px-6 py-5">Categoria</th>
              <th className="px-6 py-5">Precio</th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-6 py-5 text-center">Estado</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {filteredProducts.map((producto) => (
              <tr key={producto.id} className="hover:bg-crema/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-brand-light overflow-hidden border border-brand-muted">
                      {producto.imagenes?.[0] ? (
                        <img 
                          src={producto.imagenes[0].startsWith('http') 
                            ? producto.imagenes[0] 
                            : fileService.getImageUrl(producto.imagenes[0])} 
                          alt={producto.nombre} 
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Camel'; }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <FiImage className="text-gray-300" size={20} />
                        </div>
                      )}
                    </div>
                    <span className="font-serif font-bold text-brand-dark text-lg">{producto.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-brand-secondary font-medium">{producto.categoriaNombre}</td>
                <td className="px-6 py-4 font-bold text-brand-dark">${parseFloat(producto.precio).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${producto.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {producto.stock} unidades
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => productoService.toggleEstadoProducto(producto.id).then(loadData)}
                    className={`text-2xl transition ${producto.activo ? 'text-brand-primary' : 'text-gray-300'}`}
                  >
                    {producto.activo ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleOpenModal(producto)} className="text-brand-secondary hover:text-brand-dark transition"><FiEdit2 size={18}/></button>
                  <button onClick={() => handleDelete(producto.id)} className="text-brand-secondary hover:text-red-700 transition"><FiTrash2 size={18}/></button>
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