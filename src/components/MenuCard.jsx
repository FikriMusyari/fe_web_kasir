import { useState } from 'react';
import { Edit, Trash2, Tag, X } from 'lucide-react';
import { toast } from 'react-toastify'; // Pastikan Anda sudah menginstal react-toastify dan CSS-nya
import { updateProduct, deleteProduct } from '../data/Api';

const MenuCard = ({ item, userRole, onRefresh }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // `loading` tidak digunakan secara global di sini, gunakan `isDeleting` dan `isUpdating`
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
    harga_beli: cleanAndParsePrice(item.harga_beli),
    harga_jual: cleanAndParsePrice(item.harga_jual),
    kategori: item.kategori || '',
    // Hapus image dari formData jika tidak ada lagi di tampilan card utama
    // image: item.image || '' 
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (
      formData.nama.trim() === '' ||
      isNaN(Number(formData.harga_jual)) ||
      Number(formData.harga_jual) <= 0 ||
      isNaN(Number(formData.harga_beli)) ||
      Number(formData.harga_beli) < 0
    ) {
      toast.error('Nama, harga beli, dan harga jual wajib diisi dengan benar. Harga jual harus lebih dari 0.');
      return;
    }

    const payload = {};
    if (formData.nama !== item.nama) payload.nama = formData.nama;
    if (cleanAndParsePrice(formData.harga_beli) !== cleanAndParsePrice(item.harga_beli)) {
      payload.harga_beli = cleanAndParsePrice(formData.harga_beli);
    }
    if (cleanAndParsePrice(formData.harga_jual) !== cleanAndParsePrice(item.harga_jual)) {
      payload.harga_jual = cleanAndParsePrice(formData.harga_jual);
    }
    if (formData.kategori !== item.kategori) payload.kategori = formData.kategori;
    // Hapus payload.image jika tidak ada lagi di tampilan card utama
    // if (formData.image !== item.image) payload.image = formData.image; 

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
          transform hover:-translate-y-1 group // group untuk efek hover pada anak
        "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md z-10">
          {formatCurrency(item.harga_jual)}
        </div>


        {/* Overlay Hover dengan Tombol Aksi (hanya untuk owner) */}
        {isHovered && userRole === 'owner' && (
          // --- Membuat Overlay Transparan ---
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <div className="flex space-x-4">
              <button
                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsEditModalOpen(true)}
                aria-label="Edit Product"
                disabled={isUpdating} // Menggunakan isUpdating karena ini aksi update
              >
                <Edit size={20} className="text-gray-700" />
              </button>
              <button
                className="bg-white p-3 rounded-full shadow-lg hover:bg-red-100 transition-colors"
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
                  <Trash2 size={20} className="text-red-500" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Detail Produk - Ini menjadi konten utama kartu sekarang */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-xl text-gray-900 leading-tight">{item.nama}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Tag size={16} className="text-indigo-500 mr-1" />
              <span className="font-medium">{item.kategori || 'Tanpa Kategori'}</span> {/* Teks kategori lebih menonjol */}
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100">
            {userRole === 'owner' && (
              <p className="text-gray-600 text-sm mb-1">Harga Beli: <span className="font-semibold">{formatCurrency(item.harga_beli)}</span></p>
            )}
            <p className="text-lg font-bold text-green-600">Harga Jual: <span className="text-2xl">{formatCurrency(item.harga_jual)}</span></p>
          </div>
        </div>
      </div>

      {/* Modal Edit (tetap sama) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
              aria-label="Close Edit Modal"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-indigo-700">Edit Produk</h3>

            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  placeholder="Nama Produk"
                  value={formData.nama}
                  onChange={handleChange}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="harga_beli" className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
                <input
                  type="number"
                  id="harga_beli"
                  name="harga_beli"
                  placeholder="Harga Beli"
                  min="0"
                  value={formData.harga_beli}
                  onChange={handleChange}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="harga_jual" className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
                <input
                  type="number"
                  id="harga_jual"
                  name="harga_jual"
                  placeholder="Harga Jual"
                  min="0"
                  value={formData.harga_jual}
                  onChange={handleChange}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <input
                  type="text"
                  id="kategori"
                  name="kategori"
                  placeholder="Kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  {isUpdating ? 'Mengupdate...' : 'Update'}
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