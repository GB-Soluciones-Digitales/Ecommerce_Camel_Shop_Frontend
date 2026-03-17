import React, { useState } from 'react';
import { FiMinus, FiPlus, FiShare2 } from 'react-icons/fi';
import { sileo } from 'sileo';

const ProductoInfo = ({ producto, onAddToCart, onOpenSizeChart }) => {
  const [selectedColor, setSelectedColor] = useState(producto.variantes?.[0]?.color || null);
  const [selectedTalle, setSelectedTalle] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const currentVariant = producto.variantes?.find(v => v.color === selectedColor);
  const availableSizes = currentVariant ? Object.entries(currentVariant.stockPorTalle).filter(([_, q]) => q > 0).map(([t]) => t) : [];
  const stockReal = currentVariant?.stockPorTalle?.[selectedTalle] || producto.stock;

  const handleAdd = () => {
    if (producto.variantes?.length > 0 && (!selectedColor || !selectedTalle)) {
      return sileo.info({
        title: "Falta información",
        description: "Por favor, seleccioná un color y talle antes de añadir al carrito."
      });
    }

    onAddToCart({ 
      selectedColor, 
      selectedSize: selectedTalle, 
      variantId: `${producto.id}-${selectedColor}-${selectedTalle}` 
    }, cantidad);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    sileo.info({
      title: "Enlace copiado",
      description: "Ya podés compartir este producto con quien quieras."
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-brand-primary uppercase tracking-[0.2em]">{producto.categoriaNombre}</span>
        
        <button 
          onClick={handleShare} 
          className="flex items-center gap-2 text-brand-secondary hover:text-brand-dark transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          <FiShare2 size={14} /> Compartir
        </button>
      </div>
      <h1 className="text-4xl md:text-5xl font-serif text-brand-dark leading-tight mb-4">{producto.nombre}</h1>
      {producto.enOferta ? (
        <>
          <span className="text-brand-secondary line-through text-2xl font-medium tracking-wide mb-8">
            ${parseFloat(producto.precio).toLocaleString()}
          </span>
          <span className="text-brand-dark text-2xl font-medium tracking-wide mb-8">
            ${parseFloat(producto.precioFinal).toLocaleString()}
          </span>
        </>
      ) : (
        <span className="text-brand-dark text-2xl font-medium tracking-wide mb-8">${parseFloat(producto.precio).toLocaleString()}</span>
      )}
      
      <p className="text-brand-secondary text-sm leading-relaxed mb-10">{producto.descripcion}</p>

      {/* Selector de Variantes */}
      {producto.variantes?.length > 0 ? (
        <div className="space-y-8">
          
          {/* Colores */}
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">Color</span>
              <span className="text-xs text-brand-primary">{selectedColor || 'Seleccionar'}</span>
            </div>
            <div className="flex gap-3">
              {producto.variantes.map(v => (
                <button 
                  key={v.color}
                  onClick={() => { setSelectedColor(v.color); setSelectedTalle(null); setCantidad(1);}}
                  className={`px-5 py-2 text-sm font-medium transition-all ${selectedColor === v.color ? 'border-b-2 border-brand-dark text-brand-dark' : 'border-b-2 border-transparent text-brand-primary hover:text-brand-dark'}`}
                >
                  {v.color}
                </button>
              ))}
            </div>
          </div>

          {/* Talles */}
          {selectedColor && (
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">Talle</span>
                <button onClick={onOpenSizeChart} className="text-[10px] text-brand-primary uppercase tracking-widest border-b border-brand-muted hover:border-brand-primary hover:text-brand-dark transition-colors">
                  Guía de Talles
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {['U', 'S', 'M', 'L', 'XL', 'XXL'].map(talle => {
                  const hasStock = availableSizes.includes(talle);
                  return (
                    <button
                      key={talle}
                      disabled={!hasStock}
                      onClick={() => { setSelectedTalle(talle); setCantidad(1); }}
                      className={`w-12 h-12 flex items-center justify-center text-sm transition-all
                        ${selectedTalle === talle 
                          ? 'border border-brand-dark bg-brand-dark text-crema' 
                          : hasStock 
                            ? 'border border-brand-muted text-brand-dark hover:border-brand-dark' 
                            : 'border border-brand-light text-brand-muted cursor-not-allowed line-through'
                        }`}
                    >
                      {talle}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-brand-light border border-brand-muted text-brand-secondary text-sm tracking-widest uppercase text-center mb-8">
          {producto.stock === 0 ? 'Agotado Temporalmente' : 'Talle y Color Único'}
        </div>
      )}

      {/* Acciones */}
      <div className="mt-10">
        
        <div className="flex gap-4">
          <div className="flex items-center border border-brand-muted bg-transparent">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-4 py-4 text-brand-dark hover:bg-brand-light transition-colors"><FiMinus size={14}/></button>
            <span className="w-10 text-center font-medium text-brand-dark">{cantidad}</span>
            <button onClick={() => setCantidad(Math.min(stockReal, cantidad + 1))} className="px-4 py-4 text-brand-dark hover:bg-brand-light transition-colors"><FiPlus size={14}/></button>
          </div>
          
          <button
            onClick={handleAdd}
            disabled={producto.stock === 0}
            className="flex-1 bg-brand-dark text-crema text-xs font-bold uppercase tracking-[0.2em] py-4 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {producto.stock === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
          </button>
        </div>
        
        {producto.stock > 0 && stockReal <= 3 && selectedTalle && (
          <p className="text-xs text-brand-primary mt-4 font-medium italic">¡Solo quedan {stockReal} unidades en este talle!</p>
        )}
      </div>
    </div>
  );
};

export default ProductoInfo;