import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiChevronDown, FiChevronUp, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-brand-primary/30">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center py-6 text-left group"
      >
        <span className="font-serif text-lg md:text-xl text-brand-dark group-hover:text-brand-secondary transition-colors">
          {question}
        </span>

        {isOpen ? (
          <FiChevronUp className="text-brand-secondary" />
        ) : (
          <FiChevronDown className="text-brand-secondary" />
        )}
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-brand-secondary font-medium leading-relaxed max-w-3xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const Contacto = () => {
  const { hash } = useLocation();

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
    const mensaje = `Hola CAMEL. Mi nombre es ${formData.get('nombre')}. Consulta: ${formData.get('mensaje')}`;
    window.open(`https://wa.me/5493431234567?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-crema font-sans pb-24 pt-32">
      <Helmet>
        <title>Contacto | CAMEL</title>
        <meta name="description" content="Contactanos por WhatsApp, visitá nuestro showroom en Paraná o consultá nuestras políticas de envío." />
      </Helmet>

      {/* Hero Editorial */}
      <div className="max-w-[900px] mx-auto px-6 text-center mb-24">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-[0.3em] mb-4 block">Asistencia</span>
        <h1 className="text-5xl md:text-7xl font-serif font-medium text-brand-dark mb-6 tracking-tight">Contacto</h1>
        <p className="text-brand-secondary text-lg font-light max-w-lg mx-auto">
          Estamos aquí para resolver tus dudas y asegurar que tu experiencia sea excepcional.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Formulario */}
          <div>
            <h2 className="text-3xl font-serif text-brand-dark mb-8 pb-4 border-b border-brand-primary/40">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Nombre y Apellido</label>
                      <input name="nombre" required className="w-full bg-transparent border-b border-brand-primary/40 focus:border-brand-dark outline-none py-3 text-brand-dark transition-colors" placeholder="Escribe tu nombre" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Email (Opcional)</label>
                      <input name="email" type="email" className="w-full bg-transparent border-b border-brand-primary/40 focus:border-brand-dark outline-none py-3 text-brand-dark transition-colors" placeholder="tu@email.com" />
                  </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Mensaje</label>
                <textarea name="mensaje" rows="4" required className="w-full bg-transparent border-b border-brand-primary/40 focus:border-brand-dark outline-none py-3 text-brand-dark resize-none transition-colors" placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              <button type="submit" className="bg-brand-dark text-brand-muted text-xs font-bold uppercase tracking-[0.2em] py-5 px-10 hover:bg-brand-secondary transition-colors mt-4">
                Enviar a WhatsApp
              </button>
            </form>
          </div>

          {/* Información de Contacto Directo */}
          <div className="space-y-16">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary mb-4">Showroom Oficial</h3>
              <p className="font-serif text-2xl text-brand-dark">Paraná, Entre Ríos</p>
              <p className="text-[#a48e78] mt-2 font-medium">Atención con cita previa para una experiencia personalizada.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-12 sm:gap-20">
              <div>
                <FaWhatsapp className="text-brand-secondary" size={28} /><p className='text-brand-secondary text-sm font-bold uppercase tracking-[0.2em] py-5 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl'>WhatsApp</p>
                <a href="https://wa.me/5493431234567" className="text-lg font-medium text-brand-dark hover:text-brand-secondary transition-colors border-b border-brand-secondary/40 hover:border-brand-primary pb-1">+54 9 343 123 4567</a>
              </div>
              <div>
                <FiMail className="text-brand-secondary" size={28} /><p className='text-brand-secondary text-sm font-bold uppercase tracking-[0.2em] py-5 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl'>Email</p>
                <a href="mailto:hola@camelshop.com.ar" className="text-lg font-medium text-brand-dark hover:text-brand-secondary transition-colors border-b border-brand-secondary/40 hover:border-brand-primary pb-1">hola@camel.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Acordeón FAQ Editorial */}
        <div id="envios" className="mt-32 max-w-[900px] mx-auto scroll-mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-brand-dark tracking-tight">Preguntas Frecuentes</h2>
            </div>
            <div className="border-t border-brand-primary/40">
                <FAQItem 
                    question="¿Cuál es la política de envíos?" 
                    answer="Realizamos envíos a todo el país mediante Correo Argentino y Andreani. Los despachos se realizan dentro de las 48hs hábiles. Ofrecemos envío sin cargo en compras superiores a $80.000."
                />
                <FAQItem 
                    question="¿Cómo sé cuál es mi talle?" 
                    answer="Cada pieza cuenta con una 'Guía de Talles' detallada en su descripción. Te recomendamos comparar esas medidas con una prenda tuya sobre una superficie plana."
                />
                <FAQItem 
                    question="¿Cuáles son los medios de pago?" 
                    answer="Aceptamos Transferencia Bancaria (con 10% de descuento aplicado en el total), Efectivo en nuestro showroom y todas las tarjetas a través de links de pago seguros."
                />
                <FAQItem 
                    question="¿Realizan cambios?" 
                    answer="Sí, diseñamos para que estés conforme. Tienes 30 días para realizar un cambio. La prenda debe retornar en las mismas condiciones entregadas, sin uso y con sus etiquetas."
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default Contacto;