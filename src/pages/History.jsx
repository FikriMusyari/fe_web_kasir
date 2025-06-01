import React, { useState, useEffect } from 'react';
import { History, Search, Calendar, ChevronDown, ArrowUpDown, ShoppingBag } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const mockTransactions = [
  { 
    id: 'TRX-001',
    date: '2025-05-01T14:30:00', 
    items: [
      { name: 'Nasi Goreng', quantity: 2, price: 15000 },
      { name: 'Es Teh', quantity: 3, price: 5000 }
    ],
    itemCount: 5,
    total: 124500,
    cashier: 'Budi Kasir',
    paymentMethod: 'Credit Card'
  },
];
const TransactionHistory = ({ userRole, userName, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    averageValue: 0
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTransactions(mockTransactions);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const total = transactions.reduce((sum, tx) => sum + tx.total, 0);
    
    setStats({
      totalTransactions: transactions.length,
      totalRevenue: total,
      averageValue: total / (transactions.length || 1)
    });
  }, [transactions]);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleViewDetails = (transactionId) => {
    console.log(`View details for transaction ${transactionId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cashier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date();
      const transactionDate = new Date(transaction.date);
      
      if (dateFilter === 'today') {
        matchesDate = 
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = transactionDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        matchesDate = transactionDate >= monthAgo;
      }
    }
    
    const txDate = new Date(transaction.date);
    const matchesStartDate = !dateRange.start || txDate >= new Date(dateRange.start);
    const matchesEndDate = !dateRange.end || txDate <= new Date(dateRange.end);
    
    return matchesSearch && matchesDate && matchesStartDate && matchesEndDate;
  }).sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      comparison = dateA - dateB;
    } else if (sortField === 'total') {
      comparison = a.total - b.total;
    } else if (sortField === 'items') {
      comparison = a.itemCount - b.itemCount;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        userRole={userRole} 
        userName={userName} 
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <History className="h-6 w-6 text-indigo-600" />
                <h1 className="ml-2 text-2xl font-semibold text-gray-800">
                  <span className="text-indigo-600">Riwayat</span> Transaksi
                </h1>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg shadow-sm">
              <p className="text-xs font-medium text-indigo-600 uppercase mb-1">Total Transaksi</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalTransactions}</h3>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg shadow-sm">
              <p className="text-xs font-medium text-emerald-600 uppercase mb-1">Total Pendapatan</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm">
              <p className="text-xs font-medium text-amber-600 uppercase mb-1">Rata-rata Transaksi</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(stats.averageValue)}</h3>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari ID transaksi, kasir..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="w-32 md:w-40">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm appearance-none"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option value="all">Semua Waktu</option>
                      <option value="today">Hari Ini</option>
                      <option value="week">Minggu Ini</option>
                      <option value="month">Bulan Ini</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
                  <p className="mt-2 text-gray-500">Memuat data...</p>
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-lg font-medium">Tidak ada transaksi ditemukan</p>
                <p>Coba ubah filter pencarian atau buat transaksi baru</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setDateRange({ start: '', end: '' });
                    setDateFilter('all');
                  }}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 px-6 pt-4">
                  <p className="text-gray-600">
                    Menampilkan <span className="font-medium">{filteredTransactions.length}</span> dari <span className="font-medium">{transactions.length}</span> transaksi
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center">
                            <span>Tanggal & Waktu</span>
                            {sortField === 'date' && (
                              <ArrowUpDown size={16} className={`ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID Transaksi
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('items')}
                        >
                          <div className="flex items-center">
                            <span>Items</span>
                            {sortField === 'items' && (
                              <ArrowUpDown size={16} className={`ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('total')}
                        >
                          <div className="flex items-center">
                            <span>Total</span>
                            {sortField === 'total' && (
                              <ArrowUpDown size={16} className={`ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kasir
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pembayaran
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction, index) => (
                        <tr key={transaction.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                            {transaction.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.itemCount || transaction.items.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(transaction.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.cashier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewDetails(transaction.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransactionHistory;