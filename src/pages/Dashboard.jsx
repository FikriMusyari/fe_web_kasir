import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ClipboardList, User, Coffee, TrendingUp, ShoppingCart, Package, ReceiptText, LineChart, MapPin, Phone, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { mockTopProducts, transactionHistory, businessInfo } from '../data/DummyData';

const Dashboard = ({ userRole, userName, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.split('/')[1] || 'dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const adminCards = [
    {
      icon: <ShoppingCart className="text-white" size={24} />,
      title: "Transaksi",
      desc: "Catat dan kelola transaksi harian",
      path: "/transactions",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      icon: <ReceiptText className="text-white" size={24} />,
      title: "Riwayat",
      desc: "Lihat riwayat transaksi",
      path: "/history",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      icon: <Package className="text-white" size={24} />,
      title: "Menu",
      desc: "Kelola daftar produk",
      path: "/menu",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      icon: <LineChart className="text-white" size={24} />,
      title: "Laporan",
      desc: "Analisis penjualan",
      path: "/reports",
      bgColor: "bg-gradient-to-r from-red-500 to-red-600"
    }
  ];

  const cashierCards = adminCards.filter(card => 
    ['Transaksi', 'Riwayat'].includes(card.title)
  );

  const todayMetrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactionHistory.transactions.filter(
      transaction => transaction.date.includes(today)
    );

    const todayRevenue = todayTransactions.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.total.replace('Rp ', '').replace('.', ''));
    }, 0);

    const bestSellingProduct = mockTopProducts[0];

    return {
      revenue: todayRevenue > 0 ? `Rp ${todayRevenue.toLocaleString('id-ID')}` : 'Rp 1.250.000',
      transactions: todayTransactions.length || 24,
      bestSeller: bestSellingProduct.name || 'Es Teh Manis',
      bestSellerCount: 15
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`relative ${sidebarCollapsed ? 'w-20' : 'w-14'} transition-all duration-300 ease-in-out`}>
        <Sidebar 
          userRole={userRole} 
          userName={userName} 
          onLogout={onLogout} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
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
              <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
                <User className="text-gray-500" size={28} />
                <div>
                  <p className="font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500 uppercase">{userRole}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-6 text-white mb-8 shadow-lg">
              <div className="flex items-center space-x-4">
                <TrendingUp size={40} className="text-white" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Sistem Manajemen Warung Cerdas</h2>
                  <p className="max-w-2xl">
                    {userRole === 'admin' 
                      ? 'Kelola seluruh operasional warung Anda dengan mudah dan efisien.'
                      : 'Proses transaksi dengan cepat dan akurat.'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 bg-white/10 rounded-xl p-4">
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
              {(userRole === 'admin' ? adminCards : cashierCards).map((card, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setActiveTab(card.path.split('/')[1]);
                    navigate(card.path);
                  }}
                  className={`${card.bgColor} rounded-xl p-5 text-white cursor-pointer transition-all hover:shadow-xl hover:scale-105 group`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-white bg-opacity-20 group-hover:rotate-6 transition-transform">
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
        )}
      </main>
    </div>
  );
};

export default Dashboard;