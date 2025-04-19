import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  
  return (
    <Link
      to={to}
      className={`link ${location.pathname === to ? 'text-blue-500' : ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;