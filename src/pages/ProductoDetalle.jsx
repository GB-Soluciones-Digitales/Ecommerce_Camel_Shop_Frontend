import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productoService } from '../services/productoService';
import { fileService } from '../services/fileService';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiAlertCircle, FiInfo, FiCheck } from 'react-icons/fi';
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
  
  // Estados para selección de variantes
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTalle, setSelectedTalle] = useState(null);
  
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
        
        // Pre-seleccionar el primer color si existen variantes
        if (res.data.variantes && res.data.variantes.length > 0) {
            setSelectedColor(res.data.variantes[0].color);
        }
      } catch (err) {
        console.error(err);
        // Opcional: navigate('/productos') si querés redirigir al fallar
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  // Lógica de Variantes
  const currentVariant = producto?.variantes?.find(v => v.color === selectedColor);
  
  // Obtenemos talles con stock > 0 para el color seleccionado
  const availableSizes = currentVariant 
    ? Object.entries(currentVariant.stockPorTalle || {})
        .filter(([_, qty]) => qty > 0)
        .map(([talle]) => talle)
    : [];

  // Orden personalizado para ropa (si aplica)
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const sortedSizes = availableSizes.sort((a, b) => {
     // Si son números (calzado), ordenar numéricamente
     if (!isNaN(a) && !isNaN(b)) return a - b;
     // Si son talles de ropa, usar índice
     return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  });

  const handleAddToCart = () => {
    // Validaciones
    if (producto.variantes && producto.variantes.length > 0) {
        if (!selectedColor) {
            setError('Por favor, seleccioná un color.');
            return;
        }
        // Si el producto tiene talles definidos (no es Único) y no seleccionó talle
        if (availableSizes.length > 0 && !selectedTalle) {
             // Excepción: si el único talle disponible es "U" o "Único", lo auto-seleccionamos si querés, 
             // pero mejor obligar la selección o manejarlo acá.
             // Si el talle es 'U', podés seleccionarlo auto:
             if (availableSizes.length === 1 && (availableSizes[0] === 'U' || availableSizes[0] === 'Único')) {
                 // Pass
             } else {
                 setError('Por favor, seleccioná un talle.');
                 return;
             }
        }
    }

    const talleFinal = selectedTalle || (availableSizes.length === 1 ? availableSizes[0] : 'Único');

    addToCart({ 
        ...producto, 
        selectedColor: selectedColor || 'Único',
        selectedSize: talleFinal,
        // Generamos un ID único para esta combinación en el carrito
        variantId: `${producto.id}-${selectedColor}-${talleFinal}`
    }, cantidad);
    
    setError('');
    // Abrir carrito (opcional, o navegar)
    setShowCart(true);
  };

  const handleQuantity = (val) => {
    if (val < 1) return;
    // Opcional: Validar contra stock real de la variante
    const stockReal = currentVariant?.stockPorTalle?.[selectedTalle] || producto.stock;
    if (val > stockReal) return;
    setCantidad(val);
  };

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  if (loading) return <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a3b2a]"></div></div>;

  if (!producto) return <div className="text-center py-20">Producto no encontrado</div>;

  const galleryImages = (producto.imagenes && producto.imagenes.length > 0) 
    ? producto.imagenes 
    : [producto.imagenUrl]; // Fallback

  return (
    <div className={`min-h-screen ${colors.bg} py-12 px-4 sm:px-6 lg:px-8 font-sans`}>

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
                       src={getImgUrl(img)} 
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
                      src={getImgUrl(img)} 
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
            <div className="mb-auto">
                <span className="text-sm font-bold text-[#d8bf9f] uppercase tracking-wider">{producto.categoriaNombre}</span>
                <h1 className="text-4xl font-black text-[#4a3b2a] mt-2 mb-4 leading-tight">{producto.nombre}</h1>
                <p className="text-3xl font-bold text-[#4a3b2a] mb-6">${producto.precio?.toLocaleString()}</p>
                
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">{producto.descripcion}</p>

                {producto.stock > 0 ? (
                    <div className="space-y-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        {/* SELECTOR DE COLOR */}
                        {producto.variantes?.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Color</h3>
                                <div className="flex flex-wrap gap-3">
                                {producto.variantes.map((v, idx) => (
                                    <button
                                    key={idx}
                                    onClick={() => { setSelectedColor(v.color); setSelectedTalle(null); setError(''); }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${
                                        selectedColor === v.color 
                                        ? 'bg-[#4a3b2a] text-[#d8bf9f] border-[#4a3b2a]' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#4a3b2a]'
                                    }`}
                                    >
                                    {v.color}
                                    </button>
                                ))}
                                </div>
                            </div>
                        )}

                        {/* SELECTOR DE TALLE (Dinámico) */}
                        {selectedColor && sortedSizes.length > 0 && (
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Talle</h3>
                                    {producto.tipoTalle === 'ROPA' && (
                                        <button 
                                            onClick={() => setShowSizeChart(true)}
                                            className="text-[#4a3b2a] text-xs font-bold hover:underline flex items-center gap-1"
                                        >
                                            <FiInfo /> Guía de Talles
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                {sortedSizes.map(talle => (
                                    <button
                                    key={talle}
                                    onClick={() => { setSelectedTalle(talle); setError(''); }}
                                    className={`min-w-[3.5rem] h-12 flex items-center justify-center rounded-lg border-2 font-bold transition ${
                                        selectedTalle === talle
                                        ? 'border-[#4a3b2a] bg-[#4a3b2a] text-[#d8bf9f]'
                                        : 'border-gray-200 text-gray-600 hover:border-[#4a3b2a]'
                                    }`}
                                    >
                                    {talle}
                                    </button>
                                ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Mensaje si no hay stock del color */}
                        {selectedColor && sortedSizes.length === 0 && (
                             <p className="text-sm text-red-500 font-medium flex items-center gap-2">
                                <FiAlertCircle /> Sin stock disponible para {selectedColor}.
                             </p>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl font-bold text-center border border-red-100">
                        Producto Agotado
                    </div>
                )}
            </div>

            {/* ACCIONES */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                  <FiAlertCircle /> {error}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                 {/* Selector Cantidad */}
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
                        disabled={producto.stock === 0}
                    >
                        <FiPlus />
                    </button>
                 </div>

                 <button
                    onClick={handleAddToCart}
                    disabled={producto.stock === 0}
                    className={`flex-1 ${colors.button} font-bold py-4 px-8 rounded-xl shadow-xl shadow-[#4a3b2a]/20 hover:bg-black hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                 >
                    <FiShoppingCart size={20} />
                    {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                 </button>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-gray-500 mt-4">
                <div className="flex items-center gap-2">
                    <FiCheck className="text-green-500" /> Stock disponible.
                </div>
                <div className="flex items-center gap-2">
                    <FiTruck className="text-[#4a3b2a]" /> Envío a todo el país.
                </div>
                <div className="flex items-center gap-2">
                    <FiShield className="text-[#4a3b2a]" /> Compra protegida.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSizeChart(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border-2 border-[#d8bf9f]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-2xl font-black ${colors.textMain} uppercase tracking-tighter`}>Guía de Talles</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-400 hover:text-gray-600"><FiArrowLeft size={24} className="rotate-180"/></button>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
                Cada prenda tiene un calce único (Oversize, Slim, Regular). 
                Para asegurarte el talle perfecto, te recomendamos enviarnos tus medidas por WhatsApp.
            </p>
            <button onClick={() => setShowSizeChart(false)} className={`w-full ${colors.button} font-bold py-3 rounded-xl uppercase tracking-widest`}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoDetallePage;