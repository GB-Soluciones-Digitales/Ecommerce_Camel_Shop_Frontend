import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import { HelmetProvider } from 'react-helmet-async';
import { ReactLenis } from 'lenis/react';
import { Toaster } from "sileo";

import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';

const ProductosPage = lazy(() => import('./pages/producto/Productos'));       
const ProductoDetallePage = lazy(() => import('./pages/producto/ProductoDetalle')); 
const Contacto = lazy(() => import('./pages/Contacto'));             
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));                

const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));                   
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard')); 
const AdminCategorias = lazy(() => import('./pages/admin/AdminCategorias'));
const AdminUsuarios = lazy(() => import('./pages/admin/AdminUsuarios'));
const AdminOrders = lazy(() => import('./pages/admin/AdminPedidos')); 
const AdminHero = lazy(() => import('./pages/admin/AdminHero'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-crema">
    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <HelmetProvider>
        <Toaster position="bottom-left" />
        <CartProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </Router>
        </CartProvider>
      </HelmetProvider>
    </ReactLenis>
  );
}

export default App;