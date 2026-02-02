import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { heroService } from '../services/heroService';
import { fileService } from '../services/fileService';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await heroService.getPublicSlides();
        setSlides(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error cargando hero slides", error);
        setSlides([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="h-[85vh] w-full bg-[#d8bf9f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a3b2a]"></div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[85vh] w-full bg-[#d8bf9f] flex items-center justify-center text-[#4a3b2a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5"></div>
        
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <div className="mb-6 flex justify-center">
            <div className="bg-[#4a3b2a] text-[#d8bf9f] p-5 rounded-2xl shadow-xl">
               <FiShoppingBag size={40} />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Camel Shop</h1>
          <p className="text-xl text-[#4a3b2a]/80 mb-8 font-medium">
            La tienda está lista. Ve al panel de administración para configurar tus banners.
          </p>
          <Link to="/productos" className="inline-flex items-center gap-2 bg-[#4a3b2a] hover:bg-black text-[#d8bf9f] px-8 py-3 rounded-full font-bold transition shadow-lg">
            Ver Catálogo <FiArrowRight />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] w-full bg-gray-900 overflow-hidden group">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        navigation={true}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="h-full w-full hero-swiper"
      >
        {Array.isArray(slides) && slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            
            <div className="absolute inset-0">
               <img 
                 src={fileService.getImageUrl(slide.imagenUrl)} 
                 alt={slide.titulo} 
                 className="w-full h-full object-cover" 
               />
               <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className={`w-full md:w-2/3 text-white space-y-6 
                  ${slide.alineacion === 'right' ? 'ml-auto text-right items-end flex flex-col' : ''}
                  ${slide.alineacion === 'center' ? 'mx-auto text-center items-center flex flex-col' : ''}
                  ${slide.alineacion === 'left' ? 'text-left items-start flex flex-col' : ''}
              `}>
                
                {slide.subtitulo && (
                  <span className="inline-block px-4 py-1.5 border border-[#d8bf9f] bg-[#d8bf9f]/20 backdrop-blur-md rounded-full text-sm font-bold tracking-wider uppercase animate-fade-in-up text-[#d8bf9f]">
                    {slide.subtitulo}
                  </span>
                )}
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg animate-fade-in-up delay-100">
                  {slide.titulo}
                </h1>
                
                {slide.descripcion && (
                  <p className="text-lg md:text-xl text-gray-100 max-w-lg drop-shadow-md animate-fade-in-up delay-200 font-medium">
                    {slide.descripcion}
                  </p>
                )}

                {slide.botonTexto && (
                  <div className="pt-4 animate-fade-in-up delay-300">
                    <Link 
                      to={slide.botonLink || '/productos'} 
                      className="inline-flex items-center gap-2 bg-[#d8bf9f] hover:bg-white text-[#4a3b2a] px-8 py-4 rounded-full font-bold text-lg transition shadow-lg transform hover:-translate-y-1"
                    >
                      {slide.botonTexto} <FiArrowRight />
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: #d8bf9f; /* Color Arena para flechas */
          opacity: 0;
          transition: opacity 0.3s;
        }
        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 0.8;
        }
        .hero-swiper .swiper-pagination-bullet {
           background: white;
           opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background-color: #d8bf9f !important; /* Camel/Arena */
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;