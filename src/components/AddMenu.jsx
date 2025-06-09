import { useState } from 'react';
import { X } from 'lucide-react';
import { buatProducts } from '../data/Api';
import { toast } from 'react-toastify';

// Helper function to format a number into Rupiah string (e.g., 100000 -> "100.000")
// MODIFIKASI: Hapus 'style: currency' dan 'currency: IDR' agar tidak ada 'Rp' otomatis
const formatRupiah = (value) => {
  if (value === '' || value === null || isNaN(value)) {
    return '';
  }
  const number = Number(value);
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Helper function to parse a Rupiah string back into a number (e.g., "Rp 100.000" -> 100000)
const parseRupiah = (rupiahString) => {
  if (typeof rupiahString !== 'string') return rupiahString;
  const cleaned = rupiahString.replace(/Rp\.?\s?/g, '').replace(/\./g, '');
  return parseInt(cleaned, 10) || 0;
};

const payloadProduk = {
  nama: '',
  harga_jual: '', // Store as formatted string for display
  harga_beli: '', // Store as formatted string for display
  kategori: '',
};

const AddMenuItemModal = ({ onClose, animationClass, onProductAdded }) => {
  const [newItem, setNewItem] = useState(payloadProduk);
  const [loading, setLoading] = useState(false);

  // Generic handler for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // Specific handler for Rupiah formatted inputs
  const handleRupiahChange = (e) => {
    const { name, value } = e.target;
    // Remove all non-digit characters to get raw number string
    const rawValue = value.replace(/\D/g, '');
    // Limit to 8 digits (for 00.000.000)
    const limitedValue = rawValue.substring(0, 8);
    const numericValue = parseInt(limitedValue, 10);

    // Format the number back to Rupiah string for display
    setNewItem(prev => ({
      ...prev,
      [name]: isNaN(numericValue) || limitedValue === '' ? '' : formatRupiah(numericValue),
    }));
  };

  // Handle scroll wheel events for price adjustment
  const handlePriceWheel = (e, fieldName) => {
    e.preventDefault(); // Prevent page scroll
    let currentValue = parseRupiah(newItem[fieldName]);

    if (e.deltaY < 0) { // Scroll up (increase)
      currentValue = currentValue + 1000;
    } else { // Scroll down (decrease)
      currentValue = Math.max(0, currentValue - 1000); // Don't go below 0
    }

    // Limit maximum value to prevent exceeding 00.000.000 (roughly 99,999,999)
    currentValue = Math.min(currentValue, 99999999);

    setNewItem(prev => ({
      ...prev,
      [fieldName]: formatRupiah(currentValue),
    }));
  };

  const handleSubmit = async () => {
    // Parse values from formatted strings to numbers for validation and API payload
    const hargaJualNum = parseRupiah(newItem.harga_jual);
    const hargaBeliNum = parseRupiah(newItem.harga_beli);

    // Basic validation
    if (
      newItem.nama.trim() === '' ||
      hargaJualNum <= 0 || // Now uses parsed number
      hargaBeliNum < 0 || // Now uses parsed number
      newItem.kategori.trim() === ''
    ) {
      toast.error('Semua kolom wajib diisi dengan benar. Harga jual harus lebih dari 0.');
      return;
    }

    if (!navigator.onLine) {
      toast.error("Anda sedang offline. Tidak bisa menambahkan produk.");
      return;
    }

    setLoading(true);
    const payloadCreateProduk = {
      nama: newItem.nama,
      harga_jual: hargaJualNum, // Send as number
      harga_beli: hargaBeliNum, // Send as number
      kategori: newItem.kategori,
    };

    try {
      const createdProduct = await buatProducts(payloadCreateProduk);
      if (createdProduct) {
        toast.success('Produk berhasil ditambahkan!');
        setNewItem(payloadProduk); // Reset form
        onClose(); // Tutup modal
        if (onProductAdded) {
          onProductAdded(); // Call onProductAdded to refresh menu list
        }
      } else {
        toast.error('Gagal menambahkan produk. Silakan coba lagi.');
      }
    } catch (error) {
        console.error("Error adding product:", error);
        toast.error('Terjadi kesalahan saat menambahkan produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop modal
    <div className={`fixed inset-0 flex items-center justify-center z-[1000] p-4 ${animationClass ? animationClass : ''}`}>
      {/* Kontainer Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative transform transition-transform duration-300 animate-scale-in">
        {/* Tombol Tutup */}
        <button
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={onClose}
          aria-label="Close modal"
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* Header Modal */}
        <h3 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-3">Tambah Produk Baru</h3>

        {/* Form Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={newItem.nama}
              onChange={handleChange}
              disabled={loading}
              placeholder="Contoh: Nasi Goreng Spesial"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>

          {/* Harga Beli Input */}
          <div>
            <label htmlFor="harga_beli" className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">Rp</span>
                <input
                    type="text"
                    id="harga_beli"
                    name="harga_beli"
                    value={newItem.harga_beli}
                    onChange={handleRupiahChange}
                    onWheel={(e) => handlePriceWheel(e, 'harga_beli')}
                    disabled={loading}
                    placeholder="Contoh: 10.000"
                    className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                />
            </div>
          </div>

          {/* Harga Jual Input */}
          <div>
            <label htmlFor="harga_jual" className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">Rp</span>
                <input
                    type="text"
                    id="harga_jual"
                    name="harga_jual"
                    value={newItem.harga_jual}
                    onChange={handleRupiahChange}
                    onWheel={(e) => handlePriceWheel(e, 'harga_jual')}
                    disabled={loading}
                    placeholder="Contoh: 15.000"
                    className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                />
            </div>
          </div>

          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input
              type="text"
              id="kategori"
              name="kategori"
              value={newItem.kategori}
              onChange={handleChange}
              disabled={loading}
              placeholder="Contoh: Makanan, Minuman, Snack"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-sm font-medium"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center font-medium"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Tambah Produk'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemModal;