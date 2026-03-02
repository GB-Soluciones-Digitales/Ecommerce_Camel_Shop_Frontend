import React, { useState } from 'react';
import { FiMinus, FiPlus, FiAlertCircle } from 'react-icons/fi';

const ProductoInfo = ({ producto, onAddToCart, onOpenSizeChart }) => {
  const [selectedColor, setSelectedColor] = useState(producto.variantes?.[0]?.color || null);
  const [selectedTalle, setSelectedTalle] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState('');

  const currentVariant = producto.variantes?.find(v => v.color === selectedColor);
  const availableSizes = currentVariant ? Object.entries(currentVariant.stockPorTalle).filter(([_, q]) => q > 0).map(([t]) => t) : [];
  const stockReal = currentVariant?.stockPorTalle?.[selectedTalle] || producto.stock;

  const handleAdd = () => {
    if (producto.variantes?.length > 0 && (!selectedColor || !selectedTalle)) {
      return setError('Por favor, selecciona color y talle para continuar.');
    }
    onAddToCart({ selectedColor, selectedSize: selectedTalle, variantId: `${producto.id}-${selectedColor}-${selectedTalle}` }, cantidad);
    setError('');
  };

  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-2">{producto.categoriaNombre}</span>
      <h1 className="text-4xl md:text-5xl font-serif text-brand-dark leading-tight mb-4">{producto.nombre}</h1>
      <p className="text-2xl text-brand-dark font-medium tracking-wide mb-8">${parseFloat(producto.precio).toLocaleString()}</p>
      
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
                  onClick={() => { setSelectedColor(v.color); setSelectedTalle(null); setCantidad(1); setError(''); }}
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
                      onClick={() => { setSelectedTalle(talle); setCantidad(1); setError(''); }}
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
        {error && <div className="mb-4 text-red-800 bg-red-50 p-3 text-xs uppercase tracking-wider flex items-center gap-2 border border-red-100"><FiAlertCircle size={16} /> {error}</div>}
        
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
            {producto.stock === 0 ? 'Sin Stock' : 'Añadir a la Bolsa'}
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