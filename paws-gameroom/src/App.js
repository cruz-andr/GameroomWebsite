import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import GameDirectory from './components/GameDirectory';
import Reservations from './components/Reservations';
import Info from './components/Info';
import Tournaments from './components/Tournaments';
import TournamentRegistration from './components/TournamentRegistration';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/*" element={
          <div className="App">
            <header className="app-header">
              <div className="header-container">
                <Link to="/" className="logo">
                  <div className="logo-icon">🎮</div>
                  <span>Paws Plays</span>
                </Link>
                <nav className="main-nav">
                  <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
                  <NavLink to="/games" className={({isActive}) => isActive ? "active" : ""}>Games</NavLink>
                  <NavLink to="/tournaments" className={({isActive}) => isActive ? "active" : ""}>Tournaments</NavLink>
                  <NavLink to="/info" className={({isActive}) => isActive ? "active" : ""}>About</NavLink>
                  <NavLink to="/reservations" className={({isActive}) => isActive ? "nav-cta" : "nav-cta"}>
                    RESERVATIONS
                  </NavLink>
                </nav>
              </div>
            </header>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<GameDirectory />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournaments/register/:id" element={<TournamentRegistration />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/info" element={<Info />} />
              </Routes>
            </main>

            <footer className="app-footer">
              <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h3 style={{marginBottom: '1rem'}}>Paws Plays Gameroom</h3>
                <p style={{marginBottom: '0.5rem'}}>📍 #424 Curry Student Center</p>
                <p style={{marginBottom: '0.5rem'}}>360 Huntington Ave, Boston, MA 02115</p>
                {/* <p style={{marginBottom: '0.5rem'}}>📞 (555) 123-4567</p>
                <p style={{marginBottom: '1.5rem'}}>✉️ info@pawsplaysgameroom.com</p> */}
                <p style={{fontSize: '0.9rem', opacity: 0.8}}>&copy; 2024 Paws Plays Gameroom. All rights reserved.</p>
              </div>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
