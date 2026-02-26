import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productoService } from '../services/productoService';
import { FiArrowLeft } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

import ProductoGaleria from './ProductoGaleria';
import ProductoInfo from './ProductoInfo';
import TablaTallesModal from './TablaTallesModal';

const ProductoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setShowCart } = useCart();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTablaTalles, setShowTablaTalles] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const res = await productoService.getProductoById(id);
        setProducto(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducto();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f9f5f0]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a3b2a]"></div></div>;
  if (!producto) return <div className="text-center py-20">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#f9f5f0] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>{`${producto.nombre} | Camel Shop`}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-[#4a3b2a] mb-8 transition font-medium"
          aria-label="Volver al catálogo"
        >
          <FiArrowLeft className="mr-2" /> Volver al catálogo
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          <ProductoGaleria producto={producto} />
          
          <ProductoInfo 
            producto={producto} 
            onAddToCart={(variantData, qty) => {
              addToCart({ ...producto, ...variantData }, qty);
              setShowCart(true);
            }} 
            onOpenSizeChart={() => setShowTablaTalles(true)}
          />
        </div>
      </div>

      <TablaTallesModal isOpen={showTablaTalles} onClose={() => setShowTablaTalles(false)} />
    </div>
  );
};

export default ProductoDetallePage;