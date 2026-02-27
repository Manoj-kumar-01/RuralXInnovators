import React from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import './i18n';
import LanguageSelector from './components/LanguageSelector';
import Login from './components/Login';
import Registration from './components/Registration';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Schemes from './pages/Schemes';
import Emergency from './pages/Emergency';
import './App.css';

// Persistent Header with Back Button
function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on language selector
  if (location.pathname === '/') return null;

  return (
    <div className="app-header">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={24} />
      </button>
      <div className="header-logo">RuralX</div>
    </div>
  );
}

// Dashboard Layout Component wrapping the protected pages
function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-content">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LanguageSelector onLanguageSelect={() => navigate('/login')} />} />

        {/* Auth Routes with Header */}
        <Route element={<><Header /><Outlet /></>}>
          <Route path="/login" element={<Login onLoginComplete={() => navigate('/dashboard')} />} />
          <Route path="/register" element={<Registration onRegisterComplete={() => navigate('/dashboard')} />} />
        </Route>

        {/* Dashboard Routes with Navbar & Header */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="emergency" element={<Emergency />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
