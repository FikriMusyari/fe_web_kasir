import React, { useState } from 'react';
import { User, Shield, Lock, Save } from 'lucide-react';
import { InputField, Button } from '../common/CommonComponents';
import useForm from '../../hooks/useForm';
import { updateUser } from '../../data/Api';

const ProfileSettings = ({ userName, userRole }) => {
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);

  const profileForm = useForm({
    username: userName,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validateProfileForm = () => {
    const { newPassword, confirmPassword, oldPassword } = profileForm.values;
    
    if (newPassword && newPassword !== confirmPassword) {
      alert('Password baru tidak cocok!');
      return false;
    }
    
    if (newPassword && !oldPassword) {
      alert('Masukkan password saat ini untuk mengubah password!');
      return false;
    }
    
    return true;
  };

  const handleProfileUpdate = async () => {
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      const payload = {
        oldPassword: profileForm.values.oldPassword,
        newPassword: profileForm.values.newPassword
      };

      if (profileForm.values.username !== userName) {
        payload.nama = profileForm.values.username;
      }

      const response = await updateUser(payload);

      if (response.success) {
        alert('Profil berhasil diperbarui!');
        profileForm.setValues(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        alert(`Gagal memperbarui profil: ${response.error || 'Terjadi kesalahan tidak diketahui.'}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors || 'Terjadi kesalahan saat memperbarui profil';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
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
              value={profileForm.values.oldPassword}
              onChange={(e) => profileForm.setValue('oldPassword', e.target.value)}
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
            disabled={loading}
            className="px-6"
          >
            <Save size={16} className="mr-2" />
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
