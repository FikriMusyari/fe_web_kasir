import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, User } from 'lucide-react';
import { loginUser } from "../data/Api.js";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.querySelector('script#google-login')) {
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-login';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = initializeGoogleSignIn;
    };

    loadGoogleScript();
    
    return () => {
      const scriptTag = document.querySelector('script#google-login');
      if (scriptTag) {
        scriptTag.remove();
      }
      const googleDiv = document.getElementById('g_id_onload');
      if (googleDiv) {
        googleDiv.remove();
      }
    };
  }, []);

  const initializeGoogleSignIn = () => {
    window.google?.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', 
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    
    window.google?.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { 
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular', 
      }
    );
  };

  const handleGoogleResponse = async (response) => {
    try {
      setIsLoading(true);
      setError('');
      
      const { credential } = response;
      
   
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });
      
      const data = await result.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.nama);
        
        onLogin();
        navigate('/dashboard');
      } else {
        setError(data.message || 'Gagal login dengan Google');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Terjadi kesalahan saat login dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); 

    try {
      const result = await loginUser({ username, password });
      const hasil = result.data;
      if (hasil && hasil.token) {
        localStorage.setItem('token', hasil.token);
        localStorage.setItem('userRole', hasil.role);
        localStorage.setItem('userName', hasil.nama);

        onLogin();
        navigate('/dashboard'); 
      } else {
        setError(result.message || 'Username atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">Login Pengguna</h1>
            <p className="text-indigo-200 mt-2">
              Masuk sebagai Owner atau Kasir untuk menggunakan sistem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" />
                <span className="ml-2">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
            
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-300 absolute w-full"></div>
              <div className="bg-white px-3 relative text-sm text-gray-500">atau</div>
            </div>
            
            <div id="googleSignInDiv" className="flex justify-center"></div>
          </form>

          <div className="bg-gray-50 text-center py-4 text-xs text-gray-500">
            © {new Date().getFullYear()} Web Kantin. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;