import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TransactionPage from './pages/Transaction';
import HistoryPage from './pages/History';
import Menu from './pages/Menu';
import ReportPage from './pages/Report';
import AddAccountPage from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserName(name || '');
    }
    setIsLoading(false); 
  }, []);

  const ambiltoken = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');

    if (!token || !role) return null;
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

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
            <Dashboard userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TransactionPage userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <HistoryPage userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/menu"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner', 'kasir']}>
            <Menu userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner']}>
            <ReportPage userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['owner', 'kasir']}>
            <AddAccountPage userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
