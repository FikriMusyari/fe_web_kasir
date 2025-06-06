import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Calendar, User, Package } from 'lucide-react';

const SimpleSearchBar = ({ onSearch, onReset, loading }) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    produk: '',
    user: '',
    tanggal: ''
  });
  const debounceRef = useRef(null);

  const handleQuickSearch = (value) => {
    setQuickSearch(value);

    // Clear advanced search when using quick search
    if (value.trim()) {
      setSearchParams({ produk: '', user: '', tanggal: '' });
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        // Quick search - search in all fields with general term
        const searchData = {
          general: value // Use general parameter for quick search
        };
        onSearch(searchData);
      } else {
        // Reset if empty
        onReset();
      }
    }, 500); // 500ms debounce
  };

  const handleAdvancedSearch = (field, value) => {
    const newParams = {
      ...searchParams,
      [field]: value
    };
    setSearchParams(newParams);

    // Clear quick search when using advanced search
    if (value.trim()) {
      setQuickSearch('');
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      const hasSearchTerms = Object.values(newParams).some(val => val.trim());

      if (hasSearchTerms) {
        // Filter out empty parameters
        const filteredParams = {};
        Object.keys(newParams).forEach(key => {
          if (newParams[key].trim()) {
            filteredParams[key] = newParams[key];
          }
        });
        onSearch(filteredParams);
      } else {
        onReset();
      }
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    setQuickSearch('');
    setSearchParams({ produk: '', user: '', tanggal: '' });
    onReset();
  };

  const hasActiveSearch = quickSearch.trim() || Object.values(searchParams).some(value => value.trim());

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Quick Search */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            placeholder="Cari cepat di semua field..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
            value={quickSearch}
            onChange={(e) => handleQuickSearch(e.target.value)}
          />
          {quickSearch && !loading && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-xs text-indigo-600 font-medium">Mencari...</div>
            </div>
          )}
        </div>

        {/* Advanced Search Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`inline-flex items-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
            showAdvanced
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter Spesifik
        </button>

        {/* Reset Button */}
        {hasActiveSearch && (
          <button
            onClick={handleClear}
            className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </button>
        )}
      </div>

      {/* Advanced Search Panel */}
      {showAdvanced && (
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
                onChange={(e) => handleAdvancedSearch('produk', e.target.value)}
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
                onChange={(e) => handleAdvancedSearch('user', e.target.value)}
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
                onChange={(e) => handleAdvancedSearch('tanggal', e.target.value)}
              />
            </div>
          </div>

          {/* Search Info */}
          <div className="mt-4 text-sm text-gray-500">
            <p>💡 Tips: Gunakan "Cari cepat" untuk pencarian umum, atau "Filter Spesifik" untuk pencarian detail berdasarkan field tertentu.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSearchBar;
