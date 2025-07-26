import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import BookRoom from './components/BookRoom';
import BookingConfirmation from './components/BookingConfirmation';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import './App.css';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="App">
          {user && <Navbar />}
          <div className="container">
            <Routes>
              <Route 
                path="/login" 
                element={user ? <Navigate to="/dashboard" /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={user ? <Navigate to="/dashboard" /> : <Register />} 
              />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/rooms" 
                element={user ? <Rooms /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/book-room/:roomId" 
                element={user ? <BookRoom /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/booking-confirmation/:bookingId" 
                element={user ? <BookingConfirmation /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/admin" 
                element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/" 
                element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
