import React, { useState } from 'react';
import { User, UserPlus, Settings } from 'lucide-react'; // Added Settings icon for the header
import { Menu as MenuIcon, ChevronLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SettingsHeader from '../components/settings/SettingsHeader';
import ProfileSettings from '../components/settings/ProfileSettings';
import UserManagement from '../components/settings/UserManagement';
import { TabButton } from '../components/common/CommonComponents';

const SettingsPage = ({ userRole, userName, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const userId = 1; // This should come from props or context

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50"> {/* Changed background to a subtle gradient */}
      {/* Overlay for when sidebar is open on mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <Sidebar
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        activeTab="settings" // Ensure 'settings' tab is highlighted in sidebar
        setActiveTab={() => {}} // No need to change sidebar active tab from here
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Tombol Hamburger/Menu di luar Sidebar, di level teratas dan selalu di depan */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
          ${isCollapsed ? 'left-4 bg-indigo-700 hover:bg-indigo-800 shadow-md' : 'left-68 bg-indigo-800 hover:bg-indigo-900 shadow-lg'}`}
      >
        {isCollapsed ? <MenuIcon size={24} /> : <ChevronLeft size={24} />}
      </button>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'} pt-16 lg:pt-8`}>
        <div className="min-h-screen p-6"> {/* Removed bg-gray-50 here as it's now on the main div */}
          <div className="max-w-6xl mx-auto">
            {/* Header Section for Settings Page */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                        <Settings className="h-9 w-9 text-purple-700" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Pengaturan Akun & Aplikasi</h1>
                        <p className="text-gray-600 text-sm">Kelola profil Anda atau atur akses pengguna lainnya.</p>
                    </div>
                </div>
                {/* User Info (consistent with other pages) */}
                <div className="flex items-center mt-4 sm:mt-0 bg-indigo-50 px-4 py-2 rounded-full text-indigo-800 font-semibold text-sm shadow-inner">
                    <User className="w-5 h-5 mr-2" />
                    <span>{userName}</span>
                    <span className="ml-2 text-indigo-600 capitalize">({userRole})</span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex space-x-1 border border-gray-100"> {/* Styled tab container */}
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
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px] border border-gray-100"> {/* Styled content container */}
              {activeTab === 'profile' && (
                <ProfileSettings userName={userName} userRole={userRole} />
              )}
              {activeTab === 'users' && userRole === 'owner' && (
                <UserManagement currentUserId={userId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;