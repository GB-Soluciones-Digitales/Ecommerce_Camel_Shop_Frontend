import React, { useEffect, useReducer, useMemo } from 'react';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { fileService } from '../services/fileService';
import { FiShoppingCart, FiSearch, FiFilter } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const initialState = {
  productos: [],
  categorias: [],
  selectedCategory: null,
  searchTerm: '',
  loading: true,
};

function catalogReducer(state, action) {
  switch (action.type) {
    case 'START_LOADING': return { ...state, loading: true };
    case 'LOAD_DATA': return { ...state, productos: action.productos, categorias: action.categorias, loading: false };
    case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload };
    case 'SET_SEARCH': return { ...state, searchTerm: action.payload };
    case 'RESET_FILTERS': return { ...state, searchTerm: '', selectedCategory: null };
    default: return state;
  }
}

const ProductosPage = () => {
  const [state, dispatch] = useReducer(catalogReducer, initialState);
  const [searchParams] = useSearchParams();
  const categoriaQuery = searchParams.get('categoria');

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'START_LOADING' });
        const [prodRes, catRes] = await Promise.all([
          productoService.getProductosActivos(),
          categoriaService.getCategorias(),
        ]);
        const fetchedProds = Array.isArray(prodRes.data) ? prodRes.data : [];
        const fetchedCats = Array.isArray(catRes.data) ? catRes.data : [];
        
        dispatch({ type: 'LOAD_DATA', productos: fetchedProds, categorias: fetchedCats });

        if (categoriaQuery) {
          const target = fetchedCats.find(c => c.nombre.toLowerCase() === categoriaQuery.toLowerCase());
          if (target) dispatch({ type: 'SET_CATEGORY', payload: target.id });
        }
      } catch (error) { console.error(error); }
    };
    loadData();
  }, [categoriaQuery]);

  const filteredProductos = useMemo(() => {
    return state.productos.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchCat = !state.selectedCategory || p.categoriaId === state.selectedCategory;
      return matchSearch && matchCat;
    });
  }, [state.productos, state.searchTerm, state.selectedCategory]);

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  return (
    <div className="min-h-screen bg-[#f9f5f0] pb-20">
      <Helmet>
        <title>Catálogo | Camel Shop</title>
      </Helmet>

      <div className="sticky top-0 z-30 bg-[#f9f5f0]/95 backdrop-blur-md border-b border-[#4a3b2a]/5 py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className="text-2xl font-black uppercase text-[#4a3b2a]">Colección</h1>
          <div className="relative w-full md:w-80 group">
            <label htmlFor="search-input" className="sr-only">Buscar productos</label>
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              id="search-input"
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:ring-1 focus:ring-[#4a3b2a] outline-none"
              value={state.searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            />
          </div>
        </div>

        <nav className="max-w-7xl mx-auto mt-4 overflow-x-auto pb-2 flex gap-2 no-scrollbar" aria-label="Categorías">
          <button 
            onClick={() => dispatch({ type: 'SET_CATEGORY', payload: null })}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition whitespace-nowrap ${!state.selectedCategory ? 'bg-[#4a3b2a] text-[#d8bf9f]' : 'bg-white text-gray-500 border border-gray-200'}`}
          >
            Todo
          </button>
          {state.categorias.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => dispatch({ type: 'SET_CATEGORY', payload: cat.id })}
              className={`px-5 py-1.5 rounded-full text-sm font-bold transition whitespace-nowrap ${state.selectedCategory === cat.id ? 'bg-[#4a3b2a] text-[#d8bf9f]' : 'bg-white text-gray-500 border border-gray-200'}`}
            >
              {cat.nombre}
            </button>
          ))}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {state.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProductos.length === 0 ? (
          <EmptyState onReset={() => dispatch({ type: 'RESET_FILTERS' })} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProductos.map((p) => (
              <ProductCard key={p.id} producto={p} getImgUrl={getImgUrl} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Componentes internos para reducir el tamaño del archivo principal
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const EmptyState = ({ onReset }) => (
  <div className="text-center py-20">
    <FiFilter size={32} className="mx-auto text-gray-300 mb-4"/>
    <p className="text-gray-500 font-medium">No hay productos que coincidan.</p>
    <button onClick={onReset} className="mt-2 text-[#4a3b2a] font-bold text-sm underline">Limpiar filtros</button>
  </div>
);

const ProductCard = ({ producto, getImgUrl }) => (
  <div className="group flex flex-col">
    <Link to={`/producto/${producto.id}`} className="block relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
      <img 
        src={getImgUrl(producto.imagenes?.[0])} 
        alt={producto.nombre} 
        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      {producto.stock === 0 && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
          <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase">Agotado</span>
        </div>
      )}
    </Link>
    <h3 className="text-sm font-bold text-[#4a3b2a] uppercase truncate">
      <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
    </h3>
    <p className="text-xs text-gray-500">{producto.categoriaNombre}</p>
    <p className="text-lg font-black text-[#4a3b2a] mt-auto">
      ${parseFloat(producto.precio).toLocaleString()}
    </p>
  </div>
);

export default ProductosPage;