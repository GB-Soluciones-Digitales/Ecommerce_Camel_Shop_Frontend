import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { FiPackage, FiLogOut, FiGrid, FiUsers, FiLayout, FiMenu, FiX } from 'react-icons/fi';

const MENU_ITEMS = [
  { path: '/admin/dashboard', icon: <FiPackage />, label: 'Productos' },
  { path: '/admin/categorias', icon: <FiGrid />, label: 'Categorías' },
  { path: '/admin/pedidos', icon: <FiPackage />, label: 'Pedidos' },
  { path: '/admin/usuarios', icon: <FiUsers />, label: 'Usuarios' },
  { path: '/admin/hero', icon: <FiLayout />, label: 'Hero Slider' },
];

const NavLinks = ({ location, onCloseMobileMenu }) => (
  <div className="space-y-1">
    <div className="px-4 py-3 mb-2">
      <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.2em]">Menú Principal</p>
    </div>
    {MENU_ITEMS.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={onCloseMobileMenu} 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium tracking-wide ${
            isActive
              ? `bg-brand-primary/20 text-brand-muted font-bold border-l-2 border-brand-primary`
              : `text-brand-secondary hover:bg-brand-primary/10 hover:text-brand-muted border-l-2 border-transparent`
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      );
    })}
  </div>
);

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-crema overflow-hidden font-sans">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-brand-dark flex-col shadow-2xl z-20 hidden md:flex border-r border-brand-secondary/30">
        <div className="p-8 border-b border-brand-secondary/20 flex items-center justify-center">
          <span className="text-2xl font-serif font-black text-brand-muted tracking-tighter">CAMEL.</span>
          <span className="ml-2 text-[10px] text-brand-secondary uppercase tracking-widest mt-1">Admin</span>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <NavLinks location={location} onCloseMobileMenu={closeMobileMenu} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-brand-secondary hover:text-brand-muted hover:bg-brand-secondary/10 rounded-lg transition-colors text-sm font-medium tracking-wide">
            <FiLogOut /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* SIDEBAR MOBILE */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm transition-opacity" onClick={closeMobileMenu} />
          <aside className="absolute top-0 left-0 w-64 h-full bg-brand-dark flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <span className="text-xl font-serif font-black text-[#F9F6F0] tracking-tighter">CAMEL.</span>
              <button onClick={closeMobileMenu} className="p-2 text-brand-secondary hover:text-brand-muted rounded-full transition">
                <FiX size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <NavLinks location={location} onCloseMobileMenu={closeMobileMenu} />
            </nav>

            <div className="p-6 border-t border-white/5">
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-brand-secondary hover:text-brand-muted bg-brand-secondary/10 rounded-lg text-sm font-medium transition">
                <FiLogOut /> Cerrar Sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-brand-dark text-brand-muted h-16 flex items-center justify-between px-4 md:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-brand-secondary/20 rounded-lg transition">
            <FiMenu size={24} />
          </button>
          <span className="font-serif font-bold text-lg tracking-tight">CAMEL. Admin</span>
          <div className="w-8 h-8 bg-brand-primary text-brand-dark rounded-full flex items-center justify-center font-bold text-xs uppercase">AD</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-crema p-4 md:p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;