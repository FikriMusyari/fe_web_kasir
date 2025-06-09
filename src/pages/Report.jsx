import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { DollarSign, TrendingUp, Package, Award, Calendar, ArrowUpRight, Menu, ChevronLeft, BarChart2, PieChart } from 'lucide-react';
import { getReports } from '../data/Api';

// Helper function to parse currency strings to numbers
const parseCurrencyToNumber = (currencyString) => {
  if (typeof currencyString === 'number') return currencyString;
  if (typeof currencyString === 'string') {
    const cleaned = currencyString.replace(/Rp\.?\s?/g, '').replace(/\./g, '').replace(/,/g, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

const SimpleBarChart = ({ data, title, valueSuffix = '' }) => {
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
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h4 className="text-md font-medium text-gray-700 mb-4">{title}</h4>
      <div className="h-36 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group relative">
            <div
              className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-md cursor-pointer"
              style={{ height: `${(item.value / safeMax) * 100}%` }}
            ></div>
            <div className="text-xs mt-1 text-gray-600 font-medium">{item.label}</div>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap">
              {item.label}: {item.value.toLocaleString()} {valueSuffix}
            </div>
          </div>
        ))}
      </div>
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

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [reportsData, setReportsData] = useState([]); // Stores the raw API response
  const [monthlyAggregatedData, setMonthlyAggregatedData] = useState([]); // Aggregated for charts/overview
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    if (typeof amount === 'string' && amount.startsWith('Rp')) {
      return amount; // Already formatted
    }
    const numAmount = parseCurrencyToNumber(amount);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numAmount);
  };

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Langsung asumsikan respons dari getReports() adalah array data yang Anda berikan
        // Jika getReports() membungkus array ini dalam objek seperti { data: [...] },
        // Anda perlu menyesuaikannya kembali ke `const data = response.data || [];`
        const data = await getReports();
        console.log("Fetched raw reports data:", data);

        if (Array.isArray(data)) {
          setReportsData(data);

          const aggregated = data.reduce((acc, report) => {
            const reportDate = new Date(report.tahun, report.bulan - 1, 1);
            const monthYearKey = `${reportDate.getFullYear()}-${report.bulan.toString().padStart(2, '0')}`;
            const monthLabel = reportDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

            if (!acc[monthYearKey]) {
              acc[monthYearKey] = {
                month: monthLabel,
                revenue: 0,
                expenses: 0,
                orders: 0,
                avgOrder: 0,
                totalOrderValueSum: 0,
                // Mengubah productsSold menjadi struktur untuk melacak produk terlaris
                // berdasarkan frekuensi kemunculan 'produk_terlaris_id'
                topProductsTracker: {}, 
              };
            }

            acc[monthYearKey].revenue += parseCurrencyToNumber(report.total_pendapatan);
            acc[monthYearKey].expenses += parseCurrencyToNumber(report.total_pengeluaran);
            acc[monthYearKey].orders++; 
            acc[monthYearKey].totalOrderValueSum += parseCurrencyToNumber(report.total_pendapatan);

            // LOGIKA BARU UNTUK PRODUK TERLARIS
            if (report.produk && report.produk.nama) {
                const productId = report.produk.id;
                const productName = report.produk.nama;
                const productPrice = parseCurrencyToNumber(report.produk.harga_jual);

                if (!acc[monthYearKey].topProductsTracker[productId]) {
                    acc[monthYearKey].topProductsTracker[productId] = {
                        id: productId,
                        name: productName,
                        sold: 0,
                        revenue: 0
                    };
                }
                acc[monthYearKey].topProductsTracker[productId].sold += 1; // Menghitung setiap kali produk ini muncul
                acc[monthYearKey].topProductsTracker[productId].revenue += productPrice;
            }

            return acc;
          }, {});

          const sortedMonthlyData = Object.keys(aggregated)
            .sort()
            .map(key => {
              const monthData = aggregated[key];
              monthData.avgOrder = monthData.orders > 0 ? monthData.totalOrderValueSum / monthData.orders : 0;
              // Mengubah topProductsTracker menjadi array dan mengurutkannya
              monthData.topProducts = Object.values(monthData.topProductsTracker).sort((a, b) => b.sold - a.sold);
              return monthData;
            });

          setMonthlyAggregatedData(sortedMonthlyData);

          if (sortedMonthlyData.length > 0) {
            setPeriod(sortedMonthlyData[sortedMonthlyData.length - 1].month); 
          }

        } else {
          console.warn("API response is not an array. Received:", data); // Perbarui pesan warning
          setReportsData([]);
          setMonthlyAggregatedData([]);
        }

      } catch (err) {
        console.error('Failed to fetch reports:', err);
        if (err.message && err.message.includes('Unauthorized')) {
          setError('Sesi Anda telah berakhir atau Anda tidak memiliki otorisasi. Silakan login kembali.');
        } else {
          setError('Gagal mengambil data laporan: ' + (err.message || 'Terjadi kesalahan tidak dikenal.'));
        }
        setReportsData([]);
        setMonthlyAggregatedData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsData();
  }, [onLogout]);

  const currentMonthData = monthlyAggregatedData.find(m => m.month === period) || { month: '', revenue: 0, expenses: 0, orders: 0, avgOrder: 0, topProducts: [] };
  const currentMonthIndex = monthlyAggregatedData.findIndex(m => m.month === period);
  const prevMonthData = monthlyAggregatedData[currentMonthIndex - 1] || { month: '', revenue: 0, expenses: 0, orders: 0, avgOrder: 0, topProducts: [] };


  const calculateChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  const revenueChange = calculateChange(currentMonthData.revenue, prevMonthData.revenue);
  const ordersChange = calculateChange(currentMonthData.orders, prevMonthData.orders);
  const expensesChange = calculateChange(currentMonthData.expenses, prevMonthData.expenses);


  const revenueChartData = monthlyAggregatedData.map(month => ({
    label: month.month.split(' ')[0].substring(0, 3),
    value: month.revenue
  }));

  const expenseChartData = monthlyAggregatedData.map(month => ({
    label: month.month.split(' ')[0].substring(0, 3),
    value: month.expenses
  }));


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Memuat laporan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-700 text-xl p-6 text-center rounded-lg shadow-md m-4">
        <p>{error}</p>
      </div>
    );
  }

  const renderProductsSection = () => {
    if (currentMonthData.topProducts.length === 0) {
      return <div className="text-center text-gray-500 py-8 bg-white rounded-xl shadow-sm px-6">Tidak ada data produk terlaris untuk bulan ini.</div>;
    }
    const maxSold = currentMonthData.topProducts.length > 0 ? currentMonthData.topProducts[0].sold : 1;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Produk Terlaris Bulan Ini ({currentMonthData.month})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terjual</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMonthData.topProducts.map((product, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Perbandingan Penjualan Produk</h3>
          {currentMonthData.topProducts.map((product, index) => (
            <ProgressBar
              key={index}
              label={product.name}
              value={product.sold}
              max={maxSold}
              color={index === 0 ? "bg-indigo-500" : index === 1 ? "bg-purple-400" : "bg-blue-400"}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTrendsSection = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart data={revenueChartData} title="Trend Pendapatan Bulanan (Rp)" valueSuffix="Rupiah" />
        <SimpleBarChart data={expenseChartData} title="Trend Pengeluaran Bulanan (Rp)" valueSuffix="Rupiah" />

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Pertumbuhan Metrics</h4>
          <div className="space-y-4">
            {/* Revenue Change */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pendapatan</span>
                <span className={`flex items-center font-bold ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange >= 0 && <ArrowUpRight size={18} className="mr-1" />}
                  {revenueChange < 0 && <ArrowUpRight size={18} className="mr-1 transform rotate-90" />}
                  {revenueChange.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${revenueChange >= 0 ? "bg-green-500" : "bg-red-500"} h-2 rounded-full`}
                  style={{ width: `${Math.min(Math.abs(revenueChange), 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Orders Change */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Jumlah Order</span>
                <span className={`flex items-center font-bold ${ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ordersChange >= 0 && <ArrowUpRight size={18} className="mr-1" />}
                  {ordersChange < 0 && <ArrowUpRight size={18} className="mr-1 transform rotate-90" />}
                  {ordersChange.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${ordersChange >= 0 ? "bg-green-500" : "bg-red-500"} h-2 rounded-full`}
                  style={{ width: `${Math.min(Math.abs(ordersChange), 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Expenses Change */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pengeluaran</span>
                <span className={`flex items-center font-bold ${expensesChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {/* Arrow up if expenses increased (bad), down if decreased (good) */}
                  {expensesChange > 0 && <ArrowUpRight size={18} className="mr-1" />}
                  {expensesChange <= 0 && <ArrowUpRight size={18} className="mr-1 transform rotate-180" />}
                  {expensesChange.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${expensesChange <= 0 ? "bg-green-500" : "bg-red-500"} h-2 rounded-full`}
                  style={{ width: `${Math.min(Math.abs(expensesChange), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Rata-rata Nilai Order</h4>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-700">
                {formatCurrency(currentMonthData.avgOrder)}
              </div>
              <div className="text-sm text-gray-500 mt-2">per transaksi</div>
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
              <div className="bg-red-100 p-3 rounded-lg">
                <DollarSign size={24} className="text-red-600" />
              </div>
              <div className={`flex items-center ${expensesChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <ArrowUpRight size={16} className={expensesChange > 0 ? '' : 'transform rotate-180'} />
                <span className="text-sm font-medium">{Math.abs(expensesChange).toFixed(1)}%</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Total Pengeluaran</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(currentMonthData.expenses)}</p>
            <p className="text-sm text-gray-500 mt-2">vs {formatCurrency(prevMonthData.expenses)} bulan lalu</p>
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
            {currentMonthData.topProducts.length > 0 ? (
                <>
                    <p className="text-xl font-bold text-gray-900 mt-1">{currentMonthData.topProducts[0].name}</p>
                    <p className="text-sm text-gray-500 mt-2">{currentMonthData.topProducts[0].sold} penjualan</p>
                </>
            ) : (
                <p className="text-sm text-gray-500 mt-2">Tidak ada data produk.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pendapatan Bulanan</h3>
          <SimpleBarChart data={revenueChartData} title="Pendapatan (Rp)" valueSuffix="Rupiah" />
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Produk Terlaris (Ringkasan)</h3>
            <button
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() => setSelectedView('products')}
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {currentMonthData.topProducts.slice(0, 3).map((product, index) => (
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
            {currentMonthData.topProducts.length === 0 && (
                <div className="text-center text-gray-500">Tidak ada data produk terlaris untuk bulan ini.</div>
            )}
          </div>
        </div>
      </>
    );
  };


  return (
    <>
      {userRole === 'owner' ? (
        <div className="relative flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          {!isSidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={toggleSidebar}
            ></div>
          )}

          <Sidebar
            userRole={userRole}
            userName={userName}
            onLogout={onLogout}
            activeTab="reports"
            setActiveTab={() => {}}
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
          />

          <div className={`flex-1 p-6 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-0' : 'ml-64'} pt-16 lg:pt-8`}>
            <button
              onClick={toggleSidebar}
              className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
                ${isSidebarCollapsed ? 'left-4 bg-indigo-700 hover:bg-indigo-800 shadow-md' : 'left-68 bg-indigo-800 hover:bg-indigo-900 shadow-lg'}`}
            >
              {isSidebarCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <BarChart2 className="h-9 w-9 text-green-700" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Laporan Penjualan</h1>
                  <p className="text-gray-600 text-sm">Analisis kinerja bisnis Anda.</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    {monthlyAggregatedData.map(month => (
                      <option key={month.month} value={month.month}>{month.month}</option>
                    ))}
                    {monthlyAggregatedData.length === 0 && <option value="">Tidak ada bulan</option>}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Calendar size={16} />
                  </div>
                </div>

                <button
                  className={`px-4 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-sm
                    ${compareMode ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setCompareMode(!compareMode)}
                  title="Toggle compare mode with previous month"
                >
                  <TrendingUp size={18} className="mr-2" />
                  Bandingkan
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex space-x-1 border border-gray-100">
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors
                  ${selectedView === 'overview' ? 'bg-green-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSelectedView('overview')}
              >
                Overview
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors
                  ${selectedView === 'products' ? 'bg-green-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSelectedView('products')}
              >
                Produk Terlaris
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors
                  ${selectedView === 'trends' ? 'bg-green-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
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
      ) : (
        <div className="flex justify-center items-center h-screen text-xl text-red-500 bg-gray-100">
          Anda tidak memiliki akses untuk melihat laporan ini.
        </div>
      )}
    </>
  );
};

export default Reports;