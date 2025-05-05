import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Download, ArrowUpDown, ChevronDown, Eye, CreditCard, ShoppingBag, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const mockTransactions = [
  {
    id: 'TRX-001',
    date: '2025-05-01',
    time: '14:30',
    customer: 'PIKRI',
    items: 5,
    total: 124500,
    status: 'completed',
    payment: 'Credit Card'
  },
  {
    id: 'TRX-002',
    date: '2025-05-01',
    time: '16:15',
    customer: 'DILACNTI',
    items: 2,
    total: 57000,
    status: 'completed',
    payment: 'Cash'
  },
  {
    id: 'TRX-003',
    date: '2025-05-02',
    time: '10:45',
    customer: 'ALUP',
    items: 3,
    total: 85000,
    status: 'pending',
    payment: 'Bank Transfer'
  },
  {
    id: 'TRX-005',
    date: '2025-05-03',
    time: '09:15',
    customer: 'ALUP3',
    items: 7,
    total: 195000,
    status: 'cancelled',
    payment: 'Credit Card'
  },
  {
    id: 'TRX-006',
    date: '2025-05-03',
    time: '11:30',
    customer: 'DILE',
    items: 4,
    total: 110000,
    status: 'processing',
    payment: 'Bank Transfer'
  },
  {
    id: 'TRX-008',
    date: '2025-05-04',
    time: '17:20',
    customer: 'PIKRIIII',
    items: 2,
    total: 64000,
    status: 'completed',
    payment: 'Digital Wallet'
  }
];

const StatusBadge = ({ status }) => {
  const statusStyles = {
    completed: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: <CheckCircle size={14} className="mr-1 text-green-600" />
    },
    pending: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: <Clock size={14} className="mr-1 text-yellow-600" />
    },
    processing: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: <CreditCard size={14} className="mr-1 text-blue-600" />
    },
    cancelled: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: <AlertCircle size={14} className="mr-1 text-red-600" />
    }
  };
  
  const style = statusStyles[status] || statusStyles.pending;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bgColor} ${style.textColor}`}>
      {style.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const paymentMethods = ['all', 'Credit Card', 'Cash', 'Bank Transfer', 'Digital Wallet'];
  
  const statusOptions = ['all', 'completed', 'pending', 'processing', 'cancelled'];
  
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    averageValue: 0,
    completedRate: 0
  });
  
  useEffect(() => {
    const completed = transactions.filter(tx => tx.status === 'completed').length;
    const total = transactions.reduce((sum, tx) => sum + tx.total, 0);
    
    setStats({
      totalTransactions: transactions.length,
      totalRevenue: total,
      averageValue: total / (transactions.length || 1),
      completedRate: (completed / transactions.length) * 100 || 0
    });
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [transactions]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDateChange = (field, value) => {
    setDateRange({
      ...dateRange,
      [field]: value
    });
  };
  
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };
  
  const handlePaymentChange = (payment) => {
    setPaymentFilter(payment);
    setIsFilterOpen(false);
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const txDate = new Date(tx.date);
      const matchesStartDate = !dateRange.start || txDate >= new Date(dateRange.start);
      const matchesEndDate = !dateRange.end || txDate <= new Date(dateRange.end);
      
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      
      const matchesPayment = paymentFilter === 'all' || tx.payment === paymentFilter;
      
      return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        comparison = dateA - dateB;
      } else if (sortField === 'customer') {
        comparison = a.customer.localeCompare(b.customer);
      } else if (sortField === 'total') {
        comparison = a.total - b.total;
      } else if (sortField === 'items') {
        comparison = a.items - b.items;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              <span className="text-indigo-600">Riwayat</span> Transaksi
            </h2>
            <p className="text-gray-600">
              Semua transaksi yang telah dilakukan tercatat di sini.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md flex items-center transition-all duration-300 hover:bg-indigo-200">
              <Download size={18} className="mr-2" />
              Unduh Laporan
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
            <p className="text-xs font-medium text-blue-600 uppercase mb-1">Tingkat Penyelesaian</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.completedRate.toFixed(1)}%</h3>
          </div>
        </div>
        
        <div className="mb-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari ID transaksi atau pelanggan..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="w-40">
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-40">
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between w-full lg:w-40 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-300"
            >
              <div className="flex items-center">
                <Filter size={18} className="mr-2 text-indigo-500" />
                <span>Filter</span>
              </div>
              <ChevronDown size={18} className={`transition-transform duration-300 ${isFilterOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isFilterOpen && (
              <div className="absolute z-10 mt-2 w-56 right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <div className="space-y-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`block w-full text-left px-3 py-2 rounded-md ${statusFilter === status ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                      >
                        {status === 'all' ? 'Semua Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</h3>
                  <div className="space-y-2">
                    {paymentMethods.map(payment => (
                      <button
                        key={payment}
                        onClick={() => handlePaymentChange(payment)}
                        className={`block w-full text-left px-3 py-2 rounded-md ${paymentFilter === payment ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                      >
                        {payment === 'all' ? 'Semua Metode' : payment}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada transaksi yang sesuai dengan kriteria pencarian.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setDateRange({ start: '', end: '' });
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
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
                      onClick={() => handleSort('customer')}
                    >
                      <div className="flex items-center">
                        <span>Pelanggan</span>
                        {sortField === 'customer' && (
                          <ArrowUpDown size={16} className={`ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('items')}
                    >
                      <div className="flex items-center">
                        <span>Item</span>
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
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction, index) => (
                    <tr 
                      key={transaction.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{new Date(transaction.date).toLocaleDateString('id-ID')}</div>
                        <div className="text-gray-500">{transaction.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.payment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50">
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
    </div>
  );
};

export default Transactions;