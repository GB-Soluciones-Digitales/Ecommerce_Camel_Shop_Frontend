import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { productoService } from '../../services/productoService';
import { FiArrowLeft } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

import ProductoGaleria from './ProductoGaleria';
import ProductoInfo from './ProductoInfo';
import TablaTallesModal from '../../components/TablaTallesModal';

const ProductoDetallePage = () => {
  const { id } = useParams();
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
    window.scrollTo(0,0);
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-crema"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-dark"></div></div>;
  if (!producto) return <div className="min-h-screen bg-crema flex items-center justify-center font-serif text-2xl text-brand-primary">Pieza no encontrada.</div>;

  return (
    <div className="min-h-screen bg-crema font-sans pb-24 pt-32">
      <Helmet><title>{`${producto.nombre} | CAMEL.`}</title></Helmet>

      <div className="max-w-[1400px] mx-auto">
        <nav className="mb-10">
          <Link to="/productos" className="inline-flex items-center text-[12px] font-bold uppercase tracking-widest text-brand-secondary hover:text-brand-dark transition-colors">
            <FiArrowLeft className="mr-2" size={16} /> Volver a la colección
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 h-full">
            <ProductoGaleria producto={producto} />
          </div>
          <div className="lg:col-span-5 py-4">
            <ProductoInfo 
              producto={producto} 
              onAddToCart={(variantData, qty) => {
                const productoParaCarrito = {
                  ...producto,
                  ...variantData
                };
                addToCart(productoParaCarrito, qty);
                setShowCart(true);
              }}
              onOpenSizeChart={() => setShowTablaTalles(true)}
            />
          </div>
        </div>
      </div>

      <TablaTallesModal isOpen={showTablaTalles} onClose={() => setShowTablaTalles(false)} />
    </div>
  );
};

export default ProductoDetallePage;