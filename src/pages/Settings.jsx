import React, { useState } from 'react';
import { User, UserPlus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SettingsHeader from '../components/settings/SettingsHeader';
import ProfileSettings from '../components/settings/ProfileSettings';
import UserManagement from '../components/settings/UserManagement';
import { TabButton } from '../components/common/CommonComponents';

// Clean Settings Page - All components moved to separate files

const SettingsPage = ({ userRole, userName, onLogout }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userId = 1; // This should come from props or context



  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Clean Settings Page - All logic moved to separate components

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <SettingsHeader userName={userName} userRole={userRole} />

            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
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

                </nav>
              </div>
            </div>

            {/* Tab Content */}
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
  );
};

export default SettingsPage;