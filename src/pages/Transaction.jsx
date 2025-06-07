import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import { Plus, Search, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { searchProduct, getProducts, buatTransaksi } from '../data/Api.js';

const TransactionPage = ({ userRole, userName, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [cashPaid, setCashPaid] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

  
  const parseHargaToNumber = (hargaString) => {
    if (typeof hargaString === 'number') return hargaString;
    if (typeof hargaString === 'string') {

      const cleanedString = hargaString.replace(/[^\d.,]/g, '');
      const numberString = cleanedString.replace(/\./g, '').replace(/,/g, '.');
      return parseFloat(numberString) || 0;
    }
    return 0;
  };

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
          setMenuItems(result.data);
        } else {
          setMenuItems([]);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  const addToCart = (item) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    const hargaJual = parseHargaToNumber(item.harga_jual);

    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + 1;
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        subtotal: newQuantity * hargaJual
      };
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          quantity: 1,
          subtotal: hargaJual
        }
      ]);
    }
  };

  const updateQuantity = (itemId, amount) => {
    const updatedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + amount;
        if (newQuantity < 1) return null;

        const hargaJual = parseHargaToNumber(item.harga_jual);
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * hargaJual
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
      setErrorMessage('Silakan tambahkan item ke transaksi');
      setShowErrorModal(true);
      return;
    }

    if (paymentMethod === 'Cash') {
      const cashPaidNum = parseFloat(cashPaid);
      if (isNaN(cashPaidNum) || cashPaidNum < total) {
        setErrorMessage('Jumlah uang tunai tidak mencukupi');
        setShowErrorModal(true);
        return;
      }
    }


    setIsProcessingPayment(true);

    try {
      // Payload Transaksi
      const transactionData = {
        tunai: paymentMethod === 'Cash' ? parseFloat(cashPaid) : 0,
        details: selectedItems.map(item => ({
          produk_id: item.id,
          qty: item.quantity
        }))
      };

      console.log('Data transaksi yang akan dikirim:', transactionData);

      const createdTransaction = await buatTransaksi(transactionData);
      if (createdTransaction) {
        // Show success modal instead of alert
        setShowSuccessModal(true);
      } else {
        setErrorMessage('Gagal menyimpan transaksi. Silakan coba lagi.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      setErrorMessage('Gagal menyimpan transaksi. Silakan coba lagi.');
      setShowErrorModal(true);
    } finally {
      // Remove loading state
      setIsProcessingPayment(false);
    }
  };

  // Handle success modal OK button
  const handleSuccessModalOk = async () => {
    setShowSuccessModal(false);

    // Reset form
    setSelectedItems([]);
    setCustomerName('');
    setPaymentMethod('Cash');
    setShowCustomerInfo(false);
    setCashPaid('');

    // Refresh data
    await fetchProduct();
  };

  const calculateChange = () => {
    const cashPaidNum = parseFloat(cashPaid);
    if (isNaN(cashPaidNum) || cashPaidNum < total) return 0;
    return cashPaidNum - total;
  };

 
  const handleCashPaidChange = (e) => {
    const value = e.target.value;
    
    const numericValue = value.replace(/[^0-9.]/g, '');

    
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return; 
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
    }

    const formattedValue = parts.join('.');

    if (parts[0] && parts[0].length > 10) {
      return;
    }

    setCashPaid(formattedValue);
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
      
      <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-64'}`}>
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
                          {item.harga_jual} x {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Subtotal: {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(item.subtotal)}
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
                      type="text"
                      placeholder="Masukkan jumlah uang tunai"
                      value={cashPaid}
                      onChange={handleCashPaidChange}
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
                  disabled={isProcessingPayment || selectedItems.length === 0 || (paymentMethod === 'Cash' && (parseFloat(cashPaid) < total || isNaN(parseFloat(cashPaid))))}
                  className={`w-full py-2 px-4 rounded-md font-medium text-white flex items-center justify-center ${
                    isProcessingPayment || selectedItems.length === 0 || (paymentMethod === 'Cash' && (parseFloat(cashPaid) < total || isNaN(parseFloat(cashPaid))))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 transition-colors'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </>
                  ) : (
                    'Proses Pembayaran'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
             
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Transaksi Berhasil!
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                Transaksi telah berhasil disimpan dan data akan di-refresh.
              </p>

              <button
                onClick={handleSuccessModalOk}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">

              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Terjadi Kesalahan
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                {errorMessage}
              </p>

              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;