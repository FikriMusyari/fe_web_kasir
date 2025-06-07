import React from 'react';
import { User, Lock } from 'lucide-react';
import { InputField, Button } from '../common/CommonComponents';

const AddUserForm = ({ 
  formData, 
  onFormChange, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { nama, username, password } = formData;
    
    if (!nama || !username || !password) {
      alert('Nama Lengkap, Username, dan Password harus diisi!');
      return;
    }
    
    onSubmit();
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Pengguna Baru</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            label="Nama Lengkap"
            value={formData.nama}
            onChange={(e) => onFormChange('nama', e.target.value)}
            placeholder="Nama Lengkap"
            icon={User}
          />
          <InputField
            label="Username"
            value={formData.username}
            onChange={(e) => onFormChange('username', e.target.value)}
            placeholder="Username"
            icon={User}
          />
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => onFormChange('password', e.target.value)}
            placeholder="Password"
            icon={Lock}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ring-indigo-500"
              value={formData.role}
              onChange={(e) => onFormChange('role', e.target.value)}
            >
              <option value="kasir">Kasir</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={loading}
            variant="success"
          >
            {loading ? 'Menambahkan...' : 'Tambah'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
