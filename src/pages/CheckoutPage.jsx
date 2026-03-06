import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/pedidoService';
import { fileService } from '../services/fileService';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiLock, FiImage, FiTruck, FiShoppingBag, FiInfo } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { sileo } from 'sileo';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [metodoEntrega, setMetodoEntrega] = useState('envio');
  const [formData, setFormData] = useState({
    nombreCliente: '',
    dniCliente: '',
    telefono: '',
    direccionEnvio: '',
    codigoPostal: '',
    metodoPago: 'Efectivo',
    notas: ''
  });

  const COSTO_ENVIO = 5500;
  const MIN_ENVIO_GRATIS = 80000;
  const DESCUENTO_RETIRO_EFECTIVO = 0.10;

  const calculos = useMemo(() => {
    const subtotal = getCartTotal();
    let descuento = 0;
    let costoEnvio = 0;

    if (metodoEntrega === 'retiro' && formData.metodoPago === 'Efectivo') {
      descuento = subtotal * DESCUENTO_RETIRO_EFECTIVO;
    }

    if (metodoEntrega === 'envio') {
      costoEnvio = subtotal >= MIN_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
    }

    return {
      subtotal,
      descuento,
      costoEnvio,
      total: subtotal - descuento + costoEnvio,
      envioGratis: subtotal >= MIN_ENVIO_GRATIS
    };
  }, [metodoEntrega, formData.metodoPago, cartItems, getCartTotal]);

  useEffect(() => {
    if (metodoEntrega === 'envio' && formData.metodoPago === 'Transferencia') {
      setFormData(prev => ({ ...prev, metodoPago: 'Efectivo' }));
    }
  }, [metodoEntrega]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const getImgUrl = (img) => img?.startsWith('http') ? img : fileService.getImageUrl(img);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pedidoPayload = {
        ...formData,
        metodoEntrega,
        total: calculos.total,
        items: cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad,
          talle: `${item.selectedColor || ''} - ${item.selectedSize || 'Único'}`
        }))
      };

      const response = await pedidoService.crearPedido(pedidoPayload);
      
      const resumenProductos = cartItems.map(item => `• ${item.cantidad}x ${item.nombre} (${item.selectedColor}/${item.selectedSize})`).join('\n');
      
      const mensaje = `Hola CAMEL. Pedido *#${response.data.id}*\n\n*Cliente:* ${formData.nombreCliente}\n*DNI:* ${formData.dniCliente}\n*Entrega:* ${metodoEntrega.toUpperCase()}\n*Dirección:* ${metodoEntrega === 'envio' ? `${formData.direccionEnvio} (CP: ${formData.codigoPostal})` : 'Retiro en Local'}\n*Pago:* ${formData.metodoPago}\n\n*Items:*\n${resumenProductos}\n\n${formData.notas ? `*Notas:* ${formData.notas}\n` : ''}${calculos.descuento > 0 ? `*Descuento:* $${calculos.descuento.toLocaleString()}\n` : ''}*Total Final: $${calculos.total.toLocaleString()}*`;

      clearCart();

      sileo.success({
        title: "¡Pedido registrado!",
        description: "Redirigiendo a WhatsApp para coordinar el pago."
      });

      setTimeout(() => {
        window.location.href = `https://wa.me/5493434676232?text=${encodeURIComponent(mensaje)}`;
      }, 1000);

    } catch (error) {
      sileo.error({
        title: "Error al procesar",
        description: "No pudimos generar tu pedido. Revisá tu conexión e intentá nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-crema pt-24 font-sans">
      <h2 className="text-3xl font-serif text-brand-dark mb-4">Tu carrito está vacío</h2>
      <Link to="/productos" className="text-xs font-bold uppercase tracking-widest text-brand-secondary border-b border-brand-secondary pb-1 hover:text-brand-dark transition-colors">Continuar comprando</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-crema font-sans pb-24 pt-32">
      <Helmet><title>Checkout | CAMEL</title></Helmet>
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-brand-secondary hover:text-brand-dark mb-10 transition-colors">
          <FiArrowLeft className="mr-2" /> Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-serif text-brand-dark mb-10 pb-4 border-b border-brand-muted">Finalizar Compra</h1>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
              {/* DATOS PERSONALES */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-brand-dark">Datos Personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-primary mb-1">Nombre Completo</label>
                    <input type="text" name="nombreCliente" required value={formData.nombreCliente} onChange={handleInputChange} className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-2 text-brand-dark" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-primary mb-1">DNI / CUIL</label>
                    <input type="text" name="dniCliente" required value={formData.dniCliente} onChange={handleInputChange} className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-2 text-brand-dark" placeholder="Sin puntos" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-primary mb-1">WhatsApp</label>
                    <input type="tel" name="telefono" required value={formData.telefono} onChange={handleInputChange} className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-2 text-brand-dark" placeholder="Código de área + número" />
                  </div>
                </div>
              </div>

              {/* METODO ENTREGA */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-brand-dark">Método de Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setMetodoEntrega('envio')} className={`p-6 border flex flex-col items-center gap-2 transition-all cursor-pointer hover:bg-brand-primary ${metodoEntrega === 'envio' ? "border-brand-dark bg-brand-dark text-crema shadow-lg" : "border-brand-muted bg-brand-light text-brand-secondary"}`}>
                    <FiTruck size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest">Envío a Domicilio</span>
                  </button>
                  <button type="button" onClick={() => setMetodoEntrega('retiro')} className={`p-6 border flex flex-col items-center gap-2 transition-all cursor-pointer hover:bg-brand-primary ${metodoEntrega === 'retiro' ? "border-brand-dark bg-brand-dark text-crema shadow-lg" : "border-brand-muted bg-brand-light text-brand-secondary"}`}>
                    <FiShoppingBag size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest">Retiro</span>
                  </button>
                </div>

                {metodoEntrega === 'envio' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-1">Dirección Completa</label>
                      <input type="text" name="direccionEnvio" required={metodoEntrega === 'envio'} value={formData.direccionEnvio} onChange={handleInputChange} className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-2 text-brand-dark" placeholder="Calle, número, depto..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-1">Cód. Postal</label>
                      <input type="text" name="codigoPostal" required={metodoEntrega === 'envio'} value={formData.codigoPostal} onChange={handleInputChange} className="w-full bg-transparent border-b border-brand-muted focus:border-brand-dark outline-none py-2 text-brand-dark" placeholder="Ej: 3100" />
                    </div>
                  </div>
                )}
              </div>

              {/* METODO PAGO */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-brand-dark">Método de Pago</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Efectivo', 'Transferencia'].map((metodo) => {
                    const isDisabled = metodo === 'Efectivo' && metodoEntrega === 'envio';
                    return (
                      <label key={metodo} className={`border p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${isDisabled ? "opacity-40 cursor-not-allowed bg-gray-100" : formData.metodoPago === metodo ? "border-brand-dark bg-brand-dark text-crema" : "border-brand-muted bg-brand-light text-brand-secondary"}`}>
                        <input type="radio" name="metodoPago" value={metodo} disabled={isDisabled} checked={formData.metodoPago === metodo} onChange={handleInputChange} className="hidden" />
                        <span className="text-xs font-bold uppercase tracking-widest">{metodo}</span>
                        {metodo === 'Efectivo' && metodoEntrega === 'retiro' && <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded">10% OFF</span>}
                        {isDisabled && <span className="text-[10px] font-bold flex items-center gap-1"><FiInfo /> Solo retiro</span>}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* NOTAS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-primary mb-1">Notas del Pedido (Opcional)</label>
                <textarea name="notas" value={formData.notas} onChange={handleInputChange} rows="2" className="w-full bg-transparent border border-brand-muted focus:border-brand-dark outline-none p-3 text-sm text-brand-dark rounded-xl transition-colors" placeholder="Ej: Es para un regalo, dejar en portería..." />
              </div>
            </form>
          </div>

          {/* SIDEBAR RESUMEN */}
          <div className="lg:col-span-5">
            <div className="bg-crema border border-brand-muted p-8 lg:sticky lg:top-24 rounded-2xl shadow-sm">
              <h2 className="text-2 xl font-serif text-brand-dark mb-6 tracking-tight">Resumen</h2>
              
              <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2 hide-scrollbar border-b border-brand-muted pb-6">
                {cartItems.map((item) => (
                  <div key={item.variantId || item.id} className="flex gap-4">
                    <div className="w-14 h-18 bg-white flex-shrink-0 border border-brand-muted rounded-lg overflow-hidden">
                      {item.imagenes?.[0] ? <img src={getImgUrl(item.imagenes[0])} alt={item.nombre} className="w-full h-full object-cover" /> : <FiImage className="w-full h-full p-3 text-brand-muted"/>}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-brand-dark leading-tight">{item.nombre}</h4>
                      <p className="text-sm text-brand-secondary uppercase tracking-widest mt-1">{item.selectedColor} / {item.selectedSize}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-brand-secondary">Cant: {item.cantidad}</span>
                        <span className="text-sm font-bold text-brand-dark">${(item.cantidad * item.precio).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-brand-secondary">
                  <span>Subtotal</span>
                  <span>${calculos.subtotal.toLocaleString()}</span>
                </div>
                
                {calculos.descuento > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Descuento (Retiro + Efectivo)</span>
                    <span>- ${calculos.descuento.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-brand-secondary">
                  <div className="flex flex-col">
                    <span>Envío</span>
                    {metodoEntrega === 'envio' && !calculos.envioGratis && (
                      <span className="text-xs text-brand-primary font-bold">Faltan ${(MIN_ENVIO_GRATIS - calculos.subtotal).toLocaleString()} para envío gratis</span>
                    )}
                  </div>
                  <span className={calculos.costoEnvio === 0 ? "text-green-600 font-bold" : ""}>
                    {metodoEntrega === 'envio' ? (calculos.costoEnvio === 0 ? '¡Gratis!' : `$${calculos.costoEnvio.toLocaleString()}`) : ''}
                  </span>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-brand-dark/20 mt-4">
                  <span className="font-serif text-2xl text-brand-dark">Total</span>
                  <span className="text-3xl font-bold text-brand-dark">${calculos.total.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" form="checkout-form" disabled={loading} className="w-full mt-8 bg-brand-dark text-brand-light text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-brand-dark/60 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl">
                {loading ? 'Procesando...' : 'Finalizar por WhatsApp'} <FiLock size={16} />
              </button>
              
              <div className="mt-6 flex items-center gap-2 text-[10px] text-brand-secondary uppercase tracking-widest justify-center">
                <FiShield /> Pago 100% seguro y manual
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;