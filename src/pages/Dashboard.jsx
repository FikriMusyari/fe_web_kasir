import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, TrendingUp, MapPin, Phone, Clock } from 'lucide-react';
import { Menu as MenuIcon, ChevronLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { businessInfo } from '../data/DummyData';

// --- Impor gambar logo ---
import cookMenuIcon from '../icons/cook-menu.png';
import historyIcon from '../icons/history.png';
import reportsIcon from '../icons/reports.png';
import transactionIcon from '../icons/transaction.png';
// ------------------------

const Dashboard = ({ userRole, userName, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  // Quick action cards (tetap statis)
  const ownerCards = [
    {
      icon: <img src={transactionIcon} alt="Transaksi Icon" className="w-6 h-6 border-2 border-white rounded-md" />,
      title: "Transaksi",
      desc: "Catat dan kelola transaksi harian",
      path: "/transactions",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      icon: <img src={historyIcon} alt="Riwayat Icon" className="w-6 h-6 border-2 border-white rounded-md" />,
      title: "Riwayat",
      desc: "Lihat riwayat transaksi",
      path: "/history",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      icon: <img src={cookMenuIcon} alt="Menu Icon" className="w-6 h-6 border-2 border-white rounded-md" />,
      title: "Menu",
      desc: "Kelola daftar produk",
      path: "/menu",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      icon: <img src={reportsIcon} alt="Laporan Icon" className="w-6 h-6 border-2 border-white rounded-md" />,
      title: "Laporan",
      desc: "Analisis penjualan",
      path: "/reports",
      bgColor: "bg-gradient-to-r from-red-500 to-red-600"
    }
  ];

  const cashierCards = ownerCards.filter(card =>
    ['Transaksi', 'Riwayat'].includes(card.title)
  );

  const businessInfo = {
    name: "Warung Sekre",
    address: "SEKRE HIMATIF, GB FASTE",
    phone: "0812-3456-7890",
    operatingHours: { days: "Senin-Jumat", open: "08:00", close: "20:00" }
  };


  const handleCardClick = (path) => {
    navigate(path);
    if (!isSidebarCollapsed) {
      toggleSidebar();
    }
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative flex min-h-screen bg-gray-100">
      {/* Overlay untuk saat sidebar terbuka di mobile */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Component */}
      <Sidebar
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={() => { }}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Tombol Hamburger/Menu - Tetap di posisi tetap */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'left-4 bg-indigo-700' : 'left-68 bg-indigo-800'}`}
      >
        {isSidebarCollapsed ? <MenuIcon size={24} /> : <ChevronLeft size={24} />}
      </button>

      {/* Main Content Area */}
      {/* pt-16 is now applied to main, pushing content down for fixed hamburger button */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-0' : 'ml-64'} pt-16 lg:pt-8`}>
        {/* Header Section (Now scrolls with content, similar to Menu/Reports page headers) */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mx-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          {/* Dashboard Title and Date */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-1">Dashboard {businessInfo.name}</h1>
            <p className="text-gray-600 text-sm">{currentDate}</p>
          </div>

          {/* User Info with border and improved styling */}
          <div className="flex items-center mt-4 sm:mt-0 bg-indigo-50 px-4 py-2 rounded-full text-indigo-800 font-semibold text-sm shadow-inner">
            <User className="w-5 h-5 mr-2" />
            <span>{userName}</span>
            <span className="ml-2 text-indigo-600 capitalize">({userRole})</span>
          </div>
        </div>

        {/* Konten Dashboard (di bawah header) */}
        {/* No extra pt needed here, as the header is part of the flow and has mb-8 */}
        <div className="flex-1 p-6 overflow-y-auto pt-0">

          {/* Business Info Card (tetap ada) */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-center space-x-4">
              <TrendingUp size={40} className="text-white" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Sistem Manajemen Warung Cerdas</h2>
                <p className="max-w-2xl">
                  {userRole === 'owner'
                    ? 'Kelola seluruh operasional warung Anda dengan mudah dan efisien.'
                    : 'Proses transaksi dengan cepat dan akurat.'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 bg-white/10 rounded-xl p-4 mt-6">
              <div className="flex items-center space-x-3">
                <MapPin className="text-white" size={24} />
                <div>
                  <p className="text-sm text-white/80">Alamat</p>
                  <p className="font-semibold">{businessInfo.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-white" size={24} />
                <div>
                  <p className="text-sm text-white/80">Kontak</p>
                  <p className="font-semibold">{businessInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-white" size={24} />
                <div>
                  <p className="text-sm text-white/80">Jam Buka</p>
                  <p className="font-semibold">{businessInfo.operatingHours.days}, {businessInfo.operatingHours.open} - {businessInfo.operatingHours.close}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(userRole === 'owner' ? ownerCards : cashierCards).map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(card.path)}
                className={`${card.bgColor} rounded-xl p-5 text-white cursor-pointer transition-all hover:shadow-xl hover:scale-105 group`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-white bg-opacity-20 group-hover:rotate-6 transition-transform flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{card.title}</h3>
                    <p className="text-sm opacity-90">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;