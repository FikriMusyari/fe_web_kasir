import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '../common/CommonComponents';
import useForm from '../../hooks/useForm';
import AddUserForm from './AddUserForm';
import UserTable from './UserTable';
import { addUser, updateUser, deleteUser, getAllUsers } from '../../data/Api';

const UserManagement = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  const addUserForm = useForm({
    nama: '',
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
    setUsersLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data.data || response.data || []);

    } catch (error) {
      alert('Gagal memuat data pengguna');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const userData = {
        nama: addUserForm.values.nama,
        username: addUserForm.values.username,
        password: addUserForm.values.password,
        role: addUserForm.values.role
      };

      const response = await addUser(userData);

      if (response.success) {
        alert('Akun berhasil ditambahkan!');
        addUserForm.reset();
        setShowAddForm(false);
        handleLoadUsers();
      } else {
        alert(`Gagal menambahkan akun: ${response.error || 'Terjadi kesalahan tidak diketahui.'}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        alert(`Terjadi kesalahan saat menambahkan akun: ${error.response.data.errors}`);
      } else {
        alert('Terjadi kesalahan saat menambahkan akun. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {

    try {
      const payload = {
      nama: editUserForm.values.username,
      oldPassword: editUserForm.values.currentPassword || '', // Gunakan currentPassword dari form
      newPassword: editUserForm.values.newPassword || ''
    };

      const response = await updateUser(payload);
    
      if (response.success) {
        alert('Akun berhasil diperbarui!');
        cancelEdit();
        handleLoadUsers();
      } else {
        alert(`Gagal memperbarui akun: ${response.error || 'Terjadi kesalahan tidak diketahui.'}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors || 'Terjadi kesalahan saat memperbarui akun';
      alert(errorMessage);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUserId) {
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
        alert(`Gagal menghapus akun: ${response.error || 'Terjadi kesalahan tidak diketahui.'}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors || 'Terjadi kesalahan saat menghapus akun';
      alert(errorMessage);
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

  // Load users on component mount
  useEffect(() => {
    handleLoadUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Kelola Pengguna</h2>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus size={16} className="mr-2" />
            Tambah Pengguna
          </Button>
        </div>

        {showAddForm && (
          <AddUserForm
            formData={addUserForm.values}
            onFormChange={addUserForm.setValue}
            onSubmit={handleAddUser}
            onCancel={() => setShowAddForm(false)}
            loading={loading}
          />
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <UserTable
          users={users}
          loading={usersLoading}
          currentUserId={currentUserId}
          editingUser={editingUser}
          editFormData={editUserForm.values}
          onEditFormChange={editUserForm.setValue}
          onStartEdit={startEditUser}
          onSaveEdit={handleEditUser}
          onCancelEdit={cancelEdit}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default UserManagement;
