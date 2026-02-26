import React, { useEffect } from 'react';
import { FiX, FiArrowLeft } from 'react-icons/fi';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-title"
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border-2 border-[#d8bf9f] relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 
            id="size-chart-title" 
            className="text-2xl font-black text-[#4a3b2a] uppercase tracking-tighter"
          >
            Guía de Talles
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2"
            aria-label="Cerrar guía de talles"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-4 text-gray-600 mb-8 leading-relaxed">
          <p>
            Cada una de nuestras prendas tiene un calce único diseñado para la comodidad y el estilo:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Oversize:</strong> Calce holgado, hombros caídos.</li>
            <li><strong>Regular:</strong> Calce estándar, recto.</li>
            <li><strong>Slim:</strong> Calce ajustado al cuerpo.</li>
          </ul>
          <div className="bg-[#f9f5f0] p-4 rounded-xl border border-[#d8bf9f]/30">
            <p className="text-sm font-bold text-[#4a3b2a]">
              ¿Aún tienes dudas?
            </p>
            <p className="text-xs">
              Escríbenos por WhatsApp y te ayudamos a elegir el talle perfecto según tus medidas.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full bg-[#4a3b2a] hover:bg-black text-[#d8bf9f] font-bold py-3 rounded-xl uppercase tracking-widest transition"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default TablaTallesModal;