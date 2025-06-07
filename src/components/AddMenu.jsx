import { useState } from 'react';
import { X } from 'lucide-react';
import { buatProducts } from '../data/Api';
import { toast } from 'react-toastify';

const payloadProduk = {
  nama: '',
  harga_jual: '',
  harga_beli: '',
  kategori: '',
  
};

const AddMenuItemModal = ({ onClose, animationClass, onProductAdded }) => {
  const [newItem, setNewItem] = useState(payloadProduk);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      newItem.nama.trim() === '' ||
      isNaN(parseFloat(newItem.harga_jual)) ||
      parseFloat(newItem.harga_jual) <= 0 ||
      isNaN(parseFloat(newItem.harga_beli)) ||
      parseFloat(newItem.harga_beli) < 0 ||
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
      ...newItem,
      harga_jual: Number(newItem.harga_jual),
      harga_beli: Number(newItem.harga_beli),
      // image: newItem.image // Jika Anda menambahkan field image
    };
    
    try {
      const createdProduct = await buatProducts(payloadCreateProduk);
      if (createdProduct) {
        toast.success('Produk berhasil ditambahkan!');
        setNewItem(payloadProduk); // Reset form
        onClose(); // Tutup modal
        if (onProductAdded) { // Panggil onProductAdded untuk refresh daftar menu
          onProductAdded();
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
    // === PERUBAHAN DI SINI ===
    <div className={`fixed inset-0 bg-opacity-20 flex items-center justify-center z-[1000] p-4 ${animationClass ? animationClass : ''}`}>
    {/* Mengubah bg-opacity-70 menjadi bg-opacity-20 (atau sesuai keinginan, misal bg-opacity-10) */}
    {/* ======================= */}
      {/* Kontainer Modal */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative transform transition-transform duration-300 animate-fade-in-up">
        {/* Tombol Tutup */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={onClose}
          aria-label="Close modal"
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* Header Modal */}
        <h3 className="text-2xl font-bold mb-6 text-indigo-700">Tambah Produk Baru</h3>

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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="harga_beli" className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
            <input
              type="number"
              id="harga_beli"
              name="harga_beli"
              min="0"
              value={newItem.harga_beli}
              onChange={handleChange}
              disabled={loading}
              placeholder="Contoh: 10000"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="harga_jual" className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
            <input
              type="number"
              id="harga_jual"
              name="harga_jual"
              min="0"
              value={newItem.harga_jual}
              onChange={handleChange}
              disabled={loading}
              placeholder="Contoh: 15000"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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