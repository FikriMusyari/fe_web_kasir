import { useState } from 'react';
import { X } from 'lucide-react';
import { buatProducts } from '../data/Api';
import { toast } from 'react-toastify';

const payloadProduk = { nama: '', harga_jual: '', harga_beli: '', kategori: '', };

const AddMenuItemModal = ({  onClose, animationClass }) => {
  const [newItem, setNewItem] = useState(payloadProduk);
   const [loading, setLoading] = useState(false);

 const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
  return (
    newItem.nama.trim() !== '' &&
    !isNaN(parseFloat(newItem.harga_jual)) &&
    parseFloat(newItem.harga_jual) > 0 &&
    !isNaN(parseFloat(newItem.harga_beli)) &&
    parseFloat(newItem.harga_beli) >= 0 && 
    newItem.kategori.trim() !== ''
  );
};

   const handleSubmit = async () => {
    if (!isValid()) return toast.error('Please fill all required fields');

    if (!navigator.onLine) {
    toast.error("Anda sedang offline. Tidak bisa menambahkan produk.");
    return;
  }

    setLoading(true);
    const payloadCreateproduk = {
    ...newItem,
    harga_jual: Number(newItem.harga_jual),
    harga_beli: Number(newItem.harga_beli),
  };
    const createdProduct = await buatProducts(payloadCreateproduk);
    setLoading(false);

    if (createdProduct) {
      toast.success('Product added successfully!');
      setNewItem(payloadProduk);
      onClose();
    } else {
      toast.error('Failed to add product. Please try again.');
    }
  };

  return (
 
    <div className={`fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 ${animationClass ? animationClass : ''}`}>
      <div className="bg-[#CBF1F5] rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-emerald-600">Add New Product Item</h3>
          <button onClick={onClose} aria-label="Close modal" disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          name="nama"
          value={newItem.nama}
          onChange={handleChange}
          disabled={loading}
          placeholder="Nama Produk"
          className="mb-3 h-10 w-full border rounded-2xl px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          name="harga_beli"
          min="0"
          value={newItem.harga_beli}
          onChange={handleChange}
          disabled={loading}
          placeholder="Harga Beli"
          className="mb-3 h-10 w-full border rounded-2xl px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          name="harga_jual"
          min="0"
          value={newItem.harga_jual}
          onChange={handleChange}
          disabled={loading}
          placeholder="Harga Jual"
          className="mb-3 h-10 w-full border rounded-2xl px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="text"
          name="kategori"
          value={newItem.kategori}
          onChange={handleChange}
          disabled={loading}
          placeholder="Kategori"
          className="mb-3 h-10 w-full border rounded-2xl px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-secondary px-4 py-2 rounded border border-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
