import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import LandingPage from './pages/LandingPage';       
import ProductosPage from './pages/Productos';       
import ProductoDetallePage from './pages/ProductoDetalle'; 
import Contacto from './pages/Contacto';             
import CheckoutPage from './pages/CheckoutPage';     
import Login from './pages/Login';                   

import AdminDashboard from './pages/AdminDashboard'; 
import AdminCategorias from './pages/AdminCategorias';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminOrders from './pages/AdminPedidos'; 
import AdminHero from './pages/AdminHero';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/producto/:id" element={<ProductoDetallePage />} />
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
  );
}

export default App;