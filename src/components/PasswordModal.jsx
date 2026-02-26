import React, { useId } from 'react';
import { FiX, FiKey } from 'react-icons/fi';

const PasswordModal = ({ isOpen, user, onClose, onConfirm, isSaving }) => {
  const inputId = useId();
  const [password, setPassword] = React.useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(user.id, password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Cambiar Contraseña</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Cerrar modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-4">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                <FiKey />
             </div>
             <p className="text-sm text-gray-500">
                Ingresá la nueva clave para <strong>{user.username}</strong>
             </p>
          </div>

          <div className="space-y-1">
            <label htmlFor={inputId} className="text-xs font-bold text-gray-400 uppercase">Nueva Contraseña</label>
            <input 
              id={inputId}
              type="password" 
              placeholder="Mínimo 4 caracteres..." 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving || !password.trim()}
            className="w-full bg-blue-600 hover:bg-black text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Confirmar Cambio'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;