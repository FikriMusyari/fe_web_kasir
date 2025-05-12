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
import { userCredentials } from './data/DummyData';

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

  const handleLogin = async (credentials) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = userCredentials.find(
      u => u.username === credentials.username && 
           u.password === credentials.password
    );

    if (user) {
      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      
      setIsAuthenticated(true);
      setUserRole(user.role);
      setUserName(user.name);
      
      return { success: true };
    }
    
    return { success: false, message: 'Username atau password salah' };
  } catch (error) {
    return { success: false, message: 'Terjadi kesalahan saat login' };
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
  };
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
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
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;