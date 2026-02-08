import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiPhone, FiMail, FiSend, FiTruck, FiRefreshCw, FiCreditCard, FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#4a3b2a]/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
      >
        <span className="font-bold text-[#4a3b2a]">{question}</span>
        {isOpen ? <FiChevronUp className="text-[#d8bf9f]" /> : <FiChevronDown className="text-[#4a3b2a]" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Contacto = () => {
  const { hash } = useLocation();

  const colors = {
    bgDark: 'bg-[#4a3b2a]', 
    textLight: 'text-[#d8bf9f]',
    textDark: 'text-[#4a3b2a]',
    bgLight: 'bg-[#f9f5f0]',
    button: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]'
  };

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mensaje = `Hola Camel Shop! Mi nombre es ${formData.get('nombre')}. Consulta: ${formData.get('mensaje')}`;
    window.open(`https://wa.me/5493431234567?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Helmet>
        <title>Contacto y Envíos | Camel Shop</title>
        <meta name="description" content="Contactanos por WhatsApp, visitá nuestro showroom en Paraná o consultá nuestras políticas de envío y cambio." />
      </Helmet>

      {/* Header Hero */}
      <div className={`${colors.bgDark} py-20 px-6 text-center relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-black mb-6 ${colors.textLight} uppercase tracking-tight`}>Centro de Atención</h1>
            <p className="text-[#d8bf9f]/90 text-lg font-medium leading-relaxed">
            Estamos acá para ayudarte. Ya sea una duda sobre talles, envíos o simplemente para saludar.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Info Cards */}
            {[
                { icon: <FiMapPin size={28}/>, title: "Showroom", text: "Av. Siempre Viva 123", sub: "Paraná, Entre Ríos" },
                { icon: <FiPhone size={28}/>, title: "WhatsApp", text: "+54 9 343 123 4567", sub: "Lun a Vie: 9hs - 18hs" },
                { icon: <FiMail size={28}/>, title: "Email", text: "contacto@camelshop.com", sub: "Respuesta en 24hs" }
            ].map((card, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-[#4a3b2a]/5 border border-[#4a3b2a]/5 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="bg-[#f9f5f0] p-4 rounded-full text-[#4a3b2a] mb-4">{card.icon}</div>
                    <h3 className="font-bold text-xl text-[#4a3b2a] mb-2">{card.title}</h3>
                    <p className="text-gray-800 font-medium">{card.text}</p>
                    <p className="text-gray-500 text-sm mt-1">{card.sub}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Formulario */}
        <div className="bg-[#f9f5f0] p-8 md:p-10 rounded-3xl shadow-sm border border-[#d8bf9f]/20">
          <h2 className={`text-2xl font-black mb-2 ${colors.textDark} uppercase`}>Envianos un mensaje</h2>
          <p className="text-gray-600 mb-8">Te responderemos directamente a tu WhatsApp.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-xs font-bold text-[#4a3b2a] mb-1 ml-1 uppercase">Nombre</label>
                    <input name="nombre" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4a3b2a] focus:border-transparent outline-none transition bg-white" placeholder="Tu nombre" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#4a3b2a] mb-1 ml-1 uppercase">Email (Opcional)</label>
                    <input name="email" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4a3b2a] focus:border-transparent outline-none transition bg-white" placeholder="tu@email.com" />
                </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4a3b2a] mb-1 ml-1 uppercase">Mensaje</label>
              <textarea name="mensaje" rows="4" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4a3b2a] focus:border-transparent outline-none transition bg-white resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button type="submit" className={`w-full ${colors.button} font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95`}>
              <FiSend /> Enviar WhatsApp
            </button>
          </form>
        </div>

        <div className="space-y-10">
            <div id="envios" className="scroll-mt-32">
                <h2 className={`text-2xl font-black mb-6 flex items-center gap-3 ${colors.textDark} uppercase`}>
                    <FiTruck className="text-[#d8bf9f]"/> Información de Envíos
                </h2>
                <div className="bg-white border-l-4 border-[#4a3b2a] pl-6 py-2 space-y-4">
                    <p className="text-gray-600">
                        Realizamos envíos a todo el país a través de <strong>Correo Argentino</strong> y <strong>Andreani</strong>. 
                        Una vez despachado, recibirás el código de seguimiento.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-2">
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#d8bf9f] rounded-full"></div> Envío a Sucursal: 3 a 5 días hábiles.</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#d8bf9f] rounded-full"></div> Envío a Domicilio: 4 a 7 días hábiles.</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <strong>Envío Gratis:</strong> Compras superiores a $50.000.</li>
                    </ul>
                </div>
            </div>

            <div>
                <h2 className={`text-2xl font-black mb-6 flex items-center gap-3 ${colors.textDark} uppercase`}>
                    <FiHelpCircle className="text-[#d8bf9f]"/> Preguntas Frecuentes
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <FAQItem 
                        question="¿Tienen local físico?" 
                        answer="Sí, tenemos un Showroom en Paraná. Podés pasar a probarte todo con cita previa o en nuestros horarios de atención."
                    />
                    <FAQItem 
                        question="¿Cómo sé cuál es mi talle?" 
                        answer="En la descripción de cada producto detallamos las medidas. Si tenés dudas, escribinos por WhatsApp y te asesoramos."
                    />
                    <FAQItem 
                        question="¿Cuáles son los medios de pago?" 
                        answer="Aceptamos Transferencia Bancaria (10% OFF), Efectivo en el local y todas las Tarjetas de Crédito/Débito."
                    />
                    <FAQItem 
                        question="¿Realizan cambios?" 
                        answer="Sí, tenés 30 días para realizar cambios. La prenda debe estar en perfectas condiciones y con la etiqueta puesta."
                    />
                </div>
            </div>
        </div>

      </div>

      <div className="w-full h-96 bg-gray-200 grayscale filter">
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27192.68449970923!2d-60.53697926207036!3d-31.73305574577439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b4526017267b2d%3A0x10da20c0255b727!2zUGFyYW7DoSwgRW50cmUgUsOtb3M!5e0!3m2!1ses-419!2sar!4v1707835000000!5m2!1ses-419!2sar" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Camel Shop"
        ></iframe>
      </div>
    </div>
  );
};

export default Contacto;