import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MenuCard from '../components/MenuCard';
import AddMenu from '../components/AddMenu';
import { PlusCircle, Search, Menu as MenuIcon, ChevronLeft, Package, Sparkles } from 'lucide-react'; // Added Sparkles for extra flair
import { getProducts, searchProduct } from '../data/Api';

const Menu = ({ userName, userRole, onLogout }) => {
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setMenu(response.data.data || response.data || []);
    } catch (error) {
      console.error('Gagal mengambil data produk:', error);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      if (searchTerm.trim() === '') {
        fetchProduct();
      } else {
        try {
          const result = await searchProduct(searchTerm);
          if (result && Array.isArray(result.data)) {
            setMenu(result.data);
          } else {
            setMenu([]);
          }
        } catch (searchError) {
          console.error('Error saat mencari produk:', searchError);
          setMenu([]);
        }
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (isAddModalOpen) {
      setIsModalVisible(true);
      setModalAnimation('fade-in');
    } else if (isModalVisible) {
      setModalAnimation('fade-out');
      const timeout = setTimeout(() => {
        setIsModalVisible(false);
        setModalAnimation('');
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isAddModalOpen, isModalVisible]);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50"> {/* Changed background */}
      {/* Overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Component */}
      <Sidebar
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        activeTab="menu"
        setActiveTab={() => { }}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Tombol Hamburger/Menu di luar Sidebar, di level teratas dan selalu di depan */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'left-4 bg-indigo-700 hover:bg-indigo-800 shadow-md' : 'left-68 bg-indigo-800 hover:bg-indigo-900 shadow-lg'}`}
      >
        {isSidebarCollapsed ? <MenuIcon size={24} /> : <ChevronLeft size={24} />}
      </button>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-0' : 'ml-64'} pt-16 lg:pt-8`}>
        {/* Revamped Header Section for Menu Page */}
        <header className="bg-white rounded-xl shadow-lg p-6 mb-8 mx-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Package className="h-9 w-9 text-indigo-700" /> {/* Larger, themed icon */}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Manajemen Menu Produk</h1>
              <p className="text-gray-600 text-sm">Kelola daftar makanan, minuman, dan produk lainnya di warung Anda.</p>
            </div>
          </div>
          {userRole === 'owner' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 sm:mt-0 px-6 py-3 rounded-xl flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition-all shadow-md text-base transform hover:scale-105"
            >
              <PlusCircle className="mr-2" size={20} />
              Tambah Produk Baru
              <Sparkles className="ml-1 w-4 h-4 text-yellow-300 animate-pulse" /> {/* Added a sparkle icon */}
            </button>
          )}
        </header>

        {/* Konten halaman utama (di bawah header) */}
        <div className="flex-1 p-6 pt-0 overflow-y-auto">
          {/* Search Bar */}
          <div className="mb-8 bg-white rounded-xl shadow-sm p-4"> {/* Wrapped search bar in a card-like div */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama menu atau kategori produk..."
                className="py-3 pl-12 pr-4 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Menampilkan menu atau pesan loading/tidak ditemukan */}
          {loading ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm mx-6"> {/* Added card styling for loading */}
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600 text-xl">Memuat menu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4 px-6"> {/* Added px-6 for padding */}
              {menu.length === 0 ? (
                <div className="text-center text-gray-500 col-span-full text-xl py-20 bg-white rounded-xl shadow-sm"> {/* Added card styling for no products */}
                  <p>Tidak ada produk yang ditemukan.</p>
                  {searchTerm && (
                    <p className="mt-2 text-base">Coba cari dengan kata kunci lain atau reset pencarian.</p>
                  )}
                  {!searchTerm && userRole === 'owner' && (
                    <p className="mt-2 text-base">Tambahkan produk baru untuk memulai!</p>
                  )}
                </div>
              ) : (
                menu.map((item) => (
                  <MenuCard key={item.id} item={item} userRole={userRole} onRefresh={fetchProduct} />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal AddMenu */}
      {isModalVisible && (
        <AddMenu
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          animationClass={modalAnimation}
          onProductAdded={fetchProduct}
        />
      )}
    </div>
  );
};

export default Menu;