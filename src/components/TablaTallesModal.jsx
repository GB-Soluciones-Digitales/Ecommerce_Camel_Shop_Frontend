import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const TablaTallesModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-title"
    >
      <div 
        className="bg-crema rounded-none p-8 max-w-lg w-full shadow-2xl border border-brand-muted relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-brand-muted pb-4">
          <h3 
            id="size-chart-title" 
            className="text-2xl font-serif text-brand-dark uppercase tracking-tighter"
          >
            Guía de Talles
          </h3>
          <button 
            onClick={onClose} 
            className="text-brand-secondary hover:text-brand-dark transition-colors"
            aria-label="Cerrar guía de talles"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6 text-brand-secondary mb-8 leading-relaxed text-sm">
          <p className="font-medium text-brand-dark">
            Cada una de nuestras prendas tiene un calce único diseñado para la comodidad y el estilo:
          </p>
          <ul className="space-y-4">
            <li className="flex flex-col gap-1">
                <strong className="text-brand-dark uppercase tracking-widest text-xs">Oversize</strong> 
                <span>Calce holgado, hombros caídos y mayor longitud.</span>
            </li>
            <li className="flex flex-col gap-1">
                <strong className="text-brand-dark uppercase tracking-widest text-xs">Regular</strong> 
                <span>Calce estándar, recto al cuerpo. Fiel al talle.</span>
            </li>
            <li className="flex flex-col gap-1">
                <strong className="text-brand-dark uppercase tracking-widest text-xs">Slim</strong> 
                <span>Calce ajustado al cuerpo. Ideal para superponer.</span>
            </li>
          </ul>
          
          <div className="bg-brand-light p-5 border border-brand-muted mt-6">
            <p className="text-sm font-bold text-brand-dark uppercase tracking-widest mb-1">
              ¿Aún tienes dudas?
            </p>
            <p className="text-xs">
              Escríbenos por WhatsApp y te ayudamos a elegir el talle perfecto según tus medidas.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full bg-brand-dark hover:bg-black text-crema font-bold uppercase tracking-widest text-xs py-4 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default TablaTallesModal;