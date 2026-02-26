import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/pedidoService';
import { fileService } from '../services/fileService'
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiTruck, FiCreditCard, FiCheck, FiImage } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const colors = {
    textMain: 'text-[#4a3b2a]',
    bgAccent: 'bg-[#d8bf9f]',
    buttonMain: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]',
    inputFocus: 'focus:ring-[#d8bf9f] focus:border-[#4a3b2a]',
  };

  const [formData, setFormData] = useState({
    nombreCliente: '', telefono: '', direccionEnvio: '', metodoPago: 'Transferencia',
  });

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f5f0]">
        <h2 className={`text-2xl font-bold mb-4 ${colors.textMain}`}>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/')} className={`font-bold underline ${colors.textMain}`}>Volver a la tienda</button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pedidoPayload = {
        ...formData,
        items: cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad,
          talle: `${item.selectedColor || ''} - ${item.selectedSize || 'Único'}` 
        }))
      };
      
      const response = await pedidoService.crearPedido(pedidoPayload);
      const pedidoId = response.data.id;
      
      const resumenProductos = cartItems.map(item => 
        `• ${item.cantidad}x ${item.nombre}\n   Color: ${item.selectedColor || 'N/A'} | Talle: ${item.selectedSize || 'Único'}`
      ).join('\n');

      const mensaje = `Hola! Acabo de realizar el pedido *#${pedidoId}* en la web.\n\n*Cliente:* ${formData.nombreCliente}\n*Envío:* ${formData.direccionEnvio}\n*Pago:* ${formData.metodoPago}\n\n*Resumen:*\n${resumenProductos}\n\n*Total: $${getCartTotal().toLocaleString()}*`;

      clearCart();
      window.location.href = `https://wa.me/5493434676232?text=${encodeURIComponent(mensaje)}`;
    } catch (error) {
      console.error(error);
      alert("Error al procesar pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5f0] py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Finalizar Compra | Camel Shop</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-[#4a3b2a] mb-8 transition font-medium">
          <FiArrowLeft className="mr-2" /> Volver al carrito
        </button>

        <h1 className={`text-3xl font-bold mb-10 text-center md:text-left ${colors.textMain}`}>Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* FORMULARIO */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${colors.bgAccent} ${colors.textMain}`}><FiTruck size={24} /></div>
                <h2 className={`text-xl font-bold ${colors.textMain}`}>Datos de Envío</h2>
              </div>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                {['nombreCliente', 'telefono', 'direccionEnvio'].map((field, idx) => (
                    <div key={idx}>
                        <label className="block text-sm font-bold text-gray-700 mb-1 capitalize">
                            {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                            type={field === 'telefono' ? 'tel' : 'text'}
                            name={field}
                            required
                            className={`w-full border border-gray-300 rounded-lg px-4 py-3 outline-none transition focus:ring-2 ${colors.inputFocus}`}
                            value={formData[field]}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}

                <div className="pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${colors.bgAccent} ${colors.textMain}`}><FiCreditCard size={24} /></div>
                      <h2 className={`text-xl font-bold ${colors.textMain}`}>Forma de Pago</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {['Transferencia', 'Efectivo'].map((metodo) => (
                          <label key={metodo} className={`border rounded-xl p-4 cursor-pointer transition ${formData.metodoPago === metodo ? `border-[#4a3b2a] bg-[#d8bf9f]/20 ring-1 ring-[#4a3b2a]` : 'border-gray-200 hover:border-[#d8bf9f]'}`}>
                            <input type="radio" name="metodoPago" value={metodo} checked={formData.metodoPago === metodo} onChange={handleInputChange} className="hidden" />
                            <div className={`font-bold ${colors.textMain}`}>{metodo}</div>
                            <div className="text-xs text-gray-500">{metodo === 'Transferencia' ? '10% OFF' : 'Al retirar'}</div>
                          </label>
                      ))}
                    </div>
                </div>
              </form>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 text-sm border border-blue-100">
              <FiShield className="flex-shrink-0 mt-0.5" size={18} />
              <p>Al confirmar, serás redirigido a WhatsApp para finalizar la compra de forma segura.</p>
            </div>
          </div>

          {/* RESUMEN */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className={`text-xl font-bold mb-6 ${colors.textMain}`}>Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.variantId || item.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagenes?.[0] ? (
                         <img src={getImgUrl(item.imagenes[0])} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                         <FiImage className="w-full h-full p-4 text-gray-300"/>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold line-clamp-1 ${colors.textMain}`}>{item.nombre}</h4>
                      <div className="text-xs text-gray-600 mt-1 mb-1">
                         {item.selectedColor} | {item.selectedSize}
                      </div>
                      <div className="text-sm text-gray-500 flex justify-between mt-1">
                        <span>{item.cantidad} x ${item.precio}</span>
                        <span className={`font-bold ${colors.textMain}`}>${(item.cantidad * item.precio).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">A coordinar</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className={colors.textMain}>${getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className={`w-full mt-8 ${colors.buttonMain} font-bold py-4 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? 'Procesando...' : 'Confirmar Pedido'} <FiCheck />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;