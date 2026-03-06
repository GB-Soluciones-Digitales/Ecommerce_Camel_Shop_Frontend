import React, { useEffect, useReducer } from 'react';
import { productoService } from '../../services/productoService';
import { categoriaService } from '../../services/categoriaService';
import { fileService } from '../../services/fileService';
import { FiSearch, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from './Reveal';
import { sileo } from 'sileo';

const initialState = {
  productos: [],
  categorias: [],
  loading: true,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0
  }
};

function catalogReducer(state, action) {
  switch (action.type) {
    case 'START_LOADING': return { ...state, loading: true };
    case 'LOAD_CATEGORIES': return { ...state, categorias: action.payload };
    case 'LOAD_PRODUCTS': return { 
      ...state, 
      productos: action.productos, 
      pagination: action.pagination,
      loading: false 
    };
    default: return state;
  }
}

const ProductosPage = () => {
  const [state, dispatch] = useReducer(catalogReducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriaQuery = searchParams.get('categoria') || '';
  const searchQuery = searchParams.get('search') || '';
  const pageQuery = parseInt(searchParams.get('page')) || 0;

  useEffect(() => {
    const fetchCats = async () => {
      const res = await categoriaService.getCategorias();
      dispatch({ type: 'LOAD_CATEGORIES', payload: res.data });
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({ type: 'START_LOADING' });
        const res = await productoService.getProductosPublicos(searchQuery, categoriaQuery, pageQuery, 8);
        
        dispatch({ 
          type: 'LOAD_PRODUCTS', 
          productos: res.data.content, 
          pagination: {
            currentPage: res.data.number,
            totalPages: res.data.totalPages,
            totalElements: res.data.totalElements
          } 
        });
      } catch (err) {
        console.error(err);
        sileo.error({
          title: "Error de conexión",
          description: "No pudimos cargar la colección. Por favor, recargá la página."
        });
        dispatch({ type: 'LOAD_PRODUCTS', productos: [], pagination: { totalPages: 0, currentPage: 0 } });
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery, categoriaQuery, pageQuery]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
  };

  const handleCategoryChange = (catNombre) => {
    const newParams = new URLSearchParams();
    if (catNombre) newParams.set('categoria', catNombre);
    if (searchQuery) newParams.set('search', searchQuery);
    newParams.set('page', 0);
    setSearchParams(newParams);
  };

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  return (
    <div className="min-h-screen bg-crema font-sans pb-24 pt-32">
      <Helmet><title>Colección | CAMEL.</title></Helmet>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-brand-dark mb-4 tracking-tight">La Colección</h1>
          <p className="text-brand-primary uppercase tracking-[0.2em] text-sm font-medium">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Prendas esenciales para el día a día'}
          </p>
        </div>

        {/* Filtros dinámicos */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-y border-brand-muted py-6">
          <div className="flex overflow-x-auto w-full md:w-auto gap-3 pb-2 md:pb-0 hide-scrollbar">
            <button 
              onClick={() => handleCategoryChange('')}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${!categoriaQuery ? 'bg-brand-dark text-crema' : 'border border-brand-muted text-brand-dark hover:bg-brand-primary hover:text-brand-muted'}`}
            >
              Ver Todo
            </button>
            {state.categorias.map(c => (
              <button 
                key={c.id} 
                onClick={() => handleCategoryChange(c.nombre.toLowerCase())}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${categoriaQuery === c.nombre.toLowerCase() ? 'bg-brand-dark text-crema' : 'border border-brand-muted text-brand-dark hover:bg-brand-primary hover:text-brand-muted'}`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64 text-brand-dark">
             <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 opacity-50" />
             <input 
               type="text" 
               placeholder="Buscar..." 
               className="w-full pl-8 py-2 bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none text-sm transition-colors"
               defaultValue={searchQuery}
               onKeyDown={(e) => e.key === 'Enter' && setSearchParams({ search: e.target.value, page: 0 })}
             />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {state.loading ? (
             Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : state.productos.length === 0 ? (
             <div className="col-span-full text-center py-20 font-serif text-2xl text-brand-primary opacity-60">No se encontraron prendas</div>
          ) : (
            state.productos.map((p, index) => (
              <Reveal key={p.id} delay={index * 0.1}>
                <ProductCard key={p.id} producto={p} getImgUrl={getImgUrl} />
              </Reveal>
            ))
          )}
        </div>

        {!state.loading && state.pagination.totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-8 border-t border-brand-muted pt-10">
            <button 
              disabled={state.pagination.currentPage === 0}
              onClick={() => handlePageChange(state.pagination.currentPage - 1)}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] disabled:opacity-20 text-brand-dark hover:text-brand-primary transition-colors"
            >
              <FiArrowLeft /> Anterior
            </button>
            
            <span className="text-sm font-bold uppercase tracking-widest text-brand-secondary">
              {state.pagination.currentPage + 1} / {state.pagination.totalPages}
            </span>

            <button 
              disabled={state.pagination.currentPage >= state.pagination.totalPages - 1}
              onClick={() => handlePageChange(state.pagination.currentPage + 1)}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] disabled:opacity-20 text-brand-dark hover:text-brand-primary transition-colors"
            >
              Siguiente <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col animate-pulse">
    <div className="aspect-[3/4] bg-brand-muted rounded-[2rem] mb-5"></div>
    <div className="h-4 bg-brand-muted rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-3 bg-brand-muted rounded w-1/4 mx-auto"></div>
  </div>
);

const ProductCard = ({ producto, getImgUrl }) => (
  <Link to={`/producto/${producto.id}`} className="group flex flex-col relative">
    <div className="relative aspect-[3/4] overflow-hidden bg-brand-light mb-5 rounded-[2rem]">
      <img 
        src={getImgUrl(producto.imagenes?.[0])} 
        alt={producto.nombre}
        decoding="async"
        className="w-full h-full object-cover transition duration-[1.5s] ease-out group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Overlay al Hover */}
      <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
        <span className="bg-crema text-brand-dark px-6 py-2.5 rounded-full font-bold uppercase text-[10px] tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
          Ver Detalles
        </span>
      </div>

      {producto.stock === 0 && (
        <div className="absolute inset-0 bg-crema/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-brand-dark text-[10px] font-bold uppercase tracking-[0.2em]">Agotado</span>
        </div>
      )}
    </div>
    <div className="flex flex-col items-center text-center px-2">
      <h3 className="text-lg font-serif text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">{producto.nombre}</h3>
      <p className="text-brand-primary text-sm font-bold tracking-widest">${parseFloat(producto.precio).toLocaleString()}</p>
    </div>
  </Link>
);

export default ProductosPage;