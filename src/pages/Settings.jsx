import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Header = ({ title, userRole, onLogout }) => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center">
        <span className="text-sm text-gray-600 mr-4">
          {userRole === 'admin' ? 'Administrator' : 'Kasir'}
        </span>
      </div>
    </header>
  );
};

const SettingsPage = ({ userRole, onLogout }) => {
  const [generalSettings, setGeneralSettings] = useState({
    restaurantName: 'Warung Sekre',
    address: 'Jl. UWINNNNN',
    phone: '0812-3456-7890',
    email: 'contact@warungsekre.com',
    taxPercentage: 10
  });

  const [printerSettings, setPrinterSettings] = useState({
    receiptPrinter: 'EPSON TM-T82COBA"',
    kitchenPrinter: 'EPSON TM-T88V (ak ngayal y)',
    autoPrint: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupLocation: 'cloud'
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrinterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrinterSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBackupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBackupSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} activeMenu="settings" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" userRole={userRole} onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">System Settings</h2>
            
            <form onSubmit={handleSaveSettings}>
              <div className="mb-8">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={generalSettings.restaurantName}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={generalSettings.phone}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={generalSettings.email}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="taxPercentage"
                      value={generalSettings.taxPercentage}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">Printer Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Receipt Printer
                    </label>
                    <select
                      name="receiptPrinter"
                      value={printerSettings.receiptPrinter}
                      onChange={handlePrinterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="EPSON TM-T82">EPSON TM-T82</option>
                      <option value="EPSON TM-T88V">EPSON TM-T88V</option>
                      <option value="Star TSP100">Star TSP100</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kitchen Printer
                    </label>
                    <select
                      name="kitchenPrinter"
                      value={printerSettings.kitchenPrinter}
                      onChange={handlePrinterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="EPSON TM-T82">EPSON TM-T82</option>
                      <option value="EPSON TM-T88V">EPSON TM-T88V</option>
                      <option value="Star TSP100">Star TSP100</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoPrint"
                      name="autoPrint"
                      checked={printerSettings.autoPrint}
                      onChange={handlePrinterChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="autoPrint" className="ml-2 block text-sm text-gray-700">
                      Automatically print receipt after payment
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">Backup & Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      name="autoBackup"
                      checked={backupSettings.autoBackup}
                      onChange={handleBackupChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
                      Enable automatic backup
                    </label>
                  </div>
                  
                  {backupSettings.autoBackup && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Backup Frequency
                        </label>
                        <select
                          name="backupFrequency"
                          value={backupSettings.backupFrequency}
                          onChange={handleBackupChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Backup Location
                        </label>
                        <select
                          name="backupLocation"
                          value={backupSettings.backupLocation}
                          onChange={handleBackupChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="local">Local Storage</option>
                          <option value="cloud">Cloud Storage</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div className="md:col-span-2 mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => alert('Manual backup initiated!')}
                    >
                      Backup Now
                    </button>
                    <button
                      type="button"
                      className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to restore from the latest backup? This will overwrite current data.')) {
                          alert('Restore from backup initiated!');
                        }
                      }}
                    >
                      Restore from Backup
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;