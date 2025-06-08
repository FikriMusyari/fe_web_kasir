import { useState } from 'react';
import { Edit, Trash2, Tag, X } from 'lucide-react';
import { toast } from 'react-toastify'; // Pastikan Anda sudah menginstal react-toastify dan CSS-nya
import { updateProduct, deleteProduct } from '../data/Api';

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
    harga_beli: cleanAndParsePrice(item.harga_beli),
    harga_jual: cleanAndParsePrice(item.harga_jual),
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
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-scale-in"> {/* Larger padding, more rounded */}
            <button
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
              aria-label="Close Edit Modal"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-3">Edit Produk</h3> {/* Added border-bottom */}

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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-base" 
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-base"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-base"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-base"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8"> {/* Increased margin top */}
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium" 
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengupdate...
                    </div>
                  ) : 'Update'}
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