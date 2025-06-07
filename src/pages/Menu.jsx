import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MenuCard from '../components/MenuCard';
import AddMenu from '../components/AddMenu';
import { PlusCircle, Search, Menu as MenuIcon, ChevronLeft } from 'lucide-react';
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
      setMenu(response.data.data || response.data); 
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
    <div className="relative flex min-h-screen bg-gray-100">
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
        setActiveTab={() => {}}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Tombol Hamburger/Menu di luar Sidebar, di level teratas dan selalu di depan */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 rounded-full text-white z-[999] transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'left-4 bg-indigo-700' : 'left-68 bg-indigo-800'}`}
      >
        {isSidebarCollapsed ? <MenuIcon size={24} /> : <ChevronLeft size={24} />}
      </button>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-0 lg:ml-0' : 'ml-0 lg:ml-64'}`}>
        {/* Header/Navbar di dalam konten utama */}
        <div className="bg-white shadow-md p-4 flex items-center justify-end z-30"> {/* Changed justify-between to justify-end */}
          {/* --- Menghapus tulisan "Menu Management" dari sini --- */}
          {/* <h1 className="text-xl font-semibold text-gray-800">Menu Management</h1> */}
          {/* --- Akhir penghapusan --- */}
          {userRole === 'owner' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-lg flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-md"
            >
              <PlusCircle className="mr-2" size={18} />
              Add Item
            </button>
          )}
        </div>

        {/* Konten halaman utama (di bawah header) */}
        <div className="flex-1 p-6 overflow-y-auto pt-4">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama menu..."
                className="py-2.5 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Menampilkan menu atau pesan loading/tidak ditemukan */}
          {loading ? (
            <p className="text-center text-gray-500 text-lg py-10">Memuat menu...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
              {menu.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full text-lg py-10">Produk tidak ditemukan.</p>
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