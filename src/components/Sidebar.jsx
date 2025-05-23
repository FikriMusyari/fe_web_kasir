import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Utensils,
  BarChart,
  LogOut,
  History,
  ChevronLeft,
  Menu,
  User,
  UserPlus
} from 'lucide-react';

const Sidebar = ({ userRole, userName, onLogout, activeTab, setActiveTab, isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
      roles: ['admin', 'kasir']
    },
    {
      id: 'transactions',
      label: 'Transaksi',
      path: '/transactions',
      icon: <ShoppingCart size={20} />,
      roles: ['admin', 'kasir']
    },
    {
      id: 'history',
      label: 'Riwayat',
      path: '/history',
      icon: <History size={20} />,
      roles: ['admin', 'kasir']
    },
    {
      id: 'menu',
      label: 'Kelola Menu',
      path: '/menu',
      icon: <Utensils size={20} />,
      roles: ['admin', 'kasir']
    },
    {
      id: 'reports',
      label: 'Laporan',
      path: '/reports',
      icon: <BarChart size={20} />,
      roles: ['admin']
    },
    {
      id: 'add-account',
      label: 'Tambah Akun',
      path: '/add-account',
      icon: <UserPlus size={20} />,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
  };

  const currentTab = activeTab || location.pathname.split('/')[1];

  return (
    <div
      className={`bg-indigo-700 text-white h-screen flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } fixed top-0 left-0 bottom-0`}
    >
      <div className="flex justify-end p-2">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-indigo-600 transition-colors text-white"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="p-4 flex flex-col h-full overflow-y-auto">
        {!isCollapsed ? (
          <>
            <h2 className="text-2xl font-bold mb-1 text-white">Warung Sekre</h2>
            <div className="text-indigo-200 mb-6 text-sm">
              {userRole === 'admin' ? 'Administrator' : 'Kasir'} - {userName || 'User'}
            </div>
          </>
        ) : (
          <div className="flex justify-center mb-6">
            <div className="text-2xl font-bold text-white">WS</div>
          </div>
        )}

        <nav className="flex-grow">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id, item.path)}
                  className={`flex items-center w-full ${
                    isCollapsed ? 'justify-center px-2' : 'px-4'
                  } py-2 rounded-md transition-colors ${
                    currentTab === item.id
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className={isCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                  {!isCollapsed && <span className="text-white">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`mt-auto ${isCollapsed ? 'border-t border-indigo-600 pt-2' : ''}`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {userName || (userRole === 'admin' ? 'Admin' : 'Kasir')}
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
            </>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
