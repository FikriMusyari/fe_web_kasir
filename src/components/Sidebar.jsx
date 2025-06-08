import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Utensils,
  BarChart,
  LogOut,
  History,
  User,
  UserPlus
} from 'lucide-react';

const Sidebar = ({ userRole, userName, onLogout, activeTab, setActiveTab, isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!isCollapsed) {
      toggleSidebar();
    }
  };

  const getCurrentTab = () => {
    if (activeTab) return activeTab;
    const pathname = location.pathname;
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/transactions') return 'transactions';
    if (pathname === '/history') return 'history';
    if (pathname === '/menu') return 'menu';
    if (pathname === '/reports') return 'reports';
    if (pathname === '/settings') return 'settings';
    return 'dashboard';
  };

  const currentTab = getCurrentTab();

  return (
    <div
      className={`bg-indigo-700 text-white h-screen flex flex-col transition-all duration-300 ease-in-out z-50
        fixed top-0 left-0 bottom-0
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'} `}
      style={{ width: '256px' }}
    >
      <div className="flex justify-end p-2">
      </div>

      <div className="p-4 flex flex-col h-full overflow-y-auto">
        <>
          <h2 className="text-3xl font-bold mb-1 text-white" style={{ fontFamily: '"Chewy", cursive' }}>Warung Sekre</h2>
          
          {/* Pembatas Baru */}
          <div className="border-b border-indigo-600 my-4"></div> {/* Garis pembatas */}

          <div className="text-indigo-200 mb-6 text-sm">
            {userRole === 'owner' ? 'Owner' : 'Kasir'} - {userName || 'User'}
          </div>
        </>

        <nav className="flex-grow">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id, item.path)}
                  className={`flex items-center w-full px-4 py-2 rounded-md transition-colors
                    ${currentTab === item.id
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                    }`}
                  title={item.label}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-white">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profil Pengguna yang Lebih Menonjol */}
        <div className="mt-auto border-t border-indigo-600 pt-2 bg-indigo-800 bg-opacity-20 rounded-md p-4">
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
            className="flex items-center w-full px-4 py-2 text-indigo-100 hover:bg-indigo-800 hover:text-white rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className="text-white">Keluar</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;