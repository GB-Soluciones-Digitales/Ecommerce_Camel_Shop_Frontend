import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { FiPackage, FiLogOut, FiGrid, FiUsers, FiLayout, FiMenu, FiX } from 'react-icons/fi';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiPackage />, label: 'Productos' },
    { path: '/admin/categorias', icon: <FiGrid />, label: 'Categorías' },
    { path: '/admin/pedidos', icon: <FiPackage />, label: 'Pedidos' },
    { path: '/admin/usuarios', icon: <FiUsers />, label: 'Usuarios' },
    { path: '/admin/hero', icon: <FiLayout />, label: 'Hero Slider' },
  ];

  // Paleta de Colores Admin (Café & Arena)
  const colors = {
    sidebarBg: 'bg-[#4a3b2a]',      // Café Oscuro
    sidebarText: 'text-[#d8bf9f]',  // Arena
    mainBg: 'bg-[#f9f5f0]',         // Hueso
    activeItemBg: 'bg-[#d8bf9f]',   // Fondo activo
    activeItemText: 'text-[#4a3b2a]', // Texto activo
    hoverItem: 'hover:bg-[#d8bf9f]/10 hover:text-[#d8bf9f]',
    borderColor: 'border-[#d8bf9f]/10'
  };

  // Componente de Enlaces (Reutilizable para Desktop y Mobile)
  const NavLinks = () => (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
              isActive
                ? `${colors.activeItemBg} ${colors.activeItemText} shadow-lg shadow-black/20 font-bold transform translate-x-1`
                : `${colors.sidebarText}/70 ${colors.hoverItem}`
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className={`flex h-screen ${colors.mainBg} overflow-hidden font-sans`}>
      
      {/* --- SIDEBAR DESKTOP (Oculto en móvil) --- */}
      <aside className={`w-64 ${colors.sidebarBg} ${colors.sidebarText} flex-col shadow-2xl z-20 hidden md:flex border-r ${colors.borderColor}`}>
        <div className={`p-6 border-b ${colors.borderColor} flex items-center gap-3`}>
          <div className={`w-8 h-8 ${colors.activeItemBg} rounded-lg flex items-center justify-center font-bold ${colors.activeItemText} shadow-md`}>C</div>
          <span className="text-lg font-bold tracking-wide">Camel Admin</span>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className={`p-4 border-t ${colors.borderColor}`}>
          <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-2 w-full ${colors.sidebarText}/60 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium`}>
            <FiLogOut /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- SIDEBAR MOBILE (Overlay) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Fondo oscuro al hacer click cierra */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Menú deslizable */}
          <aside className={`absolute top-0 left-0 w-64 h-full ${colors.sidebarBg} ${colors.sidebarText} flex flex-col shadow-2xl animate-slide-in`}>
            <div className={`p-4 border-b ${colors.borderColor} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${colors.activeItemBg} rounded-lg flex items-center justify-center font-bold ${colors.activeItemText}`}>C</div>
                <span className="font-bold">Camel Admin</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <FiX size={24} />
              </button>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <NavLinks />
            </nav>

            <div className={`p-4 border-t ${colors.borderColor}`}>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full bg-red-500/10 text-red-300 rounded-lg font-medium">
                <FiLogOut /> Cerrar Sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header Mobile */}
        <header className={`${colors.sidebarBg} text-[#d8bf9f] shadow-md h-16 flex items-center justify-between px-4 md:hidden z-10 flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition">
              <FiMenu size={24} />
            </button>
            <span className="font-bold text-lg">Panel de Control</span>
          </div>
          <div className="w-8 h-8 bg-[#d8bf9f] text-[#4a3b2a] rounded-full flex items-center justify-center font-bold text-xs">
            A
          </div>
        </header>

        {/* Area de Trabajo */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${colors.mainBg} p-4 md:p-8 scroll-smooth`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;