import { FaCashRegister, FaUtensils, FaChartBar, FaClipboardList } from 'react-icons/fa';

const Dashboard = () => (
  <div className="text-center p-6">
    <h1 className="text-3xl font-bold mb-4 text-green-700">Selamat Datang di Warung Sekre</h1>
    <p className="text-gray-600 mb-8">
      Kelola transaksi, menu, laporan, dan pesanan aktif dengan mudah.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
      <FeatureCard icon={<FaCashRegister size={40} />} title="Transaksi" description="Catat dan kelola transaksi harian dengan cepat." />
      <FeatureCard icon={<FaUtensils size={40} />} title="Menu" description="Atur dan perbarui daftar makanan & minuman." />
      <FeatureCard icon={<FaChartBar size={40} />} title="Laporan" description="Lihat laporan keuangan dan statistik penjualan." />
      <FeatureCard icon={<FaClipboardList size={40} />} title="Pesanan ga ya" description="ngga" />
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white shadow-md rounded-lg p-5 text-center hover:shadow-lg transition duration-300">
    <div className="flex justify-center items-center mb-3 text-green-600">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);


export default Dashboard;