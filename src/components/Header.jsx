import { Link } from 'react-router-dom';

const Header = () => (
  <nav className="bg-green-600 text-white p-4 flex gap-4">
    <Link to="/" className="hover:underline">Dashboard</Link>
    <Link to="/menu" className="hover:underline">Menu</Link>
    <Link to="/transactions" className="hover:underline">Transaksi</Link>
    <Link to="/reports" className="hover:underline">Laporan</Link>
  </nav>
);

export default Header;