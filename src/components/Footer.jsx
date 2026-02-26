import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const theme = {
    bg: 'bg-[#d8bf9f]',
    textMain: 'text-[#4a3b2a]',
    textLight: 'text-[#4a3b2a]/80', 
    border: 'border-[#4a3b2a]/10',
    iconBg: 'bg-[#4a3b2a]/10',
    iconHover: 'hover:bg-[#4a3b2a] hover:text-[#d8bf9f]'
  };

  return (
    <footer className={`${theme.bg} border-t ${theme.border} pt-16 pb-8 mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <img 
              src="/Logo.png" 
              alt="Camel Shop Logo" 
              className="h-14 w-auto object-contain" 
            />
            <p className={`${theme.textLight} text-sm leading-relaxed font-medium`}>
              Definiendo el estilo urbano con calidad premium y diseños exclusivos. Envíos a todo el país.
            </p>
          </div>

          <div>
            <h4 className={`font-bold ${theme.textMain} mb-4`}>Tienda</h4>
            <ul className={`space-y-2 text-sm ${theme.textLight} font-medium`}>
              <li><Link to="/productos" className="hover:text-black transition">Catálogo</Link></li>
              <li><Link to="/productos" className="hover:text-black transition">Ofertas</Link></li>
              <li><Link to="/contacto" className="hover:text-black transition">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold ${theme.textMain} mb-4`}>Ayuda</h4>
            <ul className={`space-y-2 text-sm ${theme.textLight} font-medium`}>
              <li><Link to="/contacto#envios" className="hover:text-black transition">Envíos y Devoluciones</Link></li>
              <li><Link to="/contacto" className="hover:text-black transition">Guía de Talles</Link></li>
              <li><Link to="/contacto" className="hover:text-black transition">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold ${theme.textMain} mb-4`}>Seguinos</h4>
            <div className="flex gap-4">
              <a href="#" className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.textMain} ${theme.iconHover} transition duration-300`}>
                <FiInstagram size={20}/>
              </a>
              <a href="#" className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.textMain} ${theme.iconHover} transition duration-300`}>
                <FiFacebook size={20}/>
              </a>
              <a href="#" className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center ${theme.textMain} ${theme.iconHover} transition duration-300`}>
                <FiTwitter size={20}/>
              </a>
            </div>
          </div>
        </div>

        <div className={`border-t ${theme.border} pt-8 flex flex-col md:flex-row justify-between items-center text-sm ${theme.textLight}`}>
          <p>© 2026 Camel Shop. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0 font-medium">
            Hecho por <a href="https://www.gbsolucionesdigitales.com.ar" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline transition">GB Soluciones Digitales.</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;