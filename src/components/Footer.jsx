import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-crema border-t border-brand-muted pt-20 pb-10 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo y Bio */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl md:text-4xl font-serif font-black tracking-tighter text-brand-dark mb-6 block">
              CAMEL.
            </Link>
            <p className="text-brand-secondary text-sm leading-relaxed font-medium pr-4">
              Definiendo el estilo urbano con calidad premium y diseños exclusivos. Envíos a todo el país.
            </p>
          </div>

          {/* Enlaces de Tienda */}
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-brand-dark mb-6">Tienda</h4>
            <ul className="space-y-4 text-sm text-brand-secondary font-medium">
              <li><Link to="/productos" className="hover:text-brand-primary transition-colors">Catálogo</Link></li>
              <li><Link to="/productos" className="hover:text-brand-primary transition-colors">Novedades</Link></li>
              <li><Link to="/contacto" className="hover:text-brand-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Enlaces de Ayuda */}
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-brand-dark mb-6">Asistencia</h4>
            <ul className="space-y-4 text-sm text-brand-secondary font-medium">
              <li><Link to="/contacto#envios" className="hover:text-brand-primary transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/contacto" className="hover:text-brand-primary transition-colors">Guía de Talles</Link></li>
              <li><Link to="/contacto" className="hover:text-brand-primary transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-brand-dark mb-6">Social</h4>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-brand-muted flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-crema hover:border-brand-dark transition-all duration-300">
                <FiInstagram size={18}/>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-brand-muted flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-crema hover:border-brand-dark transition-all duration-300">
                <FiFacebook size={18}/>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full border border-brand-muted flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-crema hover:border-brand-dark transition-all duration-300">
                <FiTwitter size={18}/>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-brand-muted pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-secondary font-medium uppercase tracking-widest">
          <p>© 2026 CAMEL. Todos los derechos reservados.</p>
          <p className="mt-4 md:mt-0">
            Hecho por <a href="https://www.gbsolucionesdigitales.com.ar" target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:text-brand-primary transition-colors">GB Soluciones Digitales</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;