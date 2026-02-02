import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { fileService } from '../services/fileService';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Paleta Local
  const colors = {
    bgPage: 'bg-[#f9f5f0]',
    textMain: 'text-[#4a3b2a]',
    buttonActive: 'bg-[#4a3b2a] text-[#d8bf9f] border-[#4a3b2a]',
    buttonInactive: 'bg-[#d8bf9f]/30 text-gray-600 hover:bg-[#d8bf9f]/10 border-gray-200',
    cardButton: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]'
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productoService.getProductosActivos(),
          categoriaService.getCategorias(),
        ]);
        setProductos(prodRes.data);
        setCategorias(catRes.data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...productos];
    if (searchTerm) filtered = filtered.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory) filtered = filtered.filter(p => p.categoriaId === selectedCategory);
    setFilteredProductos(filtered);
  }, [searchTerm, selectedCategory, productos]);

  return (
    <div className={`min-h-screen ${colors.bgPage} py-8 px-4 sm:px-6 lg:px-8`}>
      
      <Helmet>
        <title>Catálogo Completo | Camel Shop</title>
        <meta name="description" content="Explorá nuestra variedad de indumentaria. Filtrá por remeras, pantalones o calzado y encontrá tu estilo ideal." />
      </Helmet>

      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className={`text-3xl font-bold ${colors.textMain}`}>Nuestra Colección</h1>
        
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar prenda..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4a3b2a] focus:border-[#4a3b2a] outline-none shadow-sm transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-8 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full font-bold transition whitespace-nowrap border ${!selectedCategory ? colors.buttonActive : colors.buttonInactive}`}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-bold transition whitespace-nowrap border ${selectedCategory === cat.id ? colors.buttonActive : colors.buttonInactive}`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
           <p className="col-span-full text-center py-20 text-gray-500">Cargando catálogo...</p>
        ) : filteredProductos.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-gray-500 text-lg">No encontramos productos con esa búsqueda.</p>
             <button onClick={() => {setSearchTerm(''); setSelectedCategory(null)}} className="mt-4 text-[#4a3b2a] font-bold hover:underline">Ver todo</button>
           </div>
        ) : (
          filteredProductos.map(producto => (
            <div key={producto.id} className="bg-[#d8bf9f]/30 rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group relative flex flex-col">
                <Link to={`/producto/${producto.id}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden">
                    <img 
                        src={fileService.getImageUrl(producto.imagenes?.[0])} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {producto.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold uppercase tracking-widest">
                            Agotado
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white text-[#4a3b2a] px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition">
                        Ver Detalle
                    </span>
                    </div>
                </Link>

                <div className="p-4 flex flex-col flex-1">
                    <Link to={`/producto/${producto.id}`}>
                        <h3 className={`font-bold ${colors.textMain} mb-1 hover:text-black transition line-clamp-1`}>{producto.nombre}</h3>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">{producto.descripcion}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                        <span className={`text-xl font-bold ${colors.textMain}`}>${parseFloat(producto.precio).toLocaleString()}</span>
                        <Link to={`/producto/${producto.id}`} className={`p-3 rounded-xl ${colors.cardButton} transition shadow-md`}>
                            <FiShoppingCart size={18} />
                        </Link>
                    </div>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductosPage;