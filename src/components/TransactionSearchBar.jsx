import React, { useState, useRef } from 'react';
import { Search, Filter, X, Calendar, User, Package } from 'lucide-react';

const TransactionSearchBar = ({ onSearch, onReset, loading }) => {
  const [searchParams, setSearchParams] = useState({
    produk: '',
    user: '',
    tanggal: ''
  });

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const debounceRef = useRef(null);

  // Debounced search function
  const debouncedSearch = (searchData) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(searchData);
    }, 300);
  };

  // Handle quick search (searches across all fields)
  const handleQuickSearch = (value) => {
    setQuickSearch(value);

    // Clear advanced search when using quick search
    if (value.trim()) {
      setSearchParams({
        produk: '',
        user: '',
        tanggal: ''
      });

      // Search across all fields with the same query
      const searchData = {
        produk: value,
        user: value,
        tanggal: value
      };

      debouncedSearch(searchData);
    } else {
      // If empty, reset search
      onReset();
    }
  };



  // Reset all search
  const handleReset = () => {
    setSearchParams({
      produk: '',
      user: '',
      tanggal: ''
    });
    setQuickSearch('');
    onReset();
  };

  // Update search params
  const updateSearchParam = (field, value) => {
    const newParams = {
      ...searchParams,
      [field]: value
    };

    setSearchParams(newParams);

    // Clear quick search when using advanced search
    if (value.trim()) {
      setQuickSearch('');
    }

    // Debounced search for advanced search
    const hasSearchTerms = Object.values(newParams).some(val => val.trim());

    if (hasSearchTerms) {
      debouncedSearch(newParams);
    } else {
      onReset();
    }
  };

  // Check if any search is active
  const hasActiveSearch = quickSearch.trim() || Object.values(searchParams).some(value => value.trim());

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Quick Search */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari transaksi (produk, kasir, nomor transaksi)..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            value={quickSearch}
            onChange={(e) => handleQuickSearch(e.target.value)}
            disabled={loading}
          />
          {quickSearch && (
            <button
              onClick={() => handleQuickSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Advanced Search Toggle */}
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className={`inline-flex items-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
            showAdvancedSearch
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter Lanjutan
        </button>

        {/* Reset Button */}
        {hasActiveSearch && (
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </button>
        )}
      </div>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-1" />
                Nama Produk
              </label>
              <input
                type="text"
                placeholder="Cari berdasarkan produk..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={searchParams.produk}
                onChange={(e) => updateSearchParam('produk', e.target.value)}
                disabled={loading}
              />
            </div>

            {/* User Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nama Kasir
              </label>
              <input
                type="text"
                placeholder="Cari berdasarkan kasir..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={searchParams.user}
                onChange={(e) => updateSearchParam('user', e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Date Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Tanggal
              </label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={searchParams.tanggal}
                onChange={(e) => updateSearchParam('tanggal', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Search Info */}
          <div className="mt-4 text-sm text-gray-500">
            <p>💡 Tips: Kosongkan field untuk mencari di semua data. Pencarian akan dilakukan otomatis saat Anda mengetik.</p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
          Mencari transaksi...
        </div>
      )}
    </div>
  );
};

export default TransactionSearchBar;
