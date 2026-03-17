import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import WhatsAppButton from '../components/WhatsAppButton';
import { useCart } from '../context/CartContext';
import { fileService } from '../services/fileService';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiArrowRight, FiImage } from 'react-icons/fi';
import { sileo } from 'sileo'

const PublicLayout = () => {
  const { cartItems, showCart, setShowCart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/checkout');
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.variantId);
    sileo.info({
      title: "Pieza removida",
      description: `${item.nombre} se quitó de tu carrito.`
    });
  };

  const getMaxStock = (item) => {
    if (item.variantes?.length > 0 && item.selectedColor && item.selectedSize) {
      const variante = item.variantes.find(v => v.color === item.selectedColor);
      return variante?.stockPorTalle?.[item.selectedSize] || 0;
    }
    return item.stock || 0;
  };

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  return (
    <div className="min-h-screen flex flex-col bg-crema font-sans">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      <WhatsAppButton />

      {/* Carrito Lateral */}
      {showCart && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full bg-crema shadow-2xl flex flex-col h-full transform transition-transform border-l border-brand-muted">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-brand-muted bg-brand-light">
                <h2 className="text-2xl font-serif text-brand-dark uppercase tracking-tight">Tu Carrito</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-brand-muted/30 rounded-full text-brand-dark transition-colors">
                  <FiX size={24}/>
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-brand-secondary space-y-4">
                    <FiShoppingCart size={48} strokeWidth={1} className="opacity-50" />
                    <p className="text-sm font-medium uppercase tracking-widest">Tu carrito está vacio</p>
                    <button onClick={() => {setShowCart(false); navigate('/productos');}} className="font-bold text-brand-dark border-b border-brand-dark pb-1 hover:text-brand-primary hover:border-brand-primary transition-colors text-xs uppercase tracking-widest mt-4">
                        Descubrir Colección
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const maxStock = getMaxStock(item);
                    return (
                      <div key={String(item.variantId || item.id)} className="flex gap-5 group">
                        <div className="w-24 h-32 bg-brand-light rounded-none overflow-hidden flex-shrink-0 border border-brand-muted relative">
                          {item.imagenes?.[0] ? (
                            <img src={getImgUrl(item.imagenes[0])} alt={item.nombre} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"/>
                          ) : (
                            <FiImage className="w-full h-full p-6 text-brand-muted"/>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex flex-col">
                                  <h3 className="font-serif font-bold text-brand-dark text-lg leading-tight line-clamp-2">{item.nombre}</h3>
                                  {item.enOferta && (
                                    <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm w-fit mt-1">
                                      SALE
                                    </span>
                                  )}
                                </div>
                                <button onClick={() => handleRemoveItem(item)} className="text-brand-secondary hover:text-red-500 transition-colors"><FiTrash2 size={18}/></button>
                            </div>
                            <div className="flex flex-wrap items-center mt-2 gap-2">
                              {item.selectedColor && (
                                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">
                                  Color: {typeof item.selectedColor === 'object' ? JSON.stringify(item.selectedColor) : item.selectedColor}
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest before:content-['|'] before:mx-2 before:text-brand-muted">
                                  Talle: {typeof item.selectedSize === 'object' ? JSON.stringify(item.selectedSize) : item.selectedSize}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between mt-4">
                            <div className="flex items-center border border-brand-muted bg-brand-light">
                              <button onClick={() => updateQuantity(item.variantId, item.cantidad - 1)} className="p-2 text-brand-dark hover:bg-brand-muted/30 transition-colors"><FiMinus size={12}/></button>
                              <span className="w-8 text-center text-sm font-medium text-brand-dark">{item.cantidad}</span>
                              <button 
                                onClick={() => updateQuantity(item.variantId, item.cantidad + 1)} 
                                disabled={item.cantidad >= maxStock}
                                className="p-2 text-brand-dark hover:bg-brand-muted/30 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <FiPlus size={12}/>
                              </button>
                            </div>
                            <div className="flex flex-col items-end">
                              {item.enOferta ? (
                                <p className="font-black text-rose-500 text-lg">
                                  ${parseFloat(item.precioFinal).toLocaleString()}
                                </p>
                              ) : (
                                <p className="font-bold text-brand-dark text-lg">
                                  ${parseFloat(item.precio).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-brand-muted p-6 bg-brand-light/50">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-brand-secondary font-bold uppercase tracking-widest text-[10px]">Total Estimado</span>
                    <span className="text-3xl font-serif font-bold text-brand-dark">${getCartTotal().toLocaleString()}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-brand-dark text-brand-light font-bold text-xs uppercase tracking-[0.2em] py-5 hover:bg-brand-primary transition-colors flex justify-center items-center gap-3">
                    Finalizar Compra <FiArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLayout;