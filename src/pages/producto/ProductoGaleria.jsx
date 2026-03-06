import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade, FreeMode } from 'swiper/modules';
import { fileService } from '../../services/fileService';
import { FiX, FiZoomIn } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';

const ProductoGaleria = ({ producto }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);
  const galleryImages = (producto.imagenes && producto.imagenes.length > 0) ? producto.imagenes : [producto.imagenUrl];

  const handleOpenZoom = (img) => {
    setActiveImg(img);
    setIsZoomed(true);
    document.body.style.overflow = 'hidden'; 
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-brand-light relative w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[2/3] max-h-[85vh] rounded-[2rem] overflow-hidden group">
          <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/50 backdrop-blur-md p-3 rounded-full shadow-xl">
              <FiZoomIn className="text-brand-dark" size={20} />
            </div>
          </div>

          <Swiper
            style={{ '--swiper-navigation-color': 'var(--color-brand-dark)', '--swiper-navigation-size': '20px' }}
            navigation={true}
            effect="fade"
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[EffectFade, Navigation, Thumbs]}
            className="h-full w-full"
          >
            {galleryImages.map((img, index) => (
              <SwiperSlide key={`${producto.id}-main-${index}`} className="h-full w-full cursor-zoom-in" onClick={() => handleOpenZoom(img)}>
                <img
                  src={getImgUrl(img)}
                  alt={`${producto.nombre} - Vista ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {galleryImages.length > 1 && (
          <div className="w-full h-20 md:h-24 flex-shrink-0">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView={4}
              watchSlidesProgress={true}
              modules={[Thumbs, FreeMode]}
              className="h-full w-full"
            >
              {galleryImages.map((img, index) => (
                <SwiperSlide key={`thumb-${index}`} className="cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent [&.swiper-slide-thumb-active]:border-brand-dark opacity-50 [&.swiper-slide-thumb-active]:opacity-100 transition-all">
                  <img src={getImgUrl(img)} alt="thumb" className="w-full h-full object-cover aspect-[3/4]" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* ZOOM */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={handleCloseZoom}
        >
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-2xl"></div>
          
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform z-[1010]">
            <FiX size={40} strokeWidth={1.5} />
          </button>

          <img 
            src={getImgUrl(activeImg)} 
            className="relative max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl z-[1005] animate-in zoom-in-95 duration-300"
            alt="Zoomed"
          />
        </div>
      )}
    </>
  );
};

export default ProductoGaleria;