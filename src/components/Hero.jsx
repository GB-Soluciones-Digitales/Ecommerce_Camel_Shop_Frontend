import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { heroService } from '../services/heroService';
import { fileService } from '../services/fileService';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HeroSlider = () => {
  const defaultSlide = {
    id: 'default-hero',
    imagenUrl: '/hero.jpg',
    titulo: 'Estilo Urbano Redefinido.',
    subtitulo: 'NUEVA TEMPORADA',
    descripcion: 'Descubre la fusión perfecta entre comodidad y tendencia. Prendas diseñadas para conquistar la ciudad.',
    botonTexto: 'Ver Colección',
    botonLink: '/productos',
    alineacion: 'left'
  };

  const [slides, setSlides] = useState([defaultSlide]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await heroService.getPublicSlides();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSlides(res.data);
        }
      } catch (error) {
        console.error("Error cargando hero slides:", error);
      }
    };
    fetchSlides();
  }, []);

  return (
    <section className="relative h-[90vh] md:h-screen w-full bg-crema overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 1} 
        className="h-full w-full hero-swiper"
      >
        {slides.map((slide, index) => {
          const isDefault = slide.id === 'default-hero';

          const imgSrc = isDefault 
             ? window.location.origin + '/hero.jpg' 
             : fileService.getImageUrl(slide.imagenUrl, 1600);
             
          const srcSetString = isDefault 
            ? undefined 
            : `${fileService.getImageUrl(slide.imagenUrl, 400)} 400w, ${fileService.getImageUrl(slide.imagenUrl, 800)} 800w, ${fileService.getImageUrl(slide.imagenUrl, 1200)} 1200w, ${fileService.getImageUrl(slide.imagenUrl, 1600)} 1600w`;

          return (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              
              <div className="absolute inset-0">
                <img 
                  src={imgSrc}
                  srcSet={srcSetString}
                  sizes="100vw"
                  alt={slide.titulo || 'Camel Shop Hero'} 
                  className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[10000ms]"
                  fetchpriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-crema"></div>
              </div>

              {/* Contenido */}
              <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-center pb-20 md:pb-0">
                <div className={`w-full md:w-3/4 space-y-6 
                    ${slide.alineacion === 'right' ? 'text-right flex flex-col items-end' : ''}
                    ${slide.alineacion === 'center' ? 'text-center flex flex-col items-center' : ''}
                    ${slide.alineacion === 'left' ? 'text-left flex flex-col items-start' : ''}
                `}>
                  
                  {slide.subtitulo && (
                    <span className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase text-brand-primary bg-brand-muted/50 rounded-2xl border p-2 drop-shadow-md">
                      {slide.subtitulo}
                    </span>
                  )}
                  
                  <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-serif font-bold text-brand-dark leading-[1.1] drop-shadow-lg">
                    {slide.titulo}
                  </h1>
                  
                  {slide.descripcion && (
                    <p className="text-lg md:text-2xl text-black/50 max-w-2xl font-light">
                      {slide.descripcion}
                    </p>
                  )}

                  {slide.botonTexto && (
                    <div className="pt-6">
                      <Link 
                        to={slide.botonLink || '/productos'} 
                        className="inline-block bg-crema text-brand-dark px-10 py-4 rounded-sm font-medium tracking-widest uppercase text-xs md:text-sm hover:bg-brand-dark hover:text-crema transition-colors duration-300 shadow-lg"
                      >
                        {slide.botonTexto}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </SwiperSlide>
          );
        })}
      </Swiper>

      <style>{`
      .hero-swiper .swiper-pagination-bullet {
        background: #F9F6F0;
        opacity: 0.5;
      }
      .hero-swiper .swiper-pagination-bullet-active {
        background-color: #783D19;
        opacity: 1;
      }
      `}</style>
    </section>
  );
};

export default HeroSlider;