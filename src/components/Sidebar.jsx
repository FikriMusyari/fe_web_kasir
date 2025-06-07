import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Utensils,
  BarChart,
  LogOut,
  History,
  // --- Hapus ChevronLeft dan Menu dari import ini ---
  User,
  UserPlus
} from 'lucide-react';

const Sidebar = ({ userRole, userName, onLogout, activeTab, setActiveTab, isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
      roles: ['owner', 'kasir']
    },
    {
      id: 'transactions',
      label: 'Transaksi',
      path: '/transactions',
      icon: <ShoppingCart size={20} />,
      roles: ['owner', 'kasir']
    },
    {
      id: 'history',
      label: 'Riwayat',
      path: '/history',
      icon: <History size={20} />,
      roles: ['owner', 'kasir']
    },
    {
      id: 'menu',
      label: 'Kelola Menu',
      path: '/menu',
      icon: <Utensils size={20} />,
      roles: ['owner', 'kasir']
    },
    {
      id: 'reports',
      label: 'Laporan',
      path: '/reports',
      icon: <BarChart size={20} />,
      roles: ['owner']
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      path: '/settings',
      icon: <UserPlus size={20} />,
      roles: ['owner', 'kasir']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
    // Jika sidebar sedang terbuka (tidak collapsed), tutup setelah navigasi
    // Ini penting jika Anda menggunakan sidebar overlay di mobile
    if (!isCollapsed) {
        toggleSidebar(); 
    }
  };

  const currentTab = activeTab || location.pathname.split('/')[1];

  return (
    // Sidebar itu sendiri - ini akan diatur posisinya oleh App.jsx
    <div
      className={`bg-indigo-700 text-white h-screen flex flex-col transition-all duration-300 ease-in-out z-50
        fixed top-0 left-0 bottom-0
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'} `} // Menggunakan translate-x untuk hide/show
      style={{ width: '256px' }} // Lebar sidebar tetap
    >
      {/* --- Hapus div yang berisi tombol toggle sidebar di sini --- */}
      {/* <div className="flex justify-end p-2">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-indigo-600 transition-colors text-white"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div> */}
      {/* --- Ganti dengan placeholder atau kosongkan --- */}
      <div className="flex justify-end p-2">
         {/* Ini bisa diisi logo kecil atau kosong jika sidebar tidak collapsed */}
         {/* Misalnya: {isCollapsed && <div className="text-xl font-bold text-white">WS</div>} */}
      </div>

      <div className="p-4 flex flex-col h-full overflow-y-auto">
        {/* Konten atas sidebar: logo/nama aplikasi & info user */}
        {/* Tidak perlu lagi kondisi isCollapsed di sini karena sidebar akan selalu penuh saat dibuka */}
        <>
          <h2 className="text-2xl font-bold mb-1 text-white">Warung Sekre</h2>
          <div className="text-indigo-200 mb-6 text-sm">
            {userRole === 'owner' ? 'Owner' : 'Kasir'} - {userName || 'User'}
          </div>
        </>
        {/* Bagian ini dihapus karena sidebar akan selalu full saat dibuka */}
        {/* } : (
          <div className="flex justify-center mb-6">
            <div className="text-2xl font-bold text-white">WS</div>
          </div>
        ) */}

        <nav className="flex-grow">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id, item.path)}
                  className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                    currentTab === item.id
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                  title={item.label} // Tambahkan title untuk aksesibilitas
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-white">{item.label}</span> {/* Label selalu terlihat */}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bagian Profil dan Logout */}
        {/* Bagian ini juga tidak perlu kondisi isCollapsed karena sidebar akan selalu penuh saat dibuka */}
        <div className="mt-auto border-t border-indigo-600 pt-2">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {userName || (userRole === 'owner' ? 'Owner' : 'Kasir')}
              </p>
              <p className="text-xs text-indigo-300">Online</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-indigo-100 hover:bg-indigo-800 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className="text-white">Keluar</span>
          </button>
        </div>
        {/* Bagian ini dihapus karena sidebar akan selalu full saat dibuka */}
        {/* } : (
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center mb-2 text-white">
              <User size={16} />
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-indigo-100 hover:bg-indigo-800 rounded-md transition-colors"
              title="Keluar"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) */}
      </div>
    </div>
  );
};

export default Sidebar;