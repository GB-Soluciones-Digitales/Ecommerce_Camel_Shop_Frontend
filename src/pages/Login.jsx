import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { FiLock, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const colors = {
    bgPage: 'bg-[#f9f5f0]',
    cardHeader: 'bg-[#4a3b2a]',
    textHeader: 'text-[#d8bf9f]',
    textLabel: 'text-[#4a3b2a]',
    inputFocus: 'focus:ring-[#4a3b2a] focus:border-[#4a3b2a]',
    button: 'bg-[#4a3b2a] hover:bg-black text-[#d8bf9f]'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${colors.bgPage} flex items-center justify-center p-4`}>
      <Helmet>
        <title>Acceso Administrativo | Camel Shop</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d8bf9f]/20">
        
        <div className={`${colors.cardHeader} p-10 text-center`}>
          <h1 className={`text-3xl font-bold ${colors.textHeader} mb-2 tracking-wide`}>Camel Shop</h1>
          <p className={`${colors.textHeader}/80 font-medium`}>Panel de Control</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center justify-center gap-2 border border-red-100">
              <FiAlertCircle /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className={`text-sm font-bold ${colors.textLabel}`}>Usuario</label>
            <div className="relative group">
              <FiUser className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#4a3b2a] transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none transition shadow-sm ${colors.inputFocus}`}
                placeholder="Ingresá tu usuario"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold ${colors.textLabel}`}>Contraseña</label>
            <div className="relative group">
              <FiLock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-[#4a3b2a] transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none transition shadow-sm ${colors.inputFocus}`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${colors.button} font-bold py-3.5 rounded-xl transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg`}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
            {!loading && <FiArrowRight />}
          </button>
        </form>
        
        <div className="bg-[#f9f5f0] p-4 text-center text-xs text-[#4a3b2a]/60 border-t border-[#d8bf9f]/20">
          Sistema de Gestión Integral v2.0
        </div>
      </div>
    </div>
  );
};

export default Login;