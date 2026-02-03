import './App.css'
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';

function App() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Toaster position="top-right" />
      {user && (
        <div className="app-bar">
          <div className="welcome">Hello, <strong>{user.name}</strong> ({user.role})</div>
          <div className="controls">
            <button onClick={toggleTheme} className="icon-btn" title="Toggle Theme">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            <button onClick={logout} className="icon-btn logout" title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={
            user ? (
              user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />
            ) : <Navigate to="/login" />
          }
        />
      </Routes>
    </>
  )
}

export default App
