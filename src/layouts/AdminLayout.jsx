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

const COLORS = {
  sidebarBg: 'bg-[#4a3b2a]',
  sidebarText: 'text-[#d8bf9f]',
  mainBg: 'bg-[#f9f5f0]',
  activeItemBg: 'bg-[#d8bf9f]',
  activeItemText: 'text-[#4a3b2a]',
  hoverItem: 'hover:bg-[#d8bf9f]/10 hover:text-[#d8bf9f]',
  borderColor: 'border-[#d8bf9f]/10'
};

const NavLinks = ({ location, onCloseMobileMenu }) => (
  <div className="space-y-2">
    {MENU_ITEMS.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={onCloseMobileMenu} 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
            isActive
              ? `${COLORS.activeItemBg} ${COLORS.activeItemText} shadow-lg shadow-black/20 font-bold transform translate-x-1`
              : `${COLORS.sidebarText}/70 ${COLORS.hoverItem}`
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
    <div className={`flex h-screen ${COLORS.mainBg} overflow-hidden font-sans`}>
      
      {/* SIDEBAR DESKTOP */}
      <aside className={`w-64 ${COLORS.sidebarBg} ${COLORS.sidebarText} flex-col shadow-2xl z-20 hidden md:flex border-r ${COLORS.borderColor}`}>
        <div className={`p-6 border-b ${COLORS.borderColor} flex items-center gap-3`}>
          <div className={`w-8 h-8 ${COLORS.activeItemBg} rounded-lg flex items-center justify-center font-bold ${COLORS.activeItemText} shadow-md`}>C</div>
          <span className="text-lg font-bold tracking-wide">Camel Admin</span>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLinks location={location} onCloseMobileMenu={closeMobileMenu} />
        </nav>

        <div className={`p-4 border-t ${COLORS.borderColor}`}>
          <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-2 w-full ${COLORS.sidebarText}/60 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium`}>
            <FiLogOut /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* SIDEBAR MOBILE */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeMobileMenu} />
          <aside className={`absolute top-0 left-0 w-64 h-full ${COLORS.sidebarBg} ${COLORS.sidebarText} flex flex-col shadow-2xl animate-slide-in`}>
            <div className={`p-4 border-b ${COLORS.borderColor} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${COLORS.activeItemBg} rounded-lg flex items-center justify-center font-bold ${COLORS.activeItemText}`}>C</div>
                <span className="font-bold">Camel Admin</span>
              </div>
              <button onClick={closeMobileMenu} className="p-2 hover:bg-white/10 rounded-full">
                <FiX size={24} />
              </button>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
              <NavLinks location={location} onCloseMobileMenu={closeMobileMenu} />
            </nav>

            <div className={`p-4 border-t ${COLORS.borderColor}`}>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full bg-red-500/10 text-red-300 rounded-lg font-medium">
                <FiLogOut /> Cerrar Sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className={`${COLORS.sidebarBg} text-[#d8bf9f] shadow-md h-16 flex items-center justify-between px-4 md:hidden z-10 flex-shrink-0`}>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition">
            <FiMenu size={24} />
          </button>
          <span className="font-bold text-lg">Panel de Control</span>
          <div className="w-8 h-8 bg-[#d8bf9f] text-[#4a3b2a] rounded-full flex items-center justify-center font-bold text-xs">A</div>
        </header>
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${COLORS.mainBg} p-4 md:p-8 scroll-smooth`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;