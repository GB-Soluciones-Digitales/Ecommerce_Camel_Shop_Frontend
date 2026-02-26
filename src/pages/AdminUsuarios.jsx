import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService'; 
import { FiUser, FiShield, FiKey, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import PasswordModal from '../components/PasswordModal';

const AdminUsuarios = () => {
  const [state, setState] = useState({
    usuarios: [],
    loading: true,
    saving: false,
    selectedUser: null,
    isModalOpen: false
  });

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const res = await userService.getUsuarios();
      setState(prev => ({ ...prev, usuarios: res.data, loading: false }));
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePasswordUpdate = async (userId, newPassword) => {
    try {
      setState(prev => ({ ...prev, saving: true }));
      await userService.cambiarPassword(userId, newPassword);
      alert(`Contraseña actualizada correctamente`);
      setState(prev => ({ ...prev, isModalOpen: false, selectedUser: null, saving: false }));
    } catch (error) {
      alert('Error al actualizar la contraseña');
      setState(prev => ({ ...prev, saving: false }));
    }
  };

  if (state.loading) return <div className="p-8 text-gray-500 animate-pulse">Cargando usuarios...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Usuarios</h2>
          <p className="text-sm text-gray-500">Gestión de accesos y credenciales.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-xs font-bold text-gray-400">
          TOTAL: {state.usuarios.length}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.usuarios.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 transition hover:shadow-xl hover:border-blue-100">
            
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${
                  user.rol === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {user.rol === 'ADMIN' ? <FiShield /> : <FiUser />}
                </div>
                
                <div>
                    <h3 className="font-bold text-gray-900 leading-none mb-1">{user.username}</h3>
                    <p className="text-xs text-gray-400 truncate max-w-[150px] mb-2" title={user.email}>{user.email}</p>
                    
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] font-black text-gray-500 border border-gray-200 uppercase tracking-tighter">
                          {user.rol}
                        </span>
                        {user.activo ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-tighter">
                            <FiCheckCircle /> Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                            <FiXCircle /> Offline
                          </span>
                        )}
                    </div>
                </div>
            </div>

            <button 
              onClick={() => setState(prev => ({ ...prev, selectedUser: user, isModalOpen: true }))}
              className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition shadow-sm"
              title="Cambiar contraseña"
              aria-label={`Cambiar contraseña de ${user.username}`}
            >
              <FiKey size={18} />
            </button>
          </div>
        ))}
      </div>

      <PasswordModal 
        isOpen={state.isModalOpen}
        user={state.selectedUser}
        isSaving={state.saving}
        onClose={() => setState(prev => ({ ...prev, isModalOpen: false, selectedUser: null }))}
        onConfirm={handlePasswordUpdate}
      />
    </div>
  );
};

export default AdminUsuarios;