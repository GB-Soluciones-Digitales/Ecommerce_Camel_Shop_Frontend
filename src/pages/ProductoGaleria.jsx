import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { fileService } from '../services/fileService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const ProductoGaleria = ({ producto }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  const galleryImages = (producto.imagenes && producto.imagenes.length > 0) 
    ? producto.imagenes 
    : [producto.imagenUrl];

  return (
    <div className="space-y-4">
      {/* Slider Principal */}
      <div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-[#4a3b2a]/10 relative group shadow-sm">
        <Swiper
          style={{
            '--swiper-navigation-color': '#4a3b2a',
            '--swiper-pagination-color': '#4a3b2a',
          }}
          spaceBetween={10}
          navigation={true}
          // Verificamos que el swiper de miniaturas esté listo antes de vincularlo
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="h-full w-full"
        >
          {galleryImages.map((img, index) => (
            <SwiperSlide key={`${producto.id}-main-${index}`}>
              <img 
                src={getImgUrl(img)} 
                alt={`${producto.nombre} - vista ${index + 1}`} 
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {producto.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-black px-4 py-2 text-sm font-bold uppercase tracking-widest">
                    Agotado
                  </span>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Miniaturas (Thumbs) */}
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
              key={`${producto.id}-thumb-${index}`}
              className="rounded-lg overflow-hidden cursor-pointer border-2 border-transparent [&.swiper-slide-thumb-active]:border-[#4a3b2a] opacity-60 [&.swiper-slide-thumb-active]:opacity-100 transition-all"
            >
              <img 
                src={getImgUrl(img)} 
                alt={`Miniatura ${index + 1} de ${producto.nombre}`} 
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProductoGaleria;