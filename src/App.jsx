import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import LandingPage from './pages/LandingPage';       
import ProductosPage from './pages/producto/Productos';       
import ProductoDetallePage from './pages/producto/ProductoDetalle'; 
import Contacto from './pages/Contacto';             
import CheckoutPage from './pages/CheckoutPage';     
import Login from './pages/admin/Login';                   

import AdminDashboard from './pages/admin/AdminDashboard'; 
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminOrders from './pages/admin/AdminPedidos'; 
import AdminHero from './pages/admin/AdminHero';

import { HelmetProvider } from 'react-helmet-async';
import { ReactLenis } from 'lenis/react';
import { Toaster } from "sileo";

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <HelmetProvider>
        <Toaster position="bottom-left" />
        <CartProvider>
          <Router>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/productos" element={<ProductosPage />} />
                <Route path="/producto/:slug" element={<ProductoDetallePage />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>

              <Route path="/admin/login" element={<Login />} />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="categorias" element={<AdminCategorias />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
                <Route path="pedidos" element={<AdminOrders />} />
                <Route path="hero" element={<AdminHero />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            
            </Routes>
          </Router>
        </CartProvider>
      </HelmetProvider>
    </ReactLenis>
  );
}

export default App;