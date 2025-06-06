import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { DollarSign, TrendingUp, Package, Award, Calendar, ArrowUpRight, Menu, ChevronLeft } from 'lucide-react'; // Pastikan Menu dan ChevronLeft diimpor di sini

// Import fungsi API
import { getReports } from '../data/Api';

const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-gray-500">
        Tidak ada data grafik.
      </div>
    );
  }
  const max = Math.max(...data.map(item => item.value));
  const safeMax = max === 0 ? 1 : max;

  return (
    <div className="h-36 flex items-end space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-green-500 hover:bg-green-600 transition-all rounded-t-sm"
            style={{ height: `${(item.value / safeMax) * 100}%` }}
          ></div>
          <div className="text-xs mt-1 text-gray-600 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const ProgressBar = ({ value, max, label, color = "bg-green-500" }) => {
  const safeMax = max === 0 ? 1 : max;
  const percentage = (value / safeMax) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const Reports = ({ userName, userRole, onLogout }) => {
  const [period, setPeriod] = useState('');
  const [selectedView, setSelectedView] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default tersembunyi
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getReports();
        console.log("Fetched reports data:", data);

        if (data && Array.isArray(data.monthlyReports)) {
          setMonthlyData(data.monthlyReports);
          if (data.monthlyReports.length > 0) {
            setPeriod(data.monthlyReports[data.monthlyReports.length - 1].month);
          }
        } else {
            console.warn("API response does not contain 'monthlyReports' array as expected.", data);
            setMonthlyData([]);
        }

        if (data && Array.isArray(data.topProducts)) {
            setTopProducts(data.topProducts);
        } else {
            console.warn("API response does not contain 'topProducts' array as expected.", data);
            setTopProducts([]);
        }

      } catch (err) {
        console.error('Failed to fetch reports:', err);
        if (err.message && err.message.includes('Unauthorized')) {
          setError('Sesi Anda telah berakhir atau Anda tidak memiliki otorisasi. Silakan login kembali.');
          // onLogout(); // Bisa dipanggil di sini jika ingin otomatis redirect
        } else {
          setError('Gagal mengambil data laporan: ' + (err.message || 'Terjadi kesalahan tidak dikenal.'));
        }
        setMonthlyData([]);
        setTopProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsData();
  }, [onLogout]);

  const currentMonthData = monthlyData.find(m => m.month === period) || { month: '', revenue: 0, orders: 0, avgOrder: 0 };
  const currentMonthIndex = monthlyData.findIndex(m => m.month === period);
  const prevMonthData = monthlyData[currentMonthIndex - 1] || { month: '', revenue: 0, orders: 0, avgOrder: 0 };

  const revenueChange = prevMonthData.revenue !== 0 ? ((currentMonthData.revenue - prevMonthData.revenue) / prevMonthData.revenue) * 100 : 0;
  const ordersChange = prevMonthData.orders !== 0 ? ((currentMonthData.orders - prevMonthData.orders) / prevMonthData.orders) * 100 : 0;

  const revenueChartData = monthlyData.map(month => ({
    label: month.month.substring(0, 3),
    value: month.revenue / 1000000
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Memuat laporan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 text-red-700 text-xl p-4 text-center">
        {error}
      </div>
    );
  }

  const renderProductsSection = () => {
    if (topProducts.length === 0) {
        return <div className="text-center text-gray-500 py-8">Tidak ada data produk terlaris.</div>;
    }
    const maxSold = topProducts.length > 0 ? topProducts[0].sold : 1;

    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Produk Terlaris Bulan Ini</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terjual</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Perbandingan Penjualan Produk</h3>
          {topProducts.map((product, index) => (
            <ProgressBar
              key={index}
              label={product.name}
              value={product.sold}
              max={maxSold}
              color={index === 0 ? "bg-green-500" : "bg-blue-400"}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTrendsSection = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trend Pendapatan Bulanan</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700">Pendapatan (dalam juta)</h4>
          </div>
          <SimpleBarChart data={revenueChartData} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-md font-medium text-gray-700 mb-4">Pertumbuhan Bulanan</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Pendapatan</span>
                  <span className={revenueChange >= 0 ? "text-green-600" : "text-red-600"}>
                    {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${revenueChange >= 0 ? "bg-green-500" : "bg-red-500"} h-2 rounded-full`}
                    style={{ width: `${Math.min(Math.abs(revenueChange), 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Jumlah Order</span>
                  <span className={ordersChange >= 0 ? "text-green-600" : "text-red-600"}>
                    {ordersChange >= 0 ? "+" : ""}{ordersChange.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${ordersChange >= 0 ? "bg-green-500" : "bg-red-500"} h-2 rounded-full`}
                    style={{ width: `${Math.min(Math.abs(ordersChange), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-md font-medium text-gray-700 mb-4">Rata-rata Order</h4>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {formatCurrency(currentMonthData.avgOrder)}
                </div>
                <div className="text-sm text-gray-500 mt-2">per transaksi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewSection = () => {
    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div className={`flex items-center ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <ArrowUpRight size={16} className={revenueChange < 0 ? 'transform rotate-90' : ''} />
                <span className="text-sm font-medium">{Math.abs(revenueChange).toFixed(1)}%</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Total Pendapatan</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(currentMonthData.revenue)}</p>
            <p className="text-sm text-gray-500 mt-2">vs {formatCurrency(prevMonthData.revenue)} bulan lalu</p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package size={24} className="text-blue-600" />
              </div>
              <div className={`flex items-center ${ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <ArrowUpRight size={16} className={ordersChange < 0 ? 'transform rotate-90' : ''} />
                <span className="text-sm font-medium">{Math.abs(ordersChange).toFixed(1)}%</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Total Order</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{currentMonthData.orders}</p>
            <p className="text-sm text-gray-500 mt-2">vs {prevMonthData.orders} bulan lalu</p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Award size={24} className="text-amber-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Produk Terlaris</h3>
            {topProducts.length > 0 ? (
                <>
                    <p className="text-xl font-bold text-gray-900 mt-1">{topProducts[0].name}</p>
                    <p className="text-sm text-gray-500 mt-2">{topProducts[0].sold} penjualan</p>
                </>
            ) : (
                <p className="text-sm text-gray-500 mt-2">Tidak ada data produk.</p>
            )}
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Rata-rata Order</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(currentMonthData.avgOrder)}</p>
            <p className="text-sm text-gray-500 mt-2">per transaksi</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pendapatan Bulanan</h3>
          <SimpleBarChart data={revenueChartData} />
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Produk Terlaris</h3>
            <button
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() => setSelectedView('products')}
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.slice(0, 3).map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md mr-3">
                    <span className="font-medium text-gray-700">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.sold} terjual</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
            {topProducts.length === 0 && (
                <div className="text-center text-gray-500">Tidak ada data produk terlaris.</div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {userRole === 'owner' ? (
        // Membungkus seluruh layout laporan dengan flex container
        <div className="relative flex min-h-screen">
          {/* Overlay untuk saat sidebar terbuka di mobile */}
          {!isSidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" // z-40 agar di atas konten, di bawah sidebar
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Sidebar Component */}
          <Sidebar
            userRole={userRole}
            userName={userName}
            onLogout={onLogout}
            activeTab="reports"
            setActiveTab={() => {}}
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />

          {/* Main Content Area */}
          {/* Pastikan main content memiliki z-index yang lebih rendah dari sidebar tetapi lebih tinggi dari overlay */}
          <div className={`flex-1 p-6 transition-all duration-300 ease-in-out z-30 ${isSidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-64'}`}>
            {/* Tombol Hamburger/Menu di luar Sidebar, sekarang di dalam flex-1 */}
            <button
              onClick={toggleSidebar}
              className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
                ${isSidebarCollapsed ? 'left-4 bg-indigo-700' : 'left-68 bg-indigo-800'}`}
            >
              {isSidebarCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
            </button>

            {/* Konten utama halaman */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 pt-16"> {/* Mengurangi padding di sini jika sudah ada di div luar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    <span className="text-green-600">Laporan</span> Penjualan Bulanan
                  </h2>
                  <p className="text-gray-600">
                    Menampilkan total pendapatan dan produk terlaris per bulan.
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                  <div className="relative">
                    <select
                      className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      {monthlyData.map(month => (
                        <option key={month.month} value={month.month}>{month.month}</option>
                      ))}
                      {monthlyData.length === 0 && <option value="">Tidak ada bulan</option>}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <Calendar size={16} />
                    </div>
                  </div>

                  <button
                    className={`px-3 py-2 rounded-md transition-colors ${compareMode ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setCompareMode(!compareMode)}
                  >
                    Compare
                  </button>
                </div>
              </div>

              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`px-4 py-2 font-medium text-sm ${selectedView === 'overview' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setSelectedView('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${selectedView === 'products' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setSelectedView('products')}
                >
                  Produk Terlaris
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${selectedView === 'trends' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setSelectedView('trends')}
                >
                  Trend Penjualan
                </button>
              </div>

              {selectedView === 'overview' && renderOverviewSection()}
              {selectedView === 'products' && renderProductsSection()}
              {selectedView === 'trends' && renderTrendsSection()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-xl text-red-500">
          Anda tidak memiliki akses untuk melihat laporan ini.
        </div>
      )}
    </>
  );
};

export default Reports;