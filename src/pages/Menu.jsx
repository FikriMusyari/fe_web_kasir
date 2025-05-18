import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, ChevronDown, Filter, Edit, User, Trash2, Tag, X } from 'lucide-react';
import { menuItems } from '../data/DummyData'; // Ganti dengan data aktual
import Sidebar from '../components/Sidebar'; // Pastikan Sidebar diimpor dengan benar

// MenuCard Component
const MenuCard = ({ item, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex space-x-3">
            <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Edit size={18} className="text-gray-700" />
            </button>
            <button
              className="bg-white p-2 rounded-full hover:bg-red-100 transition-colors"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          Rp {item.price.toLocaleString()}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center text-xs">
          <Tag size={14} className="text-emerald-500 mr-1" />
          <span className="text-gray-500">{item.category}</span>
        </div>
      </div>
    </div>
  );
};

// Add Menu Item Modal
const AddMenuItemModal = ({ isOpen, onClose, onAdd, existingCategories }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '/ayamkecap.jpg'
  });

  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = () => {
    if (!newItem.name || (!showNewCategoryInput && !newItem.category) || (showNewCategoryInput && !newCategory) || !newItem.description) {
      alert('Please fill all required fields');
      return;
    }

    const newId = Math.floor(Math.random() * 1000) + 10;

    onAdd({
      id: newId,
      ...newItem,
      category: showNewCategoryInput ? newCategory : newItem.category
    });

    setNewItem({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '/ayamkecap.jpg'
    });
    setNewCategory('');
    setShowNewCategoryInput(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center bg-emerald-500 text-white px-6 py-4">
          <h3 className="text-xl font-bold">Add New Menu Item</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-emerald-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newItem.price}
              onChange={handleChange}
              step="0.001"
              min="0"
              className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            {!showNewCategoryInput ? (
              <div className="flex items-center">
                <select
                  id="category"
                  name="category"
                  value={newItem.category}
                  onChange={handleChange}
                  className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a category</option>
                  {existingCategories.filter(cat => cat !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(true)}
                  className="ml-2 text-emerald-500 hover:text-emerald-700 text-sm"
                >
                  + New
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter new category"
                />
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(false)}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleChange}
              className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Menu Component
const Menu = () => {
  const [menu, setMenu] = useState(menuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('admin');
  const [userName, setUserName] = useState('Admin'); // Replace with dynamic userName here

  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(menuItems.map(item => item.category))];
    setCategories(uniqueCategories);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id) => {
    setMenu(menu.filter(item => item.id !== id));
  };

  const handleAddItem = (newItem) => {
    setMenu([...menu, newItem]);

    if (!categories.includes(newItem.category)) {
      setCategories([...categories, newItem.category]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setIsFilterOpen(false);
  };

  const filteredMenu = menu
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  return (
    <div className="flex">
      <Sidebar
        userRole={userRole}
        userName={userName} // Pass dynamic username here
        onLogout={() => console.log('Logged out')}
        activeTab="menu"
        setActiveTab={() => {}}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`flex-1 p-6 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              <span className="text-emerald-600">Menu</span> Management
            </h2>
            <div className="flex items-center space-x-2">
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300 shadow-md"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusCircle size={18} className="mr-2" />
                Add Item
              </button>
            </div>
          </div>

          <div className="mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item, index) => (
              <div key={item.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <MenuCard item={item} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        existingCategories={categories}
      />
    </div>
  );
};

export default Menu;
