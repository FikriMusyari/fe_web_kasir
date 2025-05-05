const MenuCard = ({ item, onDelete }) => (
    <div className="border rounded shadow p-4 bg-white">
      <h4 className="text-lg font-semibold">{item.nama}</h4>
      <p className="text-gray-600">Rp{item.harga}</p>
      <button
        className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        onClick={() => onDelete(item.id)}>
        Hapus
      </button>
    </div>
  );
  
  export default MenuCard;