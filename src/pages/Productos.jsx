import React, { useState, useEffect } from 'react';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { fileService } from '../services/fileService';
import { FiShoppingCart, FiSearch, FiFilter } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [searchParams] = useSearchParams();
  const categoriaQuery = searchParams.get('categoria');
  
  const colors = {
    bgPage: 'bg-[#f9f5f0]',
    textMain: 'text-[#4a3b2a]',
    accent: 'text-[#d8bf9f]',
    buttonActive: 'bg-[#4a3b2a] text-[#d8bf9f]',
    buttonInactive: 'bg-white text-gray-500 border border-gray-200 hover:border-[#4a3b2a] hover:text-[#4a3b2a]',
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productoService.getProductosActivos(),
          categoriaService.getCategorias(),
        ]);
        
        const fetchedProductos = Array.isArray(prodRes.data) ? prodRes.data : [];
        const fetchedCategorias = Array.isArray(catRes.data) ? catRes.data : [];
        
        setProductos(fetchedProductos);
        setCategorias(fetchedCategorias);

        if (categoriaQuery && fetchedCategorias.length > 0) {
          const targetCategory = fetchedCategorias.find(
            cat => cat.nombre.toLowerCase() === categoriaQuery.toLowerCase()
          );
          if (targetCategory) setSelectedCategory(targetCategory.id);
        }
      } catch (error) { 
        console.error("Error cargando datos:", error);
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, [categoriaQuery]);

  useEffect(() => {
    let filtered = [...productos];
    if (searchTerm) filtered = filtered.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory) filtered = filtered.filter(p => p.categoriaId === selectedCategory);
    setFilteredProductos(filtered);
  }, [searchTerm, selectedCategory, productos]);

  // Helper para imágenes
  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  return (
    <div className={`min-h-screen ${colors.bgPage} pb-20`}>
      <Helmet>
        <title>Catálogo | Camel Shop</title>
        <meta name="description" content="Explorá nuestra colección de moda urbana." />
      </Helmet>

      {/* HEADER & FILTROS STICKY */}
      <div className="sticky top-0 z-30 bg-[#f9f5f0]/95 backdrop-blur-md border-b border-[#4a3b2a]/5 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className={`text-2xl font-black uppercase tracking-tight ${colors.textMain}`}>Colección</h1>
          
          <div className="relative w-full md:w-80 group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4a3b2a] transition" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#4a3b2a] focus:border-[#4a3b2a] outline-none text-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CATEGORÍAS SCROLLABLE */}
        <div className="max-w-7xl mx-auto mt-4 overflow-x-auto pb-2 no-scrollbar flex gap-2">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition whitespace-nowrap ${!selectedCategory ? colors.buttonActive : colors.buttonInactive}`}
          >
            Todo
          </button>
          {Array.isArray(categorias) && categorias.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-1.5 rounded-full text-sm font-bold transition whitespace-nowrap ${selectedCategory === cat.id ? colors.buttonActive : colors.buttonInactive}`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1,2,3,4,5,6,7,8].map(i => (
               <div key={i} className="animate-pulse">
                 <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-3"></div>
                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
               </div>
             ))}
           </div>
        ) : filteredProductos.length === 0 ? (
           <div className="text-center py-20">
             <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm"><FiFilter size={32} className="text-gray-300"/></div>
             <p className="text-gray-500 font-medium">No hay productos que coincidan.</p>
             <button onClick={() => {setSearchTerm(''); setSelectedCategory(null)}} className="mt-2 text-[#4a3b2a] font-bold text-sm underline">Limpiar filtros</button>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProductos.map((producto) => (
              <div key={producto.id} className="group flex flex-col">
                <Link to={`/producto/${producto.id}`} className="block relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={getImgUrl(producto.imagenes?.[0])} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {producto.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">Agotado</span>
                    </div>
                  )}
                  {/* Botón flotante "Quick Add" solo visual por ahora */}
                  <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
                    <span className="bg-white text-[#4a3b2a] p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-[#4a3b2a] hover:text-[#d8bf9f]">
                      <FiShoppingCart />
                    </span>
                  </div>
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-[#4a3b2a] uppercase tracking-wide line-clamp-1 group-hover:text-black transition">
                      <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">{producto.categoriaNombre}</p>
                  <p className="text-lg font-black text-[#4a3b2a] mt-auto">
                    ${parseFloat(producto.precio).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosPage;