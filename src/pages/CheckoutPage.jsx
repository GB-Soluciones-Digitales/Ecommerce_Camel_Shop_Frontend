import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/pedidoService';
import { fileService } from '../services/fileService'
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiLock, FiImage } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombreCliente: '', telefono: '', direccionEnvio: '', metodoPago: 'Transferencia',
  });

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-crema pt-24 pb-12 font-sans">
        <h2 className="text-3xl font-serif text-brand-dark mb-4 tracking-tight">Tu carrito está vacío</h2>
        <Link to="/productos" className="text-xs font-bold uppercase tracking-widest text-brand-secondary border-b border-brand-secondary pb-1 hover:text-brand-dark hover:border-brand-dark transition-colors">
          Continuar comprando
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pedidoPayload = {
        ...formData,
        items: cartItems.map(item => ({ productoId: item.id, cantidad: item.cantidad, talle: `${item.selectedColor || ''} - ${item.selectedSize || 'Único'}` }))
      };
      const response = await pedidoService.crearPedido(pedidoPayload);
      const resumenProductos = cartItems.map(item => `• ${item.cantidad}x ${item.nombre}\n   Color: ${item.selectedColor || 'N/A'} | Talle: ${item.selectedSize || 'Único'}`).join('\n');
      const mensaje = `Hola CAMEL. Acabo de realizar el pedido *#${response.data.id}*.\n\n*Cliente:* ${formData.nombreCliente}\n*Envío:* ${formData.direccionEnvio}\n*Pago:* ${formData.metodoPago}\n\n*Resumen:*\n${resumenProductos}\n\n*Total: $${getCartTotal().toLocaleString()}*`;

      clearCart();
      window.location.href = `https://wa.me/5493434676232?text=${encodeURIComponent(mensaje)}`;
    } catch (error) { alert("Error al procesar pedido."); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-crema font-sans pb-24 pt-32">
      <Helmet><title>Checkout | CAMEL</title></Helmet>
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-brand-primary hover:text-brand-dark mb-10 transition-colors">
          <FiArrowLeft className="mr-2" size={18} /> Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-serif text-brand-dark mb-10 pb-4 border-b border-brand-muted tracking-tight">Información de Envío</h1>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-1">Nombre Completo</label>
                        <input type="text" name="nombreCliente" required value={formData.nombreCliente} onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-3 text-brand-dark transition-colors placeholder:text-brand-secondary/40" placeholder="Ej: Juan Pérez" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-1">Teléfono / WhatsApp</label>
                        <input type="tel" name="telefono" required value={formData.telefono} onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-3 text-brand-dark transition-colors placeholder:text-brand-secondary/40" placeholder="Ej: 343 1234567" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-1">Dirección de Entrega</label>
                    <input type="text" name="direccionEnvio" required value={formData.direccionEnvio} onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-3 text-brand-dark transition-colors placeholder:text-brand-secondary/40" placeholder="Calle, Número, Ciudad, Provincia" />
                </div>
                <div className="pt-8">
                    <h3 className="text-2xl font-serif text-brand-dark mb-6 tracking-tight">Método de Pago</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Transferencia', 'Efectivo'].map((metodo) => (
                          <label key={metodo} className={`border p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${formData.metodoPago === metodo ? "border-brand-dark bg-brand-dark text-crema" : "border-brand-muted bg-brand-light text-brand-secondary hover:border-brand-dark"}`}>
                            <input type="radio" name="metodoPago" value={metodo} checked={formData.metodoPago === metodo} onChange={handleInputChange} className="hidden" />
                            <div className="text-xs font-bold uppercase tracking-widest">{metodo}</div>
                            <div className={`text-sm ${formData.metodoPago === metodo ? "text-crema/70" : "text-brand-secondary"}`}>{metodo === 'Transferencia' ? '' : 'Al retirar'}</div>
                          </label>
                      ))}
                    </div>
                </div>
            </form>
            <div className="mt-8 flex items-center gap-3 text-brand-secondary text-xs uppercase tracking-wider font-bold bg-brand-light p-4 border border-brand-muted"><FiShield size={16} /> Pago 100% seguro, se finaliza la compra por WhatsApp</div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-crema border border-brand-muted p-8 lg:sticky lg:top-24">
              <h2 className="text-2xl font-serif text-brand-dark mb-8 tracking-tight">Resumen del Pedido</h2>
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.variantId || item.id} className="flex gap-4 group">
                    <div className="w-20 h-28 bg-crema flex-shrink-0 relative overflow-hidden border border-brand-muted">
                      {item.imagenes?.[0] ? <img src={getImgUrl(item.imagenes[0])} alt={item.nombre} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" /> : <FiImage className="w-full h-full p-6 text-brand-muted"/>}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-base font-serif font-bold text-brand-dark line-clamp-1">{item.nombre}</h4>
                        <p className="text-sm text-brand-secondary uppercase tracking-widest mt-1">{item.selectedColor} • Talle {item.selectedSize}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-brand-secondary">Cant: {item.cantidad}</span>
                        <span className="text-base font-medium text-brand-dark">${(item.cantidad * item.precio).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-brand-muted">
                <div className="flex justify-between text-base text-brand-secondary"><span>Subtotal</span><span>${getCartTotal().toLocaleString()}</span></div>
                <div className="flex justify-between text-base text-brand-secondary"><span>Envío</span><span className="italic">A convenir</span></div>
                <div className="flex justify-between items-end pt-6 border-t border-brand-muted"><span className="font-serif text-2xl text-brand-dark">Total</span><span className="text-3xl font-medium text-brand-dark">${getCartTotal().toLocaleString()}</span></div>
              </div>
              <button type="submit" form="checkout-form" disabled={loading} className="w-full mt-10 bg-brand-dark text-brand-light text-sm font-bold uppercase tracking-[0.2em] py-5 hover:bg-[#5a2e12] transition-colors flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? 'Procesando...' : 'Confirmar Pedido'} <FiLock size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;