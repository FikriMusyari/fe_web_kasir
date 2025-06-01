import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MenuCard from '../components/MenuCard';
import AddMenu from '../components/AddMenu';
import { PlusCircle, Search } from 'lucide-react';
import { getProducts, searchProduct } from '../data/Api';

const Menu = ({userName, userRole, onLogout}) => {
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
  try {
    const response = await getProducts();
    setMenu(response.data);
  } catch (error) {
    console.error('Gagal mengambil data produk:', error);
  } finally {
    setLoading(false)
  }
};

useEffect(() => {
  fetchProduct();
}, []);

 useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim() === '') {
        fetchProduct();
      } else {
        const result = await searchProduct(searchTerm);
        if (result) {
          setMenu(result.data);
        } else {
          setMenu([]);
        }
      }
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
  }, [isAddModalOpen]);


  return (
    <div className="flex">
      <Sidebar 
      userName={userName}
      userRole={userRole}
      activeTab="menu"
      setActiveTab={() => {}}
      isCollapsed={isSidebarCollapsed}
      toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      onLogout={onLogout}
        />

      <main className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
          {userRole === 'owner' && (
          <button onClick={() => setIsAddModalOpen(true)} className="p-3 border-white rounded-2xl btn-primary flex items-center bg-[#7AE2CF] ">
    <PlusCircle className="mr-2" size={18} />
    Add Item
          </button>
        )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="py-1.5 pl-10 w-full h-full border-2 border-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
  <p className="text-center text-gray-500">Loading...</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
    {menu.length === 0 ? (
      <p className="text-center text-gray-500 col-span-full">Produk tidak ditemukan.</p>
    ) : (
      menu.map((item) => (
        <MenuCard key={item.id} item={item} userRole={userRole} onRefresh={fetchProduct} />
      ))
    )}
  </div>
)}
      </main>

      
      {isModalVisible && (
        <AddMenu
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          animationClass={modalAnimation}
        />
      )}
    </div>
  );
};

export default Menu;