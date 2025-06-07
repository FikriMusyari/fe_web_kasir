import React from 'react';
import { User, Edit3, Save, X, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../common/CommonComponents';

const UserTable = ({ 
  users, 
  loading, 
  currentUserId,
  editingUser,
  editFormData,
  onEditFormChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteUser
}) => {
  if (loading) {
    return <LoadingSpinner message="Memuat data pengguna..." />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-lg font-medium">Tidak ada pengguna</p>
        <p>Belum ada pengguna yang terdaftar</p>
      </div>
    );
  }

  return (
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
                    className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editFormData.username}
                    onChange={(e) => onEditFormChange('username', e.target.value)}
                    placeholder="Username"
                  />
                ) : (
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {user.username}
                      {user.id === currentUserId && (
                        <span className="text-xs text-indigo-600 ml-2">(Anda)</span>
                      )}
                    </span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUser?.id === user.id ? (
                  <select
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editFormData.role}
                    onChange={(e) => onEditFormChange('role', e.target.value)}
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
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                {editingUser?.id === user.id ? (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onSaveEdit(user.id)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Simpan"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                      title="Batal"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onStartEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
  );
};

export default UserTable;
