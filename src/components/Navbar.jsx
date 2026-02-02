import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartItemsCount, toggleCart } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/productos' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const colors = {
    bg: 'bg-[#d8bf9f]',
    text: 'text-[#4a3b2a]',
    textHover: 'hover:text-black',
    activeText: 'text-black font-extrabold',
    activeBorder: 'border-black',
  };

  return (
    <nav className={`sticky top-0 z-40 ${colors.bg} backdrop-blur-md border-b border-black/5 shadow-sm transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <img 
              src="/Logo.png" 
              alt="Camel Shop Logo" 
              className="h-14 w-auto object-contain drop-shadow-sm" 
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-wide transition-all duration-200 border-b-2 py-1 ${
                  isActive(link.path)
                    ? `${colors.activeText} ${colors.activeBorder}`
                    : `${colors.text} border-transparent ${colors.textHover} hover:border-black/20`
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-black/10 mx-2"></div>

            <button 
              onClick={toggleCart}
              className={`relative p-2 ${colors.text} hover:text-black hover:bg-black/5 rounded-full transition duration-300 group`}
            >
              <FiShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              {getCartItemsCount() > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-[#d8bf9f] shadow-sm ring-2 ring-[#d8bf9f] animate-pulse-short">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleCart}
              className={`relative p-2 ${colors.text}`}
            >
              <FiShoppingCart size={24} />
              {getCartItemsCount() > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-black ring-2 ring-[#d8bf9f]"></span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${colors.text} hover:text-black transition p-1 rounded-md active:bg-black/10`}
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden ${colors.bg} border-t border-black/5 absolute w-full shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-black/10 text-black font-bold'
                  : `${colors.text} hover:bg-black/5 hover:text-black`
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;