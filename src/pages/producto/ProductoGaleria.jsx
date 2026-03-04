import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade, FreeMode } from 'swiper/modules';
import { fileService } from '../../services/fileService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';

const ProductoGaleria = ({ producto }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  const galleryImages = (producto.imagenes && producto.imagenes.length > 0) 
    ? producto.imagenes 
    : [producto.imagenUrl];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Miniaturas */}
      {galleryImages.length > 1 && (
        <div className="w-full md:w-24 flex-shrink-0">
            <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={12}
            slidesPerView={4}
            direction={'horizontal'}
            breakpoints={{
                768: { direction: 'vertical', slidesPerView: 5 }
            }}
            watchSlidesProgress={true}
            modules={[Navigation, Thumbs, FreeMode]}
            className="h-24 md:h-full w-full"
            freeMode={true}
            >
            {galleryImages.map((img, index) => (
                <SwiperSlide 
                key={`${producto.id}-thumb-${index}`}
                className="cursor-pointer border border-transparent [&.swiper-slide-thumb-active]:border-brand-dark opacity-50 [&.swiper-slide-thumb-active]:opacity-100 transition-all duration-300"
                >
                <img 
                    src={getImgUrl(img)} 
                    alt={`Thumb ${index}`} 
                    className="w-full h-full object-cover"
                />
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
      )}

      {/* Imagen Principal */}
      <div className="flex-1 bg-brand-light relative w-full h-80 md:h-[450px] lg:h-[80vh] max-h-[700px] rounded-[2rem]">
        <Swiper
          style={{
            '--swiper-navigation-color': 'var(--color-brand-dark)',
            '--swiper-navigation-size': '20px',
          }}
          spaceBetween={0}
          navigation={true}
          effect="fade"
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[EffectFade, Navigation, Thumbs]}
          className="h-full w-full"
        >
          {galleryImages.map((img, index) => (
            <SwiperSlide key={`${producto.id}-main-${index}`} className="h-full w-full">
              <img 
                src={getImgUrl(img)} 
                alt={`${producto.nombre} - Vista ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105 cursor-zoom-in"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductoGaleria;