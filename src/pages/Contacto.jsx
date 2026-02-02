import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiSend, FiTruck, FiRefreshCw, FiCreditCard } from 'react-icons/fi';

const Contacto = () => {
  const { hash } = useLocation();

  const colors = {
    bgDark: 'bg-[#4a3b2a]', 
    textLight: 'text-[#d8bf9f]',
    textDark: 'text-[#4a3b2a]',
    bgLight: 'bg-[#d8bf9f]/30',
    button: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]'
  };

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => { element.scrollIntoView({ behavior: 'smooth' }); }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mensaje = `Hola! Mi nombre es ${formData.get('nombre')}. ${formData.get('mensaje')}`;
    window.open(`https://wa.me/5493431234567?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="bg-[#f9f5f0]">
      <Helmet>
        <title>Contacto y Envíos | Camel Shop</title>
      </Helmet>

      <div className={`${colors.bgDark} py-16 px-6 text-center`}>
        <h1 className={`text-4xl font-bold mb-4 ${colors.textLight}`}>Centro de Ayuda</h1>
        <p className="text-[#d8bf9f]/80 max-w-2xl mx-auto font-medium">
          Estamos para asesorarte en todo el proceso de compra.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        <div className="space-y-8">
          <h2 className={`text-2xl font-bold ${colors.textDark}`}>Escribinos</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className={`${colors.bgLight} p-3 rounded-lg ${colors.textDark}`}><FiMapPin size={24}/></div>
              <div>
                <h3 className={`font-bold ${colors.textDark}`}>Showroom</h3>
                <p className="text-gray-600">Av. Siempre Viva 123, Paraná, Entre Ríos.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className={`${colors.bgLight} p-3 rounded-lg ${colors.textDark}`}><FiPhone size={24}/></div>
              <div>
                <h3 className={`font-bold ${colors.textDark}`}>WhatsApp</h3>
                <p className="text-gray-600">+54 9 343 123 4567</p>
                <p className="text-sm text-gray-500">Lunes a Viernes de 9 a 18hs.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className={`${colors.bgLight} p-3 rounded-lg ${colors.textDark}`}><FiMail size={24}/></div>
              <div>
                <h3 className={`font-bold ${colors.textDark}`}>Email</h3>
                <p className="text-gray-600">contacto@camelshop.com</p>
              </div>
            </div>
          </div>

          <div className="bg-[#d8bf9f]/30 p-8 rounded-2xl shadow-sm border border-[#d8bf9f]/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {['nombre', 'email'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-bold text-[#4a3b2a] mb-1 capitalize">{field}</label>
                    <input type={field === 'email' ? 'email' : 'text'} name={field} required 
                        className="w-full border border-[#d8bf9f] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4a3b2a] outline-none" 
                    />
                  </div>
              ))}
              <div>
                <label className="block text-sm font-bold text-[#4a3b2a] mb-1">Mensaje</label>
                <textarea name="mensaje" rows="4" required className="w-full border border-[#d8bf9f] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4a3b2a] outline-none"></textarea>
              </div>
              <button type="submit" className={`w-full ${colors.button} font-bold py-3 rounded-lg transition flex items-center justify-center gap-2`}>
                <FiSend /> Enviar Mensaje
              </button>
            </form>
          </div>
        </div>

        <div id="envios" className="space-y-10 scroll-mt-32"> 
          
          <div>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${colors.textDark}`}>
              <FiTruck className={colors.textDark}/> Política de Envíos
            </h2>
            <div className="prose text-gray-600 space-y-4">
              <p>Realizamos envíos a todo el país a través de <strong>Correo Argentino</strong> y <strong>Andreani</strong>.</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#4a3b2a]">
                <li><strong>Envío a Sucursal:</strong> 3 a 5 días hábiles.</li>
                <li><strong>Envío a Domicilio:</strong> 4 a 7 días hábiles.</li>
                <li><strong>Envío Gratis:</strong> {`Compras > $50.000.`}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#d8bf9f]/30 pt-8">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${colors.textDark}`}>
              <FiRefreshCw className={colors.textDark}/> Cambios y Devoluciones
            </h2>
            <div className="prose text-gray-600 space-y-4">
              <p>Si el producto no es tu talle, tenés <strong>30 días</strong> para el cambio.</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#4a3b2a]">
                <li>Las prendas deben estar sin uso y con la etiqueta puesta.</li>
                <li>El primer cambio por talle es <strong>gratis</strong>.</li>
                <li>Para gestionar un cambio escribinos por <strong>WhatsApp</strong> indicando tu numero de pedido.</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#d8bf9f]/30 pt-8">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${colors.textDark}`}>
              <FiCreditCard className={colors.textDark}/> Medios de Pago
            </h2>
            <div className="flex flex-wrap gap-3">
               <span className="px-4 py-2 bg-[#d8bf9f]/30 text-[#4a3b2a] border border-[#4a3b2a]/20 rounded-lg text-sm font-bold">Transferencia (-10%)</span>
               <span className="px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium">Efectivo</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contacto;