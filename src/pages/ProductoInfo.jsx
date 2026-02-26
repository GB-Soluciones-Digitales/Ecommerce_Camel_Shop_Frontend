import React, { useState } from 'react';
import { FiMinus, FiPlus, FiShoppingCart, FiInfo, FiCheck, FiTruck, FiShield, FiAlertCircle } from 'react-icons/fi';

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
      return setError('Por favor, seleccioná color y talle.');
    }
    onAddToCart({ selectedColor, selectedSize: selectedTalle, variantId: `${producto.id}-${selectedColor}-${selectedTalle}` }, cantidad);
    setError('');
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm font-bold text-[#d8bf9f] uppercase">{producto.categoriaNombre}</span>
      <h1 className="text-4xl font-black text-[#4a3b2a] mt-2 mb-4">{producto.nombre}</h1>
      <p className="text-3xl font-bold text-[#4a3b2a] mb-6">${producto.precio?.toLocaleString()}</p>
      <p className="text-gray-600 mb-8">{producto.descripcion}</p>

      {producto.stock > 0 ? (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          {/* Colores */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Color</h3>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Seleccionar color">
              {producto.variantes?.map((v) => (
                <button
                  key={v.color}
                  onClick={() => { setSelectedColor(v.color); setSelectedTalle(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border ${selectedColor === v.color ? 'bg-[#4a3b2a] text-[#d8bf9f]' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  {v.color}
                </button>
              ))}
            </div>
          </div>

          {/* Talles */}
          {selectedColor && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Talle</h3>
                {producto.tipoTalle === 'ROPA' && (
                  <button onClick={onOpenSizeChart} className="text-[#4a3b2a] text-xs font-bold flex items-center gap-1">
                    <FiInfo /> Guía de Talles
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3" role="group" aria-label="Seleccionar talle">
                {availableSizes.map(talle => (
                  <button
                    key={talle}
                    onClick={() => setSelectedTalle(talle)}
                    className={`min-w-[3.5rem] h-12 rounded-lg border-2 font-bold transition ${selectedTalle === talle ? 'border-[#4a3b2a] bg-[#4a3b2a] text-[#d8bf9f]' : 'border-gray-200 text-gray-600'}`}
                  >
                    {talle}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl font-bold text-center">Agotado</div>
      )}

      {/* Selector de cantidad y botón */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        {error && <div className="mb-4 text-red-600 text-sm flex items-center gap-2"><FiAlertCircle /> {error}</div>}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center border border-gray-200 rounded-xl bg-white">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="p-4" aria-label="Disminuir cantidad"><FiMinus /></button>
            <span className="w-12 text-center font-bold text-lg">{cantidad}</span>
            <button onClick={() => setCantidad(Math.min(stockReal, cantidad + 1))} className="p-4" aria-label="Aumentar cantidad"><FiPlus /></button>
          </div>
          <button
            onClick={handleAdd}
            disabled={producto.stock === 0}
            className="flex-1 bg-[#4a3b2a] text-[#d8bf9f] font-bold py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <FiShoppingCart /> {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoInfo;