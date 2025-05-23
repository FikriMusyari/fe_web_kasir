import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../data/Api';
import { UserPlus, Shield, Lock } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AddAccountPage = ({ userRole, userName, onLogout }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('kasir');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add-account');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Semua kolom harus diisi!');
      return;
    }

    const response = await addUser({ username, role, password });

    if (response.success) {
      alert('Akun berhasil ditambahkan!');
      navigate('/settings');
    } else {
      alert('Gagal menambahkan akun!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex justify-center items-center min-h-screen p-4">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center mb-6">
              <UserPlus className="text-indigo-600 mr-3" size={28} />
              <h2 className="text-2xl font-semibold text-indigo-700">Tambah Akun Baru</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-medium">Username</label>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-indigo-500">
                  <Shield size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    className="bg-transparent outline-none w-full"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-medium">Password</label>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-indigo-500">
                  <Lock size={18} className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    className="bg-transparent outline-none w-full"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1 font-medium">Role</label>
                <select
                  className="w-full border px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 ring-indigo-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="kasir">Kasir</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-300"
              >
                Tambah Akun
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountPage;