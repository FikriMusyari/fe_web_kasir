import { useState } from 'react';
import { Edit, Trash2, Tag, X } from 'lucide-react';
import { toast } from 'react-toastify'; // Pastikan Anda sudah menginstal react-toastify dan CSS-nya
import { updateProduct, deleteProduct } from '../data/Api';

// Helper function to format a number into Rupiah string (e.g., 100000 -> "100.000")
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

const MenuCard = ({ item, userRole, onRefresh }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fungsi untuk membersihkan string harga dari karakter non-digit dan mengkonversi ke Number
  const cleanAndParsePrice = (priceInput) => {
    if (typeof priceInput === 'number') return priceInput;
    if (typeof priceInput === 'string') {
      const cleaned = priceInput.replace(/[^0-9,-]+/g, '').replace(/,/g, '');
      return Number(cleaned);
    }
    return 0;
  };

  // State form untuk modal edit, diinisialisasi dari item yang diterima
  const [formData, setFormData] = useState({
    nama: item.nama || '',
    harga_beli: formatRupiah(cleanAndParsePrice(item.harga_beli)),
    harga_jual: formatRupiah(cleanAndParsePrice(item.harga_jual)),
    kategori: item.kategori || '',
  });

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' && typeof amount !== 'string') {
      return 'Rp 0';
    }
    const numAmount = cleanAndParsePrice(amount);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numAmount);
  };

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus produk "${item.nama}"? Aksi ini tidak dapat dibatalkan.`)) return;

    setIsDeleting(true);
    try {
      const deleted = await deleteProduct(item.id);
      if (deleted) {
        toast.success('Produk berhasil dihapus');
        onRefresh();
      } else {
        toast.error('Gagal menghapus produk. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error during delete:', error);
      toast.error('Terjadi kesalahan saat menghapus produk.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Generic handler for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(numericValue) || limitedValue === '' ? '' : formatRupiah(numericValue),
    }));
  };

  // Handle scroll wheel events for price adjustment
  const handlePriceWheel = (e, fieldName) => {
    e.preventDefault(); // Prevent page scroll
    let currentValue = parseRupiah(formData[fieldName]);

    if (e.deltaY < 0) { // Scroll up (increase)
      currentValue = currentValue + 1000;
    } else { // Scroll down (decrease)
      currentValue = Math.max(0, currentValue - 1000); // Don't go below 0
    }

    // Limit maximum value to prevent exceeding 00.000.000 (roughly 99,999,999)
    currentValue = Math.min(currentValue, 99999999);

    setFormData(prev => ({
      ...prev,
      [fieldName]: formatRupiah(currentValue),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Parse values from formatted strings to numbers for validation and API payload
    const hargaJualNum = parseRupiah(formData.harga_jual);
    const hargaBeliNum = parseRupiah(formData.harga_beli);

    // Basic validation
    if (
      formData.nama.trim() === '' ||
      hargaJualNum <= 0 || // Now uses parsed number
      hargaBeliNum < 0 || // Now uses parsed number
      formData.kategori.trim() === ''
    ) {
      toast.error('Semua kolom wajib diisi dengan benar. Harga jual harus lebih dari 0.');
      return;
    }

    const payload = {};
    if (formData.nama !== item.nama) payload.nama = formData.nama;
    if (hargaBeliNum !== cleanAndParsePrice(item.harga_beli)) {
      payload.harga_beli = hargaBeliNum; // Send as number
    }
    if (hargaJualNum !== cleanAndParsePrice(item.harga_jual)) {
      payload.harga_jual = hargaJualNum; // Send as number
    }
    if (formData.kategori !== item.kategori) payload.kategori = formData.kategori;

    if (Object.keys(payload).length === 0) {
      toast.info('Tidak ada perubahan data');
      setIsEditModalOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const updated = await updateProduct(item.id, payload);
      if (updated) {
        toast.success('Produk berhasil diupdate');
        setIsEditModalOpen(false);
        onRefresh();
      } else {
        toast.error('Gagal update produk. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Terjadi kesalahan saat update produk.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Kartu Menu */}
      <div
        className="
          bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
          overflow-hidden flex flex-col relative
          transform hover:-translate-y-1 group
        "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Konten Utama Kartu */}
        <div className="p-5 flex-grow flex flex-col"> {/* Adjusted padding */}
          {/* Section untuk Nama Produk dan Kategori */}
          <div className="mb-3"> {/* Increased margin bottom */}
            <h3 className="font-extrabold text-2xl text-gray-900 leading-snug break-words"> {/* Larger, bolder, and break-words for long names */}
              {item.nama}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-2"> {/* Increased margin top */}
              <Tag size={16} className="text-indigo-500 mr-1.5" /> {/* Adjusted margin right */}
              <span className="font-semibold text-indigo-700">{item.kategori || 'Tanpa Kategori'}</span> {/* Category more prominent */}
            </div>
          </div>

          {/* Section untuk Harga */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col items-start"> {/* Align price to start */}
            {userRole === 'owner' && (
              <p className="text-gray-600 text-sm mb-1.5">Harga Beli: <span className="font-bold">{formatCurrency(item.harga_beli)}</span></p>
            )}
            <p className="text-lg font-bold text-emerald-600">Harga Jual:</p> {/* "Harga Jual" on its own line */}
            <p className="text-4xl font-extrabold text-emerald-700 leading-none"> {/* Much larger for "Harga Jual" value */}
                {formatCurrency(item.harga_jual)}
            </p>
          </div>
        </div>

        {/* Overlay Hover dengan Tombol Aksi (hanya untuk owner) */}
        {isHovered && userRole === 'owner' && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <div className="flex space-x-4">
              <button
                className="bg-white p-3.5 rounded-full shadow-xl hover:bg-indigo-100 transition-all transform hover:scale-110"
                onClick={() => setIsEditModalOpen(true)}
                aria-label="Edit Product"
                disabled={isUpdating}
              >
                <Edit size={22} className="text-indigo-600" /> {/* Larger icon, themed color */}
              </button>
              <button
                className="bg-white p-3.5 rounded-full shadow-xl hover:bg-red-100 transition-all transform hover:scale-110"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete Product"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Trash2 size={22} className="text-red-500" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4">
          {/* Kontainer Modal */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative transform transition-transform duration-300 animate-scale-in">
            {/* Tombol Tutup */}
            <button
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setIsEditModalOpen(false)}
              aria-label="Close modal"
              disabled={isUpdating}
            >
              <X size={24} />
            </button>

            {/* Header Modal */}
            <h3 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-3">Edit Produk</h3>

            {/* Form Input */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  disabled={isUpdating}
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
                        value={formData.harga_beli}
                        onChange={handleRupiahChange}
                        onWheel={(e) => handlePriceWheel(e, 'harga_beli')}
                        disabled={isUpdating}
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
                        value={formData.harga_jual}
                        onChange={handleRupiahChange}
                        onWheel={(e) => handlePriceWheel(e, 'harga_jual')}
                        disabled={isUpdating}
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
                  value={formData.kategori}
                  onChange={handleChange}
                  disabled={isUpdating}
                  placeholder="Contoh: Makanan, Minuman, Snack"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center font-medium"
                >
                  {isUpdating ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isUpdating ? 'Mengupdate...' : 'Update Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;