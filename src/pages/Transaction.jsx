import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Trash2, PlusCircle, MinusCircle, DollarSign } from 'lucide-react';
import { Menu as MenuIcon, ChevronLeft, UserCircle } from 'lucide-react';

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

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const parseHargaToNumber = (hargaString) => {
    if (typeof hargaString === 'number') return hargaString;
    if (typeof hargaString === 'string') {
      // Menghapus 'Rp', titik ribuan, dan koma desimal, lalu parse
      const cleanedString = hargaString.replace(/Rp\.?\s?/g, '').replace(/\./g, '').replace(/,/g, '.');
      return parseFloat(cleanedString) || 0;
    }
    return 0;
  };

  const formatCurrency = (value) => {
    // Fungsi ini tetap menggunakan 'Rp' karena digunakan untuk tampilan final (Total, Kembalian)
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const fetchProduct = async () => {
    try {
      const response = await getProducts();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Gagal mengambil data produk:', error);
    } finally {
      setLoading(false);
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

    const cashPaidNum = parseHargaToNumber(cashPaid);

    if (paymentMethod === 'Cash') {
      if (isNaN(cashPaidNum) || cashPaidNum < total) {
        setErrorMessage('Jumlah uang tunai tidak mencukupi');
        setShowErrorModal(true);
        return;
      }
    }

    setIsProcessingPayment(true);

    try {
      const transactionData = {
        tunai: paymentMethod === 'Cash' ? cashPaidNum : 0,
        details: selectedItems.map(item => ({
          produk_id: item.id,
          qty: item.quantity
        }))
      };

      console.log('Data transaksi yang akan dikirim:', transactionData);

      const createdTransaction = await buatTransaksi(transactionData);
      if (createdTransaction) {
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
      setIsProcessingPayment(false);
    }
  };

  const handleSuccessModalOk = async () => {
    setShowSuccessModal(false);

    setSelectedItems([]);
    setCustomerName('');
    setPaymentMethod('Cash');
    setShowCustomerInfo(false);
    setCashPaid('');

    await fetchProduct();
  };

  const calculateChange = () => {
    const cashPaidNum = parseHargaToNumber(cashPaid);
    if (isNaN(cashPaidNum) || cashPaidNum < total) return 0;
    return cashPaidNum - total;
  };

  const handleCashPaidChange = (e) => {
    const value = e.target.value;
    // Step 1: Hapus semua 'Rp', spasi, dan karakter non-digit untuk mendapatkan angka mentah
    let numericValueString = value.replace(/Rp\.?\s?/g, '').replace(/\D/g, '');

    // Limit to 8 digits (for the "00.000.000" equivalent)
    if (numericValueString.length > 8) {
      numericValueString = numericValueString.substring(0, 8);
    }

    const numericValue = parseInt(numericValueString, 10);

    if (isNaN(numericValue) || numericValueString === '') {
      setCashPaid('');
      return;
    }

    // Step 2: Format angka hanya dengan pemisah ribuan (tanpa 'Rp' atau simbol mata uang lain)
    let formattedValue = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      // useGrouping: true (default for id-ID, adds dots)
    }).format(numericValue);

    // Step 3 (Defensif): Pastikan 'Rp' benar-benar hilang jika somehow muncul dari Intl.NumberFormat
    formattedValue = formattedValue.replace(/Rp\.?\s?/g, '').trim(); // Menghapus 'Rp' dan spasi di sekitarnya

    setCashPaid(formattedValue);
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Tombol Hamburger/Menu - Tetap di posisi tetap */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'left-4 bg-indigo-700 hover:bg-indigo-800 shadow-md' : 'left-68 bg-indigo-800 hover:bg-indigo-900 shadow-lg'}`}
      >
        {isSidebarCollapsed ? <MenuIcon size={24} /> : <ChevronLeft size={24} />}
      </button>

      {/* Main Content Area - Padding atas disesuaikan dengan tombol fixed */}
      <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-64'} pt-16 lg:pt-8`}>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Buat Transaksi Baru</h1>
            <p className="text-gray-600 text-sm">Kelola transaksi penjualan dengan mudah.</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0 bg-indigo-50 px-4 py-2 rounded-full text-indigo-800 font-semibold text-sm shadow-inner">
            <UserCircle className="w-5 h-5 mr-2" />
            <span>{userName}</span>
            <span className="ml-2 text-indigo-600 capitalize">({userRole})</span>
          </div>
        </div>
        {/* Akhir Header Section */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {searchLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  </div>
                )}
              </div>

              <h2 className="font-semibold text-lg text-gray-700 mb-4 border-b pb-2 border-gray-200">
                Daftar Menu
              </h2>

              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                  <p className="mt-3 text-gray-600 font-medium">Memuat menu...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-600">
                  <p className="mb-4 text-lg font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-lg">{searchTerm ? 'Tidak ada menu yang ditemukan' : 'Belum ada menu tersedia'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {menuItems.map(item => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-indigo-50 hover:shadow-md transition-all duration-200 relative group overflow-hidden"
                      onClick={() => addToCart(item)}
                    >
                      <h3 className="font-bold text-gray-800 text-base mb-1">{item.nama}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.kategori}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-indigo-700 text-lg">
                          {item.harga_jual}
                        </span>
                        <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white bg-green-500 p-2 rounded-full shadow-md hover:bg-green-600">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="font-semibold text-lg text-gray-700 mb-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                <span>Detail Transaksi</span>
                <button
                  onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                  className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  {showCustomerInfo ? 'Sembunyikan Info' : 'Tambah Info Pelanggan'}
                </button>
              </h2>

              {showCustomerInfo && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Nama Pelanggan (Opsional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </div>
              )}

              {selectedItems.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>Klik menu di samping untuk menambah item!</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium text-gray-800 text-base">{item.nama}</p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(parseHargaToNumber(item.harga_jual))} x {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">
                          Subtotal: {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors rounded-l-md"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                          <span className="px-2 font-medium text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-green-500 hover:text-green-700 transition-colors rounded-r-md"
                          >
                            <PlusCircle className="w-5 h-5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-5 mt-5">
                <div className="flex justify-between text-2xl font-extrabold text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-700">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Metode Pembayaran
                  </label>
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition duration-200"
                    >
                      <option value="Cash">Tunai</option>
                      <option value="Bank Transfer">Transfer Bank</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'Cash' && (
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Jumlah Uang Tunai
                    </label>
                    <div className="relative">
                      {/* Added 'Rp' span with absolute positioning */}
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">Rp</span>
                      <input
                        type="text"
                        placeholder="Masukkan jumlah uang tunai"
                        value={cashPaid}
                        onChange={handleCashPaidChange}
                        // Adjusted padding-left to account for 'Rp'
                        className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      />
                    </div>
                    {cashPaid && parseHargaToNumber(cashPaid) >= total && (
                      <div className="mt-3 text-sm text-green-700 font-semibold flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>Kembalian: {formatCurrency(calculateChange())}</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={processTransaction}
                  disabled={isProcessingPayment || selectedItems.length === 0 || (paymentMethod === 'Cash' && (parseHargaToNumber(cashPaid) < total || isNaN(parseHargaToNumber(cashPaid))))}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center transition-all duration-200 ${
                    isProcessingPayment || selectedItems.length === 0 || (paymentMethod === 'Cash' && (parseHargaToNumber(cashPaid) < total || isNaN(parseHargaToNumber(cashPaid))))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Memproses Pembayaran...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      Proses Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl transform scale-95 animate-scale-in">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-9 w-9 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Transaksi Berhasil!
            </h3>
            <p className="text-base text-gray-600 mb-8">
              Transaksi telah berhasil disimpan.
            </p>
            <button
              onClick={handleSuccessModalOk}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl transform scale-95 animate-scale-in">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-9 w-9 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Terjadi Kesalahan
            </h3>
            <p className="text-base text-gray-600 mb-8">
              {errorMessage}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;