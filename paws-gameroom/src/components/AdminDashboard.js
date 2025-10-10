import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!token || !adminUser) {
      navigate('/admin/login');
      return;
    }

    setUser(JSON.parse(adminUser));

    // Verify token is still valid
    verifyToken(token);
  }, [navigate]);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        handleLogout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-dashboard">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>{sidebarOpen ? 'Admin Panel' : 'AP'}</h2>
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard')}`}>
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span className="nav-text">Dashboard</span>}
          </Link>
          
          <Link to="/admin/content" className={`nav-item ${isActive('/admin/content')}`}>
            <span className="nav-icon">📝</span>
            {sidebarOpen && <span className="nav-text">Page Content</span>}
          </Link>
          
          <Link to="/admin/games" className={`nav-item ${isActive('/admin/games')}`}>
            <span className="nav-icon">🎮</span>
            {sidebarOpen && <span className="nav-text">Games</span>}
          </Link>
          
          <Link to="/admin/tournaments" className={`nav-item ${isActive('/admin/tournaments')}`}>
            <span className="nav-icon">🏆</span>
            {sidebarOpen && <span className="nav-text">Tournaments</span>}
          </Link>
          
          <Link to="/admin/images" className={`nav-item ${isActive('/admin/images')}`}>
            <span className="nav-icon">🖼️</span>
            {sidebarOpen && <span className="nav-text">Images</span>}
          </Link>
          
          <Link to="/admin/settings" className={`nav-item ${isActive('/admin/settings')}`}>
            <span className="nav-icon">⚙️</span>
            {sidebarOpen && <span className="nav-text">Settings</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🌐</span>
            {sidebarOpen && <span className="nav-text">View Site</span>}
          </Link>
          
          <button onClick={handleLogout} className="nav-item logout-btn">
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>Gameroom Admin</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.username}</span>
            </div>
          )}
        </div>

        <div className="admin-content">
          {location.pathname === '/admin/dashboard' ? (
            <DashboardHome />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const [stats, setStats] = useState({
    games: 0,
    tournaments: 0,
    registrations: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch games count
      const gamesRes = await fetch('http://localhost:5001/api/admin/games', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const games = await gamesRes.json();
      
      // Fetch tournaments count
      const tournamentsRes = await fetch('http://localhost:5001/api/admin/tournaments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tournamentsData = await tournamentsRes.json();
      
      setStats({
        games: games.length || 0,
        tournaments: tournamentsData.tournaments?.length || 0,
        registrations: tournamentsData.registrations?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard-home">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-content">
            <div className="stat-number">{stats.games}</div>
            <div className="stat-label">Total Games</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-number">{stats.tournaments}</div>
            <div className="stat-label">Active Tournaments</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.registrations}</div>
            <div className="stat-label">Tournament Registrations</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/admin/games" className="action-card">
            <span className="action-icon">➕</span>
            <span>Add New Game</span>
          </Link>
          
          <Link to="/admin/tournaments" className="action-card">
            <span className="action-icon">📅</span>
            <span>Create Tournament</span>
          </Link>
          
          <Link to="/admin/content" className="action-card">
            <span className="action-icon">✏️</span>
            <span>Edit Homepage</span>
          </Link>
          
          <Link to="/admin/images" className="action-card">
            <span className="action-icon">📸</span>
            <span>Upload Images</span>
          </Link>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Getting Started</h3>
        <ul>
          <li>Edit page content to update the homepage, about page, and other static content</li>
          <li>Manage games to add, edit, or remove games from your catalog</li>
          <li>Create and manage tournaments with online registration</li>
          <li>Upload images for games, tournaments, and site content</li>
          <li>Configure site settings to customize your gameroom</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;