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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm font-sans" role="dialog" aria-modal="true">
      <div className="bg-crema shadow-2xl w-full max-w-sm border border-brand-muted" onClick={(e) => e.stopPropagation()}>
        
        <div className="px-6 py-5 border-b border-brand-muted flex justify-between items-center bg-white/50">
          <h3 className="font-serif font-bold text-lg text-brand-dark">Cambiar Clave</h3>
          <button 
            onClick={onClose} 
            className="text-brand-secondary hover:text-brand-dark transition-colors p-1"
            aria-label="Cerrar modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center mb-6">
             <div className="w-14 h-14 border border-brand-primary text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                <FiKey />
             </div>
             <p className="text-sm text-brand-secondary">
                Nueva clave para <strong className="text-brand-dark">{user.username}</strong>
             </p>
          </div>

          <div className="space-y-2">
            <label htmlFor={inputId} className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Contraseña</label>
            <input 
              id={inputId}
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-transparent border-b border-brand-muted py-2 outline-none focus:border-brand-dark text-brand-dark transition-colors tracking-widest placeholder:tracking-normal placeholder:text-brand-muted"
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
            className="w-full bg-brand-dark hover:bg-black text-crema text-xs font-bold uppercase tracking-widest py-4 transition-colors disabled:opacity-50 mt-4"
          >
            {isSaving ? 'Guardando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;