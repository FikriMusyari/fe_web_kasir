import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TransactionPage from './pages/Transaction';
import HistoryPage from './pages/History';
import MenuPage from './pages/Menu';
import ReportPage from './pages/Report';
import SettingsPage from './pages/Settings';
import { getCurrentUser } from "./data/Api.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData); // Set user data ke state jika berhasil
      } else {
        console.log("Gagal mendapatkan data pengguna");
      }
    };

    fetchUserData(); // Panggil fungsi untuk fetch data pengguna saat komponen pertama kali di-render
  }, []);}

  // Mengecek status login saat komponen pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserName(name || '');
    }
  }, []);

  // Fungsi untuk menangani login
  const ambiltoken  = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  // Jika token, role, atau username tidak ditemukan, return null
  if (!token || !userRole || !userName) {
    return null;
  }

  return { token, userRole, userName };
};

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={ambiltoken} />
          )
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard 
              userRole={userRole} 
              userName={userName} 
              onLogout={handleLogout} 
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TransactionPage 
              userRole={userRole} 
              userName={userName}
              onLogout={handleLogout} 
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/history" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <HistoryPage 
              userRole={userRole} 
              userName={userName}
              onLogout={handleLogout} 
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin']}>
            <MenuPage 
              userRole={userRole}
              userName={userName} 
              onLogout={handleLogout} 
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin']}>
            <ReportPage 
              userRole={userRole}
              userName={userName} 
              onLogout={handleLogout} 
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin']}>
            <SettingsPage 
              userRole={userRole}
              userName={userName} 
              onLogout={handleLogout} 
            />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
