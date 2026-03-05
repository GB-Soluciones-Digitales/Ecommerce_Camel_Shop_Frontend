import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade, FreeMode, Zoom } from 'swiper/modules';
import { fileService } from '../../services/fileService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';

const ProductoGaleria = ({ producto }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  const galleryImages = (producto.imagenes && producto.imagenes.length > 0) 
    ? producto.imagenes 
    : [producto.imagenUrl];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-brand-light relative w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[2/3] max-h-[85vh] rounded-[2rem] overflow-hidden shadow-sm">
        <Swiper
          style={{
            '--swiper-navigation-color': 'var(--color-brand-dark)',
            '--swiper-navigation-size': '20px',
          }}
          spaceBetween={0}
          navigation={true}
          effect="fade"
          zoom={true}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[EffectFade, Navigation, Thumbs, Zoom]}
          className="h-full w-full"
        >
          {galleryImages.map((img, index) => (
            <SwiperSlide key={`${producto.id}-main-${index}`} className="h-full w-full">
              <div className="swiper-zoom-container h-full w-full">
                <img 
                  src={getImgUrl(img)} 
                  alt={`${producto.nombre} - Vista ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Miniaturas */}
      {galleryImages.length > 1 && (
        <div className="w-full h-24 flex-shrink-0">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            direction={'horizontal'}
            breakpoints={{
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 }
            }}
            watchSlidesProgress={true}
            modules={[Navigation, Thumbs, FreeMode]}
            className="h-full w-full"
            freeMode={true}
          >
            {galleryImages.map((img, index) => (
              <SwiperSlide 
                key={`${producto.id}-thumb-${index}`}
                className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent [&.swiper-slide-thumb-active]:border-brand-dark opacity-60 [&.swiper-slide-thumb-active]:opacity-100 transition-all duration-300"
              >
                <img 
                  src={getImgUrl(img)} 
                  alt={`Thumb ${index}`} 
                  className="w-full h-full object-cover aspect-[3/4]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductoGaleria;