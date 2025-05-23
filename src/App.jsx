import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TransactionPage from './pages/Transaction';
import HistoryPage from './pages/History';
import Menu from './pages/Menu';
import ReportPage from './pages/Report';
import AddAccountPage from './pages/AddAccount';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

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

  const ambiltoken = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (!token || !userRole) return null;
    setIsAuthenticated(true);
    setUserRole(userRole);
    setUserName(userName || '');
  };

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
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin', 'kasir']}>
            <Menu userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin']}>
            <ReportPage userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-account"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['admin']}>
            <AddAccountPage userRole={userRole} userName={userName} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
