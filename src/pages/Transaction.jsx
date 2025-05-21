import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Pastikan path sesuai dengan struktur proyekmu
import RoleRestricted from '../components/RoleRestricted';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { menuItems } from '../data/DummyData';

const TransactionPage = ({ userRole, userName, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [cashPaid, setCashPaid] = useState('');
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('transaksi'); 
  
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const updatedItems = selectedItems.map(item => {
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

  const processTransaction = () => {
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
    
    console.log('Processing transaction:', transaction);
    alert('Transaksi berhasil disimpan!');
    
    setSelectedItems([]);
    setCustomerName('');
    setPaymentMethod('Cash');
    setShowCustomerInfo(false);
    setCashPaid('');
  };

  const calculateChange = () => {
    const cashPaidNum = parseFloat(cashPaid);
    return cashPaidNum - total;
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
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <h2 className="font-semibold text-gray-700 mb-3">Menu</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredItems.map(item => (
                  <div 
                    key={item.id}
                    className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => addToCart(item)}
                  >
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold text-indigo-600">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(item.price)}
                      </span>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <RoleRestricted roles={['admin']}>
              <div className="bg-yellow-50 rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <h2 className="font-semibold text-yellow-800 mb-2">Opsi Admin</h2>
                <p className="text-sm text-yellow-700 mb-3">
                  Fitur tambahan khusus untuk administrator:
                </p>
                <div className="flex space-x-3">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors flex items-center">
                    <FaEdit className="mr-1" /> Edit Menu
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex items-center">
                    <FaTrash className="mr-1" /> Hapus Transaksi
                  </button>
                </div>
              </div>
            </RoleRestricted>
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
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaMinusCircle />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-green-500 hover:text-green-700 transition-colors"
                          >
                            <FaPlusCircle />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(total)}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Pajak (0%)</span>
                  <span className="font-medium">Rp0</span>
                </div>
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
                    <option value="Credit Card">Kartu Debit/Kredit</option>
                    <option value="Bank Transfer">Transfer Bank</option>
                    <option value="Digital Wallet">E-Wallet</option>
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
