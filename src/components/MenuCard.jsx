import { useState } from 'react';
import { Edit, Trash2, Tag, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { updateProduct, deleteProduct } from '../data/Api';

const MenuCard = ({ item, userRole, onRefresh }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus produk "${item.nama}"?`)) return;

    setLoading(true);
    const deleted = await deleteProduct(item.id);
    setLoading(false);

    if (deleted) {
      toast.success('Produk berhasil dihapus');
      onRefresh(); 
    } else {
      toast.error('Gagal menghapus produk');
    }
  };


  const parseHarga = (str) => {
  if (!str) return 0;
  return Number(str.replace(/[^0-9]/g, ''));
};

  const [formData, setFormData] = useState({
    nama: item.nama,
    harga_beli: parseHarga(item.harga_beli),
    harga_jual: parseHarga(item.harga_jual),
    kategori: item.kategori,
  });

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
  
  if (
    formData.nama.trim() === '' ||
    isNaN(Number(formData.harga_jual)) ||
    Number(formData.harga_jual) <= 0
  ) {
    toast.error('Nama dan harga jual wajib diisi dengan benar');
    return;
  }

  
  const payload = {};
  if (formData.nama !== item.nama) payload.nama = formData.nama;
  if (Number(formData.harga_beli) !== item.harga_beli) payload.harga_beli = Number(formData.harga_beli);
  if (Number(formData.harga_jual) !== item.harga_jual) payload.harga_jual = Number(formData.harga_jual);
  if (formData.kategori !== item.kategori) payload.kategori = formData.kategori;

  
  if (Object.keys(payload).length === 0) {
    toast.info('Tidak ada perubahan data');
    return;
  }

  setLoading(true);
  const updated = await updateProduct(item.id, payload);
  setLoading(false);

  if (updated) {
    toast.success('Produk berhasil diupdate');
    setIsEditModalOpen(false);
    onRefresh();
  } else {
    toast.error('Gagal update produk');
  }
};

  return (
    <>
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img src={item.image} className="w-full h-48 object-cover bg-cl" />

        {isHovered && userRole === 'owner' && (
          <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="flex space-x-3">
              <button className="bg-white p-2 rounded-full hover:bg-gray-100" 
              onClick={() => setIsEditModalOpen(true)} aria-label="Edit Product">
                <Edit size={18} className="text-gray-700" />
              </button>
              <button
                className="bg-white p-2 rounded-full hover:bg-red-100"
                onClick={handleDelete} disabled={loading} aria-label="Delete Product"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full 
        text-xs font-bold">
           {item.harga_jual}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{item.nama}</h3>
       {userRole === 'owner' && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">Harga Beli: {item.harga_beli}</p>
)}
        <div className="flex items-center text-xs">
          <Tag size={14} className="text-emerald-500 mr-1" />
          <span className="text-gray-500">{item.kategori}</span>
        </div>
      </div>
    </div>

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#CBF1F5] rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsEditModalOpen(false)}
              disabled={loading}
              aria-label="Close Edit Modal"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-emerald-600">Edit Produk</h3>

            <input
              type="text"
              name="nama"
              placeholder="Nama Produk"
              value={formData.nama}
              onChange={handleChange}
              disabled={loading}
              className="mb-3 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              name="harga_beli"
              placeholder="Harga Beli"
              min="0"
              value={formData.harga_beli}
              onChange={handleChange}
              disabled={loading}
              className="mb-3 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              name="harga_jual"
              placeholder="Harga Jual"
              min="0"
              value={formData.harga_jual}
              onChange={handleChange}
              disabled={loading}
              className="mb-3 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              name="kategori"
              placeholder="Kategori"
              value={formData.kategori}
              onChange={handleChange}
              disabled={loading}
              className="mb-3 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={loading}
                className="btn-secondary px-4 py-2 rounded border border-black"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="btn-primary px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;
