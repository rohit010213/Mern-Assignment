import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">TaskManager</Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
        >
          Dashboard
        </Link>

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
          >
            Admin Panel
          </Link>
        )}
      </div>

      <div className="navbar-user">
        <span className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
