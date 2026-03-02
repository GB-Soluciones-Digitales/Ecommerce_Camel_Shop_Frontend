import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartItemsCount, toggleCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 bg-brand-primary ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          
          {/* LOGO TIPOGRÁFICO SERIF */}
          <Link to="/" className={`text-3xl md:text-4xl font-serif font-black tracking-tighter text-brand-muted`}>
            CAMEL<span className='text-brand-dark text-5xl'>.</span>
          </Link>

          {/* ENLACES CENTRALES (Desktop) */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className={`text-sm tracking-widest uppercase font-medium transition-colors text-brand-muted hover:text-brand-secondary`}>
              Inicio
            </Link>
            
            {/* Dropdown Colección */}
            <div 
              className="relative py-4"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className={`flex items-center gap-1 text-sm tracking-widest uppercase font-medium transition-colors text-brand-muted hover:text-brand-secondary`}>
                Colección <FiChevronDown className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Menú Desplegable */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-56 bg-crema border border-brand-primary/30 shadow-xl rounded-xl py-3 transition-all duration-300 ${showDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <Link to="/productos?categoria=remeras" className="block px-6 py-2.5 text-sm text-brand-dark hover:bg-brand-primary/20 transition-colors">Remeras & Tops</Link>
                <Link to="/productos?categoria=pantalones" className="block px-6 py-2.5 text-sm text-brand-dark hover:bg-brand-primary/20 transition-colors">Pantalones & Denim</Link>
                <Link to="/productos?categoria=buzos" className="block px-6 py-2.5 text-sm text-brand-dark hover:bg-brand-primary/20 transition-colors">Buzos & Camperas</Link>
                <div className="h-px bg-brand-primary/30 my-2 mx-4"></div>
                <Link to="/productos" className={`block px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-brand-dark hover:bg-brand-primary/20 transition-colors`}>Ver Todo</Link>
              </div>
            </div>

            <Link to="/contacto" className={`text-sm tracking-widest uppercase font-medium transition-colors text-brand-muted  hover:text-brand-secondary`}>
              Contacto
            </Link>
          </div>

          <div className={`hidden md:flex items-center space-x-6 text-brand-muted`}>
            <button className={` hover:text-brand-secondary transition-colors`} aria-label="Buscar"><FiSearch size={22} strokeWidth={1.5} /></button>
            <button className={` hover:text-brand-secondary transition-colors`} aria-label="Favoritos"><FiHeart size={22} strokeWidth={1.5} /></button>
            
            <button onClick={toggleCart} className={`relative  hover:text-brand-secondary transition-colors`} aria-label="Carrito">
              <FiShoppingBag size={22} strokeWidth={1.5} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-dark text-[9px] font-bold text-crema">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
            
            <Link to="/admin" className={` hover:text-brand-secondary transition-colors`} aria-label="Usuario"><FiUser size={22} strokeWidth={1.5} /></Link>
          </div>

          {/* MENU MOBILE */}
          <div className={`md:hidden flex items-center gap-5 text-brand-muted`}>
            <button onClick={toggleCart} className="relative">
              <FiShoppingBag size={24} strokeWidth={1.5} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-dark"></span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={28} strokeWidth={1.5} /> : <FiMenu size={28} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* DROPDOWN MOBILE */}
      <div className={`md:hidden absolute w-full bg-crema border-t border-brand-primary/30 shadow-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-8 flex flex-col space-y-6">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-xl font-serif text-brand-dark">Inicio</Link>
          <Link to="/productos" onClick={() => setIsOpen(false)} className="text-xl font-serif text-brand-dark">Colección</Link>
          <Link to="/contacto" onClick={() => setIsOpen(false)} className="text-xl font-serif text-brand-dark">Contacto</Link>
          <div className="h-px bg-brand-primary/30 w-full"></div>
          <div className="flex gap-6 text-[#2c241b] pt-2">
            <FiSearch size={24} strokeWidth={1.5} />
            <FiHeart size={24} strokeWidth={1.5} />
            <Link to="/admin"><FiUser size={24} strokeWidth={1.5} /></Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;