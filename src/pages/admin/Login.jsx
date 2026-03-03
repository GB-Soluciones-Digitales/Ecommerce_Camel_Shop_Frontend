import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Acceso denegado. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col justify-center items-center p-4 font-sans">
      <Helmet>
        <title>Workspace | CAMEL.</title>
      </Helmet>

      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#2c241b] tracking-tighter mb-2">CAMEL.</h1>
          <p className="text-[10px] font-bold text-[#a48e78] uppercase tracking-[0.3em]">Workspace Privado</p>
        </div>

        <div className="bg-white p-10 shadow-2xl shadow-[#eaddd7]/50 border border-[#eaddd7]/50">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-800 text-xs uppercase tracking-widest flex items-center gap-3">
              <FiAlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#a48e78]">Usuario Admin</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b border-[#eaddd7] focus:border-[#2c241b] outline-none py-3 text-[#2c241b] bg-transparent transition-colors"
                placeholder="Ingresa tu ID"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#a48e78]">Clave de Acceso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-[#eaddd7] focus:border-[#2c241b] outline-none py-3 text-[#2c241b] bg-transparent transition-colors tracking-widest"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2c241b] text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-black transition-colors mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Autenticando...' : 'Ingresar al Sistema'}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-[#a48e78] uppercase tracking-[0.2em]">
          Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  );
};

export default Login;