import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../data/Api';
import { Settings, User, UserPlus, Edit3, Save, X, Shield, Lock, Eye, EyeOff, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const apiService = {
  getUsers: () => Promise.resolve({
    success: true,
    data: [
      { id: 1, username: 'owner1', role: 'owner', createdAt: '2024-01-15', nama: 'Owner Pertama' },
      { id: 2, username: 'kasir1', role: 'kasir', createdAt: '2024-01-20', nama: 'Kasir Satu' },
      { id: 3, username: 'kasir2', role: 'kasir', createdAt: '2024-02-01', nama: 'Kasir Dua' }
    ]
  }),
  updateUser: (userData) => Promise.resolve({ success: true, message: 'User updated successfully' }),
  addUser: (userData) => Promise.resolve({ success: true, message: 'User added successfully' }),
  deleteUser: (userId) => Promise.resolve({ success: true, message: 'User deleted successfully' }),
  updateProfile: (profileData) => Promise.resolve({ success: true, message: 'Profile updated successfully' })
};

const LoadingSpinner = () => (
  <div className="p-8 text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
    <p className="mt-2 text-gray-600">Memuat data...</p>
  </div>
);

const InputField = ({ label, type = "text", value, onChange, placeholder, icon: Icon, showPassword, onTogglePassword }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-indigo-500">
      {Icon && <Icon size={18} className="text-gray-400 mr-2" />}
      <input
        type={showPassword ? "text" : type}
        className="bg-transparent outline-none w-full"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {type === "password" && onTogglePassword && (
        <button type="button" onClick={onTogglePassword} className="text-gray-400 hover:text-gray-600">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);

const Button = ({ type = "button", onClick, disabled, variant = "primary", children, className = "" }) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white",
    success: "bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "text-red-600 hover:text-red-900"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`py-2 px-1 border-b-2 font-medium text-sm ${
      active
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <Icon className="inline mr-2" size={16} />
    {children}
  </button>
);

// Hooks
const useAsync = (asyncFn, deps = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};

const useForm = (initialState) => {
  const [values, setValues] = useState(initialState);
  
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const reset = () => setValues(initialState);
  
  return { values, setValue, reset, setValues };
};

const SettingsPage = ({ userRole, userName, onLogout }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('kasir');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const userId = 1; // This should come from props or context

  const { loading: usersLoading, execute: loadUsers } = useAsync(apiService.getUsers);
  const { loading: actionLoading, execute: executeAction } = useAsync();

  const profileForm = useForm({
    username: userName,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const addUserForm = useForm({
    nama: '', // Added nama field
    username: '',
    password: '',
    role: 'kasir'
  });

  const editUserForm = useForm({
    username: '',
    password: '',
    role: 'kasir'
  });

  const handleLoadUsers = async () => {
    try {
      const response = await loadUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      alert('Gagal memuat data pengguna');
    }
  };
  
  const validateProfileForm = () => {
    const { newPassword, confirmPassword, currentPassword } = profileForm.values;
    
    if (newPassword && newPassword !== confirmPassword) {
      alert('Password baru tidak cocok!');
      return false;
    }
    
    if (newPassword && !currentPassword) {
      alert('Masukkan password saat ini untuk mengubah password!');
      return false;
    }
    
    return true;
  };

  const handleProfileUpdate = async () => {
    if (!validateProfileForm()) return;

    try {
      const response = await executeAction(apiService.updateProfile, {
        id: userId,
        ...profileForm.values
      });

      if (response.success) {
        alert('Profil berhasil diperbarui!');
        profileForm.setValues(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        alert('Gagal memperbarui profil!');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat memperbarui profil');
    }
  };

  const handleAddUser = async () => {
    const { nama, username, password, role } = addUserForm.values;

    if (!nama || !username || !password) {
      alert('Nama Lengkap, Username, dan Password harus diisi!');
      return;
    }

    try {
      // Menyiapkan data sesuai format API yang dibutuhkan
      const userData = {
        nama: nama,
        username: username,
        password: password,
        role: role
      };

      // Memanggil API addUser dari Api.js, bukan dari apiService
      const response = await addUser(userData);
      
      if (response.success) {
        alert('Akun berhasil ditambahkan!');
        addUserForm.reset();
        setShowAddForm(false);
        handleLoadUsers();
      } else {
        alert(`Gagal menambahkan akun: ${response.message || 'Terjadi kesalahan tidak diketahui.'}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Terjadi kesalahan saat menambahkan akun: ${error.response.data.message}`);
      } else {
        alert('Terjadi kesalahan saat menambahkan akun. Silakan coba lagi.');
      }
    }
  };

  const handleEditUser = async () => {
    if (!editUserForm.values.username) {
      alert('Username harus diisi!');
      return;
    }

    try {
      const response = await executeAction(apiService.updateUser, {
        id: editingUser.id,
        ...editUserForm.values
      });
      
      if (response.success) {
        alert('Akun berhasil diperbarui!');
        cancelEdit();
        handleLoadUsers();
      } else {
        alert('Gagal memperbarui akun!');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat memperbarui akun');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === userId) {
      alert('Tidak dapat menghapus akun sendiri!');
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun "${user.username}"?`)) {
      return;
    }

    try {
      const response = await deleteUser(user.id);
      if (response.success) {
        alert('Akun berhasil dihapus!');
        handleLoadUsers();
      } else {
        alert('Gagal menghapus akun!');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus akun');
    }
  };

  const startEditUser = (user) => {
    setEditingUser(user);
    editUserForm.setValues({
      username: user.username,
      password: '',
      role: user.role
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    editUserForm.reset();
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

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

  // Load users when switching to users tab
  React.useEffect(() => {
    if (activeTab === 'users' && userRole === 'owner') {
      handleLoadUsers();
    }
  }, [activeTab, userRole]);

  const renderProfileTab = () => (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Pengaturan Profil</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Username"
            value={profileForm.values.username}
            onChange={(e) => profileForm.setValue('username', e.target.value)}
            icon={User}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
              <Shield size={18} className="text-gray-400 mr-2" />
              <span className="text-gray-600 capitalize">{userRole}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ubah Password</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Password Saat Ini"
              type="password"
              value={profileForm.values.currentPassword}
              onChange={(e) => profileForm.setValue('currentPassword', e.target.value)}
              placeholder="Password saat ini"
              icon={Lock}
              showPassword={showPassword.current}
              onTogglePassword={() => togglePasswordVisibility('current')}
            />
            <InputField
              label="Password Baru"
              type="password"
              value={profileForm.values.newPassword}
              onChange={(e) => profileForm.setValue('newPassword', e.target.value)}
              placeholder="Password baru"
              icon={Lock}
              showPassword={showPassword.new}
              onTogglePassword={() => togglePasswordVisibility('new')}
            />
            <InputField
              label="Konfirmasi Password"
              type="password"
              value={profileForm.values.confirmPassword}
              onChange={(e) => profileForm.setValue('confirmPassword', e.target.value)}
              placeholder="Konfirmasi password"
              icon={Lock}
              showPassword={showPassword.confirm}
              onTogglePassword={() => togglePasswordVisibility('confirm')}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleProfileUpdate}
            disabled={actionLoading}
            className="px-6"
          >
            <Save size={16} className="mr-2" />
            {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAddUserForm = () => (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Tambah Pengguna Baru</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Nama Lengkap" // New field for nama
          value={addUserForm.values.nama}
          onChange={(e) => addUserForm.setValue('nama', e.target.value)}
          placeholder="Nama Lengkap"
          icon={User}
        />
        <InputField
          label="Username"
          value={addUserForm.values.username}
          onChange={(e) => addUserForm.setValue('username', e.target.value)}
          placeholder="Username"
          icon={User}
        />
        <InputField
          label="Password"
          type="password"
          value={addUserForm.values.password}
          onChange={(e) => addUserForm.setValue('password', e.target.value)}
          placeholder="Password"
          icon={Lock}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ring-indigo-500"
            value={addUserForm.values.role}
            onChange={(e) => addUserForm.setValue('role', e.target.value)}
          >
            <option value="kasir">Kasir</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={handleAddUser}
          disabled={actionLoading}
          variant="success"
        >
          {actionLoading ? 'Menambahkan...' : 'Tambah'}
        </Button>
        <Button
          onClick={() => setShowAddForm(false)}
          variant="secondary"
        >
          Batal
        </Button>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Kelola Pengguna</h2>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus size={16} className="mr-2" />
            Tambah Pengguna
          </Button>
        </div>

        {showAddForm && renderAddUserForm()}
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {usersLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 text-sm"
                          value={editUserForm.values.username}
                          onChange={(e) => editUserForm.setValue('username', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {user.username}
                            {user.id === userId && <span className="text-xs text-indigo-600 ml-2">(Anda)</span>}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={editUserForm.values.role}
                          onChange={(e) => editUserForm.setValue('role', e.target.value)}
                        >
                          <option value="kasir">Kasir</option>
                          <option value="owner">Owner</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'owner' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      {editingUser?.id === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleEditUser}
                            className="text-green-600 hover:text-green-900"
                            title="Simpan"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                            title="Batal"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          {user.id !== userId && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

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
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="text-indigo-600 mr-3" size={32} />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
                    <p className="text-gray-600">Kelola akun dan preferensi aplikasi</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Masuk sebagai</p>
                  <p className="font-medium text-gray-900">{userName} ({userRole})</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <TabButton
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                    icon={User}
                  >
                    Profil Saya
                  </TabButton>
                  {userRole === 'owner' && (
                    <TabButton
                      active={activeTab === 'users'}
                      onClick={() => setActiveTab('users')}
                      icon={UserPlus}
                    >
                      Kelola Pengguna
                    </TabButton>
                  )}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'users' && userRole === 'owner' && renderUsersTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;