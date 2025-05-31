import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4 text-red-500">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">  Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
