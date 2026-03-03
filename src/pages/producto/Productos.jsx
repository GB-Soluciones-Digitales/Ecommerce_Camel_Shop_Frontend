import React, { useEffect, useReducer, useMemo } from 'react';
import { productoService } from '../../services/productoService';
import { categoriaService } from '../../services/categoriaService';
import { fileService } from '../../services/fileService';
import { FiSearch, FiFilter, FiArrowRight } from 'react-icons/fi';
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
          categoriaService.getCategorias()
        ]);
        dispatch({ type: 'LOAD_DATA', productos: prodRes.data, categorias: catRes.data });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'LOAD_DATA', productos: [], categorias: [] });
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (state.categorias.length > 0) {
      if (categoriaQuery) {
        const cat = state.categorias.find(c => c.nombre.toLowerCase() === categoriaQuery.toLowerCase());
        if (cat) dispatch({ type: 'SET_CATEGORY', payload: cat.id });
      } else {
        dispatch({ type: 'SET_CATEGORY', payload: null });
      }
    }
  }, [categoriaQuery, state.categorias]);

  const filteredProducts = useMemo(() => {
    return state.productos.filter(p => {
      const matchCat = state.selectedCategory ? p.categoriaId === state.selectedCategory : true;
      const matchSearch = p.nombre.toLowerCase().includes(state.searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [state.productos, state.selectedCategory, state.searchTerm]);

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  return (
    <div className="min-h-screen bg-crema font-sans pb-24 pt-32">
      <Helmet>
        <title>Colección | CAMEL.</title>
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Encabezado Editorial */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-brand-dark mb-4 tracking-tight">La Colección</h1>
          <p className="text-brand-primary uppercase tracking-[0.2em] text-sm font-medium">Piezas esenciales para el día a día</p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-y border-brand-muted py-6">
          <div className="flex overflow-x-auto w-full md:w-auto gap-3 pb-2 md:pb-0 hide-scrollbar">
            <button 
              onClick={() => dispatch({ type: 'SET_CATEGORY', payload: null })}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${!state.selectedCategory ? 'bg-brand-dark text-crema' : 'bg-transparent text-brand-dark border border-brand-muted hover:border-brand-dark'}`}
            >
              Ver Todo
            </button>
            {state.categorias.map(c => (
              <button 
                key={c.id} 
                onClick={() => dispatch({ type: 'SET_CATEGORY', payload: c.id })}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${state.selectedCategory === c.id ? 'bg-brand-dark text-crema' : 'bg-transparent text-brand-dark border border-brand-muted hover:border-brand-dark'}`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
            <input 
              type="text" 
              placeholder="Buscar pieza..." 
              className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none text-sm text-brand-dark placeholder-brand-primary transition-colors"
              value={state.searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            />
          </div>
        </div>

        {/* Grilla de Productos */}
        {state.loading ? (
           <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-dark"></div></div>
        ) : filteredProducts.length === 0 ? (
           <EmptyState onReset={() => dispatch({ type: 'RESET_FILTERS' })} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} producto={p} getImgUrl={getImgUrl} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onReset }) => (
  <div className="text-center py-32">
    <p className="text-brand-primary font-serif text-2xl mb-4">No encontramos piezas con esos criterios.</p>
    <button onClick={onReset} className="text-brand-dark font-bold text-xs uppercase tracking-widest border-b border-brand-dark pb-1 hover:text-brand-primary hover:border-brand-primary transition-colors">Explorar Colección Completa</button>
  </div>
);

const ProductCard = ({ producto, getImgUrl }) => (
  <Link to={`/producto/${producto.id}`} className="group flex flex-col">
    <div className="relative aspect-[3/4] overflow-hidden bg-brand-light mb-5">
      <img 
        src={getImgUrl(producto.imagenes?.[0])} 
        alt={producto.nombre} 
        className="w-full h-full object-cover transition duration-[1.5s] ease-out group-hover:scale-105"
        loading="lazy"
      />
      {producto.stock === 0 && (
        <div className="absolute inset-0 bg-crema/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-brand-dark text-xs font-bold uppercase tracking-[0.2em]">Agotado</span>
        </div>
      )}
    </div>
    <div className="flex flex-col items-center text-center">
      <h3 className="text-lg font-serif text-brand-dark mb-1">{producto.nombre}</h3>
      <p className="text-brand-primary text-sm font-medium tracking-wide">${parseFloat(producto.precio).toLocaleString()}</p>
    </div>
  </Link>
);

export default ProductosPage;