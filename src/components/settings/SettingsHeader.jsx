import { Settings } from 'lucide-react';

const SettingsHeader = ({ userName, userRole }) => {
  return (
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
  );
};

export default SettingsHeader;
