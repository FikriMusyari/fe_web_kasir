import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Utensils, BarChart, Settings, LogOut, History } from 'lucide-react';

const Sidebar = ({ userRole, userName, onLogout, activeTab, setActiveTab }) => {
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
      roles: ['admin']
    },
    {
      id: 'reports',
      label: 'Laporan',
      path: '/reports',
      icon: <BarChart size={20} />,
      roles: ['admin']
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      path: '/settings',
      icon: <Settings size={20} />,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(userRole)
  );

  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
  };

  const currentTab = activeTab || location.pathname.split('/')[1] || 'dashboard';

  return (
    <div className="w-64 bg-indigo-700 text-white h-screen flex flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-1">Warung Sekre</h2>
        <div className="text-indigo-200 mb-6 text-sm">
          {userRole === 'admin' ? 'Administrator' : 'Kasir'} - {userName}
        </div>
        
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
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-indigo-600">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-lg font-bold">{userName?.charAt(0) || (userRole === 'admin' ? 'A' : 'K')}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{userName || (userRole === 'admin' ? 'Admin' : 'Kasir')}</p>
            <p className="text-xs text-indigo-300">Online</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-indigo-100 hover:bg-indigo-800 rounded-md transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Keluar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;