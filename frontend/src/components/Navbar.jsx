import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="navbar-logo">
            🏨 Hotel Management
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/rooms" className="nav-link">
            Rooms
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">
              Admin Panel
            </Link>
          )}
        </div>
        
        <div className="navbar-user">
          <span className="user-info">
            Welcome, {user?.username} ({user?.role})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 