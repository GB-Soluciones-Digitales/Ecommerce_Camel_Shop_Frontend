import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import WhatsAppButton from '../components/WhatsAppButton';
import { useCart } from '../context/CartContext';
import { fileService } from '../services/fileService';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PublicLayout = () => {
  const { cartItems, showCart, setShowCart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/checkout');
  };

  const theme = {
    textMain: 'text-[#4a3b2a]',
    bgOverlay: 'bg-[#d8bf9f]',
    buttonMain: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f5f0] font-sans">
      
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      <WhatsAppButton />

      {showCart && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-[#4a3b2a]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full bg-white shadow-2xl flex flex-col h-full animate-slide-in">
              
              <div className={`flex items-center justify-between p-6 border-b border-[#4a3b2a]/10 ${theme.bgOverlay}`}>
                <h2 className={`text-xl font-bold ${theme.textMain}`}>Tu Pedido</h2>
                <button onClick={() => setShowCart(false)} className={`p-2 hover:bg-[#4a3b2a]/10 rounded-full ${theme.textMain}`}>
                  <FiX size={24}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <FiShoppingCart size={48} className="opacity-20 mb-4 text-[#4a3b2a]" />
                    <p className="text-[#4a3b2a]">Tu carrito está vacío</p>
                    <button onClick={() => setShowCart(false)} className={`font-bold hover:underline mt-2 ${theme.textMain}`}>Ir al catálogo</button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        <img src={fileService.getImageUrl(item.imagenes?.[0])} alt={item.nombre} className="w-full h-full object-cover"/>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className={`font-bold line-clamp-1 ${theme.textMain}`}>{item.nombre}</h3>
                          <div className="flex items-center mt-1">
                            {item.selectedSize && (
                              <span className="text-xs font-bold text-[#4a3b2a] bg-[#d8bf9f]/30 px-2 py-0.5 rounded mr-2 border border-[#d8bf9f]">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">${parseFloat(item.precio).toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><FiMinus size={14}/></button>
                            <span className={`px-2 text-sm font-bold w-8 text-center ${theme.textMain}`}>{item.cantidad}</span>
                            <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><FiPlus size={14}/></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1 transition"><FiTrash2 size={18}/></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-[#4a3b2a]/10 p-6 bg-[#f9f5f0]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium">Total</span>
                    <span className={`text-2xl font-bold ${theme.textMain}`}>${getCartTotal().toLocaleString()}</span>
                  </div>
                  <button onClick={handleCheckout} className={`w-full ${theme.buttonMain} font-bold py-4 rounded-xl shadow-lg transition flex justify-center items-center gap-2`}>
                    Iniciar Compra <FiArrowRight />
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