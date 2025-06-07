import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ClipboardList, User, Coffee, TrendingUp, ShoppingCart, Package, ReceiptText, LineChart, MapPin, Phone, Clock } from 'lucide-react';
import { Menu as MenuIcon, ChevronLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { mockTopProducts, transactionHistory, businessInfo } from '../data/DummyData';

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

  const ownerCards = [
    {
      // Menggunakan gambar logo yang diimpor
      icon: <img src={transactionIcon} alt="Transaksi Icon" className="w-6 h-6 border-2 border-white rounded-md" />, 
      title: "Transaksi",
      desc: "Catat dan kelola transaksi harian",
      path: "/transactions",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      // Menggunakan gambar logo yang diimpor
      icon: <img src={historyIcon} alt="Riwayat Icon" className="w-6 h-6 border-2 border-white rounded-md" />,
      title: "Riwayat",
      desc: "Lihat riwayat transaksi",
      path: "/history",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      // Menggunakan gambar logo yang diimpor
      icon: <img src={cookMenuIcon} alt="Menu Icon" className="w-6 h-6 border-2 border-white rounded-md" />,
      title: "Menu",
      desc: "Kelola daftar produk",
      path: "/menu",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      // Menggunakan gambar logo yang diimpor
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

  const todayMetrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactionHistory.transactions.filter(
      transaction => transaction.date.includes(today)
    );

    const todayRevenue = todayTransactions.reduce((sum, transaction) => {
      const total = parseFloat(transaction.total.replace('Rp ', '').replace('.', '').replace(',', ''));
      return sum + (isNaN(total) ? 0 : total);
    }, 0);

    const bestSellingProduct = mockTopProducts[0];

    return {
      revenue: todayRevenue > 0 ? `Rp ${todayRevenue.toLocaleString('id-ID')}` : 'Rp 1.250.000',
      transactions: todayTransactions.length || 24,
      bestSeller: bestSellingProduct?.name || 'Es Teh Manis',
      bestSellerCount: 15
    };
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
    if (!isSidebarCollapsed) {
        toggleSidebar(); 
    }
  };

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
        setActiveTab={() => {}}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Tombol Hamburger/Menu di luar Sidebar, di level teratas dan selalu di depan */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'left-4 bg-indigo-700' : 'left-68 bg-indigo-800'}`}
      >
        {isSidebarCollapsed ? <MenuIcon size={24} /> : <ChevronLeft size={24} />}
      </button>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-64'}`}>
        {/* Header/Navbar di dalam konten utama */}
        <div className="bg-white shadow-md p-4 flex items-center justify-end z-30">
          <div className="flex items-center space-x-3 bg-gray-100 p-2 rounded-lg">
            <User className="text-gray-500" size={20} />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{userName}</p>
              <p className="text-xs text-gray-500 uppercase">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Konten Dashboard (di bawah header) */}
        <div className="flex-1 p-6 overflow-y-auto pt-16 lg:pt-4"> 
          <div className="flex justify-between items-center mb-8 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard {businessInfo.name}</h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-500 text-sm">Pendapatan Hari Ini</p>
                <CreditCard className="text-blue-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{todayMetrics.revenue}</p>
              <p className="text-green-500 text-sm mt-1">+12% dari kemarin</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-500 text-sm">Transaksi Hari Ini</p>
                <ClipboardList className="text-green-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{todayMetrics.transactions}</p>
              <p className="text-green-500 text-sm mt-1">+3 dari kemarin</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-500 text-sm">Produk Terlaris</p>
                <Coffee className="text-purple-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{todayMetrics.bestSeller}</p>
              <p className="text-blue-500 text-sm mt-1">Terjual {todayMetrics.bestSellerCount}x hari ini</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(userRole === 'owner' ? ownerCards : cashierCards).map((card, index) => (
              <div 
                key={index}
                onClick={() => handleCardClick(card.path)}
                className={`${card.bgColor} rounded-xl p-5 text-white cursor-pointer transition-all hover:shadow-xl hover:scale-105 group`}
              >
                <div className="flex items-center space-x-4">
                  {/* === PERUBAHAN DI SINI === */}
                  {/* Gunakan gambar logo dengan border putih */}
                  <div className="p-2 rounded-lg bg-white bg-opacity-20 group-hover:rotate-6 transition-transform flex items-center justify-center">
                    {card.icon} {/* card.icon sekarang adalah tag <img> */}
                  </div>
                  {/* ======================= */}
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