import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import { Plus, Search, Edit, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { searchProduct, getProducts, getTransactions } from '../data/Api.js'; 

const TransactionPage = ({ userRole, userName, onLogout }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [cashPaid, setCashPaid] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchLoading] = useState(false);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('transaksi'); 

  const fetchProduct = async () => {
  try {
    const response = await getProducts();
    setMenuItems(response.data);
  } catch (error) {
    console.error('Gagal mengambil data produk:', error);
  } finally {
    setLoading(false)
  }
};

useEffect(() => {
  fetchProduct();
}, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim() === '') {
        fetchProduct();
      } else {
        const result = await searchProduct(searchTerm);
        if (result) {
          setMenu(result.data);
        } else {
          setMenu([]);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  const addToCart = (item) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
        subtotal: (updatedItems[existingItemIndex].quantity + 1) * item.price
      };
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          quantity: 1,
          subtotal: item.price
        }
      ]);
    }
  };

  const updateQuantity = (itemId, amount) => {
    const updatedItems = selectedItems.marolerolerestp(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + amount;
        if (newQuantity < 1) return null;
        
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.price
        };
      }
      return item;
    }).filter(Boolean);
    
    setSelectedItems(updatedItems);
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const total = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);

  const processTransaction = async () => {
    if (selectedItems.length === 0) {
      alert('Silakan tambahkan item ke transaksi');
      return;
    }
    
    if (paymentMethod === 'Cash') {
      const cashPaidNum = parseFloat(cashPaid);
      if (isNaN(cashPaidNum) || cashPaidNum < total) {
        alert('Jumlah uang tunai tidak mencukupi');
        return;
      }
    }
    
    const transaction = {
      customer: customerName || 'Pelanggan Umum',
      items: selectedItems,
      total,
      paymentMethod,
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    try {
      const response = await fetch('https://api-kantin-hono.up.railway.app/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(transaction)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Transaction saved:', result);
      alert('Transaksi berhasil disimpan!');
      
      setSelectedItems([]);
      setCustomerName('');
      setPaymentMethod('Cash');
      setShowCustomerInfo(false);
      setCashPaid('');
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('Gagal menyimpan transaksi. Silakan coba lagi.');
    }
  };

  const calculateChange = () => {
    const cashPaidNum = parseFloat(cashPaid);
    return cashPaidNum - total;
  };

  // Function to refresh transactions (can be called from admin section)
  const refreshTransactions = async () => {
    try {
      const transactions = await getTransactions();
      console.log('Current transactions:', transactions);
      // You can use this data to show recent transactions or for admin purposes
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar 
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className={`flex-1 p-6 ml-${isSidebarCollapsed ? '20' : '64'}`}>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Buat Transaksi Baru</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </div>
                )}
              </div>
              
              <h2 className="font-semibold text-gray-700 mb-3">Menu</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Memuat menu...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{searchTerm ? 'Tidak ada menu yang ditemukan' : 'Belum ada menu tersedia'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {menuItems.map(item => (
                    <div 
                      key={item.id}
                      className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => addToCart(item)}
                    >
                      <h3 className="font-medium text-gray-800">{item.nama}</h3>
                      <p className="text-sm text-gray-500">{item.kategori}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-indigo-600">
                          {item.harga_jual}
                        </span>
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <h2 className="font-semibold text-gray-700 mb-4 flex justify-between">
                <span>Detail Transaksi</span>
                <button 
                  onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                >
                  {showCustomerInfo ? 'Sembunyikan Info' : 'Tambah Info Pelanggan'}
                </button>
              </h2>
              
              {showCustomerInfo && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Nama Pelanggan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
              
              {selectedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada item yang dipilih</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <p className="font-medium text-gray-800">{item.nama}</p>
                        <p className="text-sm text-gray-500">
                          {item.harga_jual}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-green-500 hover:text-green-700 transition-colors"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mt-4">                  
                <div className="flex justify-between mb-4"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-indigo-700">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(total)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Cash">Tunai</option>
                    <option value="Bank Transfer">Transfer Bank</option>
                  </select>
                </div>
                
                {paymentMethod === 'Cash' && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Jumlah Uang Tunai
                    </label>
                    <input
                      type="number"
                      placeholder="Masukkan jumlah uang tunai"
                      value={cashPaid}
                      onChange={(e) => setCashPaid(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {cashPaid && parseFloat(cashPaid) >= total && (
                      <div className="mt-2 text-sm text-green-600">
                        <span>Kembalian: </span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(calculateChange())}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={processTransaction}
                  disabled={selectedItems.length === 0 || (paymentMethod === 'Cash' && (parseFloat(cashPaid) < total || isNaN(parseFloat(cashPaid))))}
                  className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                    selectedItems.length === 0 || (paymentMethod === 'Cash' && (parseFloat(cashPaid) < total || isNaN(parseFloat(cashPaid))))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 transition-colors'
                  }`}
                >
                  Proses Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;