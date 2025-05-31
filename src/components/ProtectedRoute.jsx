import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, allowedRoles = [] }) => {
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;