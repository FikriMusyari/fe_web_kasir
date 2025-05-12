const RoleRestricted = ({ roles, children }) => {
    const userRole = localStorage.getItem('userRole');
    
    if (roles && roles.length > 0 && !roles.includes(userRole)) {
      return null; }
    
    return children;
  };
  
  export default RoleRestricted;