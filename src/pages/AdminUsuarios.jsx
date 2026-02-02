import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService'; 
import { FiUser, FiShield, FiKey, FiX, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsuarios();
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword(''); // Limpiar el input
    setShowModal(true);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    try {
      setSaving(true);
      await userService.cambiarPassword(selectedUser.id, newPassword);
      alert(`Contraseña actualizada correctamente para ${selectedUser.username}`);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Cargando usuarios...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Usuarios del Sistema</h2>
        <div className="text-sm text-gray-500">
            Total: {usuarios.length} usuarios
        </div>
      </div>
      
      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 transition hover:shadow-md">
            
            {/* IZQUIERDA: ICONO E INFO */}
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                user.rol === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}>
                {user.rol === 'ADMIN' ? <FiShield /> : <FiUser />}
                </div>
                
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-[120px]" title={user.email}>{user.email}</p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">{user.rol}</span>
                        {user.activo ? (
                        <span className="flex items-center gap-1 text-green-600"><FiCheckCircle size={10} /> Activo</span>
                        ) : (
                        <span className="flex items-center gap-1 text-red-600"><FiXCircle size={10} /> Inactivo</span>
                        )}
                    </div>
                </div>
            </div>

            {/* DERECHA: BOTÓN CAMBIAR CLAVE */}
            <button 
              onClick={() => openPasswordModal(user)}
              className="p-3 rounded-lg bg-gray-50 text-gray-400 hover:bg-camel-100 hover:text-camel-600 transition border border-transparent hover:border-camel-200"
              title="Cambiar contraseña"
            >
                <FiKey size={20} />
            </button>

          </div>
        ))}
      </div>

      {/* MODAL PARA CAMBIAR PASSWORD */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all">
            
            {/* Header del Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Cambiar Contraseña</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            {/* Body del Modal */}
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div className="text-center mb-4">
                 <div className="w-16 h-16 bg-camel-100 text-camel-600 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                    <FiKey />
                 </div>
                 <p className="text-sm text-gray-500">
                    Ingresá la nueva clave para <strong>{selectedUser.username}</strong>
                 </p>
              </div>

              <div>
                <input 
                    type="password" 
                    placeholder="Nueva contraseña..." 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-camel-500 transition"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={4}
                />
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-camel-600 hover:bg-camel-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-camel-500/30 flex justify-center items-center"
              >
                {saving ? 'Guardando...' : 'Confirmar Cambio'}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;