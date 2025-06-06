import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TransactionStats from '../components/TransactionStats';
import TransactionTable from '../components/TransactionTable';
import TransactionModals from '../components/TransactionModals';
import SimpleSearchBar from '../components/SimpleSearchBar';
import { getTransactions, searchTransactions, deleteTransaction } from '../data/Api.js';


const TransactionHistory = ({ userRole, userName, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    averageValue: 0
  });

 
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await getTransactions();

        const transactions = response?.data || [];

       

        const transactionsWithItemCount = transactions.map(transaction => {
          const itemCount = transaction.details && Array.isArray(transaction.details) ?
            transaction.details.reduce((total, detail) => {
              
              const qty = detail.qty || detail.quantity || detail.jumlah || 0;
              return total + qty;
            }, 0) : 0;

          return {
            ...transaction,
            itemCount
          };
        });

        setTransactions(transactionsWithItemCount);

        const totalTransactions = transactionsWithItemCount.length;

        const numericTotal = transactionsWithItemCount.reduce((sum, tx) => {
          const numericValue = parseFloat(tx.total?.replace(/[^\d]/g, '') || 0);
          return sum + numericValue;
        }, 0);

        
        const totalRevenue = numericTotal > 0 ?
          `Rp ${numericTotal.toLocaleString('id-ID')}` : 'Rp 0';

        const averageValue = totalTransactions > 0 ? numericTotal / totalTransactions : 0;

        setStats({
          totalTransactions,
          totalRevenue,
          averageValue
        });

      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
        setStats({ totalTransactions: 0, totalRevenue: 0, averageValue: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userRole]); 

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



  const handleViewDetails = (transactionId) => {
    const transaction = transactions.find(tx => tx.id === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowDetailModal(true);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTransaction(null);
  };

 
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteTransaction(transactionToDelete.id);
      if (result) {
        
        setTransactions(prev => prev.filter(tx => tx.id !== transactionToDelete.id));
        
        const updatedTransactions = transactions.filter(tx => tx.id !== transactionToDelete.id);
        const totalTransactions = updatedTransactions.length;
        const numericTotal = updatedTransactions.reduce((sum, tx) => {
          const numericValue = parseFloat(tx.total?.replace(/[^\d]/g, '') || 0);
          return sum + numericValue;
        }, 0);
        const totalRevenue = numericTotal > 0 ?
          `Rp ${numericTotal.toLocaleString('id-ID')}` : 'Rp 0';
        const averageValue = totalTransactions > 0 ? numericTotal / totalTransactions : 0;

        setStats({
          totalTransactions,
          totalRevenue,
          averageValue
        });

        console.log('Transaction deleted successfully');
      } else {
        console.error('Failed to delete transaction');
        alert('Gagal menghapus transaksi. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Terjadi kesalahan saat menghapus transaksi.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  };

  // Handle search transactions
  const handleSearch = async (searchParams) => {
    setSearchLoading(true);
    setIsSearchActive(true);

    try {
      const response = await searchTransactions(searchParams);

      if (response?.data) {
        const searchResults = response.data;

        // Process search results with item count
        const transactionsWithItemCount = searchResults.map(transaction => {
          const itemCount = transaction.details && Array.isArray(transaction.details) ?
            transaction.details.reduce((total, detail) => {
              const qty = detail.qty || detail.quantity || detail.jumlah || 0;
              return total + qty;
            }, 0) : 0;

          return {
            ...transaction,
            itemCount
          };
        });

        setTransactions(transactionsWithItemCount);

        // Update stats for search results
        const totalTransactions = transactionsWithItemCount.length;
        const numericTotal = transactionsWithItemCount.reduce((sum, tx) => {
          const numericValue = parseFloat(tx.total?.replace(/[^\d]/g, '') || 0);
          return sum + numericValue;
        }, 0);

        const totalRevenue = numericTotal > 0 ?
          `Rp ${numericTotal.toLocaleString('id-ID')}` : 'Rp 0';
        const averageValue = totalTransactions > 0 ? numericTotal / totalTransactions : 0;

        setStats({
          totalTransactions,
          totalRevenue,
          averageValue
        });
      } else {
        setTransactions([]);
        setStats({ totalTransactions: 0, totalRevenue: 'Rp 0', averageValue: 0 });
      }
    } catch (error) {
      console.error('Error searching transactions:', error);
      setTransactions([]);
      setStats({ totalTransactions: 0, totalRevenue: 'Rp 0', averageValue: 0 });
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle reset search
  const handleResetSearch = async () => {
    setIsSearchActive(false);
    setSearchLoading(true);

    try {
      // Fetch all transactions again
      const response = await getTransactions();
      const transactions = response?.data || [];

      const transactionsWithItemCount = transactions.map(transaction => {
        const itemCount = transaction.details && Array.isArray(transaction.details) ?
          transaction.details.reduce((total, detail) => {
            const qty = detail.qty || detail.quantity || detail.jumlah || 0;
            return total + qty;
          }, 0) : 0;

        return {
          ...transaction,
          itemCount
        };
      });

      setTransactions(transactionsWithItemCount);

      // Recalculate stats
      const totalTransactions = transactionsWithItemCount.length;
      const numericTotal = transactionsWithItemCount.reduce((sum, tx) => {
        const numericValue = parseFloat(tx.total?.replace(/[^\d]/g, '') || 0);
        return sum + numericValue;
      }, 0);

      const totalRevenue = numericTotal > 0 ?
        `Rp ${numericTotal.toLocaleString('id-ID')}` : 'Rp 0';
      const averageValue = totalTransactions > 0 ? numericTotal / totalTransactions : 0;

      setStats({
        totalTransactions,
        totalRevenue,
        averageValue
      });
    } catch (error) {
      console.error('Error resetting search:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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
                <div className="ml-2">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    <span className="text-indigo-600">Riwayat</span> Transaksi
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {userRole === 'kasir'
                      ? `Menampilkan transaksi Anda (${userName})`
                      : 'Menampilkan semua transaksi dari semua kasir'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <TransactionStats stats={stats} loading={loading} />

          <SimpleSearchBar
            onSearch={handleSearch}
            onReset={handleResetSearch}
            loading={searchLoading}
          />
          
          <TransactionTable
            transactions={transactions}
            userRole={userRole}
            formatDate={formatDate}
            onViewDetails={handleViewDetails}
            onDeleteClick={handleDeleteClick}
            loading={loading || searchLoading}
          />
        </main>
      </div>

      <TransactionModals
        showDetailModal={showDetailModal}
        selectedTransaction={selectedTransaction}
        userRole={userRole}
        formatDate={formatDate}
        onCloseDetailModal={handleCloseDetailModal}
        showDeleteModal={showDeleteModal}
        transactionToDelete={transactionToDelete}
        isDeleting={isDeleting}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default TransactionHistory;