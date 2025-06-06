import { Trash2, Eye } from 'lucide-react';

const TransactionModals = ({
  // Detail Modal Props
  showDetailModal,
  selectedTransaction,
  userRole,
  formatDate,
  onCloseDetailModal,
  
  // Delete Modal Props
  showDeleteModal,
  transactionToDelete,
  isDeleting,
  onDeleteConfirm,
  onDeleteCancel
}) => {
  return (
    <>
      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <Eye className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Detail Transaksi
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedTransaction.nomor_transaksi}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onCloseDetailModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-6">
                {/* Transaction Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Informasi Transaksi</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Nomor Transaksi:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTransaction.nomor_transaksi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tanggal:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedTransaction.tanggal ? formatDate(selectedTransaction.tanggal) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Items:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTransaction.itemCount}</span>
                      </div>
                      {userRole === 'owner' && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Kasir:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedTransaction.nama_user}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Ringkasan Pembayaran</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTransaction.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tunai:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTransaction.tunai || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Kembalian:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTransaction.kembalian || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-white border rounded-lg">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700">Detail Produk</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produk
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTransaction.details && selectedTransaction.details.length > 0 ? (
                          selectedTransaction.details.map((detail, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {detail.nama_produk || detail.product_name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {detail.qty || detail.quantity || detail.jumlah || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                {detail.subtotal || 'N/A'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                              Tidak ada detail produk tersedia
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onCloseDetailModal}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Hapus Transaksi
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus transaksi{' '}
                  <span className="font-medium text-gray-900">
                    {transactionToDelete?.nomor_transaksi}
                  </span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3">
                  <button
                    onClick={onDeleteCancel}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={onDeleteConfirm}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menghapus...
                      </>
                    ) : (
                      'Hapus'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionModals;
