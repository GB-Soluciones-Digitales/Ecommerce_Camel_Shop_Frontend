import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productoService } from '../services/productoService';
import { fileService } from '../services/fileService';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const ProductoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setShowCart } = useCart();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [error, setError] = useState('');
  
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Paleta Local
  const colors = {
    bg: 'bg-[#f9f5f0]',
    textMain: 'text-[#4a3b2a]',
    textLight: 'text-[#4a3b2a]/70',
    accent: 'text-[#d8bf9f]',
    button: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]',
    border: 'border-[#4a3b2a]/20'
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const res = await productoService.getProductoById(id);
        setProducto(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleAddToCart = () => {
    if (producto.talles && producto.talles.length > 0 && !talleSeleccionado) {
      setError('Por favor, seleccioná un talle.');
      return;
    }
    
    addToCart({ ...producto, selectedSize: talleSeleccionado || 'Único' }, cantidad);
    navigate('/productos'); 
    setShowCart(true); 
  };

  const handleQuantity = (val) => {
    if (val < 1) return;
    if (val > producto.stock) return;
    setCantidad(val);
  };

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a3b2a]"></div></div>;

  if (!producto) return <div className="text-center py-20">Producto no encontrado</div>;

  const galleryImages = (producto.imagenes && producto.imagenes.length > 0) 
    ? producto.imagenes 
    : [producto.imagenUrl];

  return (
    <div className={`min-h-screen ${colors.bg} py-8 px-4 sm:px-6 lg:px-8`}>

      <Helmet>
        <title>{producto ? `${producto.nombre} | Camel Shop` : 'Cargando... | Camel Shop'}</title>
        <meta name="description" content={producto ? producto.descripcion : 'Detalle del producto en Camel Shop'} />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className={`flex items-center text-gray-500 hover:text-[#4a3b2a] mb-8 transition font-medium`}>
          <FiArrowLeft className="mr-2" /> Volver al catálogo
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* GALERÍA DE IMÁGENES */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-[#4a3b2a]/10 relative group shadow-sm">
               <Swiper
                 style={{
                   '--swiper-navigation-color': '#d8bf9f',
                   '--swiper-pagination-color': '#d8bf9f',
                 }}
                 spaceBetween={10}
                 navigation={true}
                 thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                 modules={[FreeMode, Navigation, Thumbs]}
                 className="h-full w-full"
               >
                 {galleryImages.map((img, index) => (
                   <SwiperSlide key={index}>
                     <img 
                       src={fileService.getImageUrl(img)} 
                       alt={`${producto.nombre} - vista ${index + 1}`} 
                       className="w-full h-full object-cover"
                     />
                     {producto.stock === 0 && (
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <span className="bg-white text-black px-4 py-2 text-sm font-bold uppercase tracking-widest">Agotado</span>
                       </div>
                     )}
                   </SwiperSlide>
                 ))}
               </Swiper>
            </div>

            {galleryImages.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="h-24 w-full"
              >
                {galleryImages.map((img, index) => (
                  <SwiperSlide 
                    key={index}
                    className="rounded-lg overflow-hidden cursor-pointer border-2 border-transparent [&.swiper-slide-thumb-active]:border-[#4a3b2a] opacity-60 [&.swiper-slide-thumb-active]:opacity-100 transition-all"
                  >
                    <img 
                      src={fileService.getImageUrl(img)} 
                      alt={`Miniatura ${index}`} 
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* DETALLES DEL PRODUCTO */}
          <div className="flex flex-col">
            <h1 className={`text-4xl font-bold ${colors.textMain} mb-2`}>{producto.nombre}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className={`text-3xl font-bold ${colors.textMain}`}>${parseFloat(producto.precio).toLocaleString()}</span>
              {producto.stock > 0 && producto.stock < 5 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <FiAlertCircle /> ¡Quedan solo {producto.stock}!
                </span>
              )}
            </div>

            <p className={`${colors.textLight} leading-relaxed mb-8 text-lg`}>
              {producto.descripcion}
            </p>

            {producto.tipoTalle !== 'UNICO' && producto.talles && producto.talles.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className={`font-bold ${colors.textMain}`}>
                    Seleccionar Talle ({producto.tipoTalle === 'CALZADO' ? 'Numérico' : 'Indumentaria'})
                  </span>
                  {producto.tipoTalle === 'ROPA' && (
                    <button 
                      onClick={() => setShowSizeChart(true)}
                      className="text-[#4a3b2a] text-sm font-bold hover:underline flex items-center gap-1"
                    >
                      <FiInfo /> Guía de Talles
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {producto.talles.sort((a,b) => producto.tipoTalle === 'CALZADO' ? a-b : 0).map((talle) => (
                    <button
                      key={talle}
                      onClick={() => { setTalleSeleccionado(talle); setError(''); }}
                      className={`min-w-[3.5rem] px-3 h-14 rounded-lg border-2 font-bold transition flex items-center justify-center ${
                        talleSeleccionado === talle
                          ? 'border-[#4a3b2a] bg-[#4a3b2a] text-[#d8bf9f]'
                          : 'border-gray-300 text-gray-600 hover:border-[#4a3b2a]'
                      }`}
                    >
                      {talle}
                    </button>
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><FiAlertCircle/> {error}</p>}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className={`flex items-center border ${colors.border} rounded-xl w-fit bg-white`}>
                <button 
                  onClick={() => handleQuantity(cantidad - 1)}
                  className="p-4 text-gray-600 hover:text-[#4a3b2a] disabled:opacity-50"
                  disabled={cantidad <= 1}
                >
                  <FiMinus />
                </button>
                <span className={`w-12 text-center font-bold text-lg ${colors.textMain}`}>{cantidad}</span>
                <button 
                  onClick={() => handleQuantity(cantidad + 1)}
                  className="p-4 text-gray-600 hover:text-[#4a3b2a] disabled:opacity-50"
                  disabled={cantidad >= producto.stock}
                >
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={producto.stock === 0}
                className={`flex-1 ${colors.button} font-bold py-4 px-8 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed`}
              >
                <FiShoppingCart size={20} />
                {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
              </button>
            </div>

            <div className={`border-t ${colors.border} pt-6 space-y-4`}>
              <div className={`flex gap-3 text-sm ${colors.textLight} font-medium`}>
                <FiTruck className="text-[#4a3b2a] text-xl" />
                <span>Envío gratis a partir de $50.000</span>
              </div>
              <div className={`flex gap-3 text-sm ${colors.textLight} font-medium`}>
                <FiShield className="text-[#4a3b2a] text-xl" />
                <span>Garantía de calidad. Cambio gratis por 30 días.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSizeChart(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${colors.textMain}`}>Guía de Talles</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p className="text-gray-600 mb-4">Como manejamos distintos tipos de productos (Remeras, Jeans, Zapatillas), te recomendamos consultar las medidas específicas por WhatsApp si tenés dudas.</p>
            <button onClick={() => setShowSizeChart(false)} className={`w-full ${colors.button} font-bold py-2 rounded-lg`}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoDetallePage;