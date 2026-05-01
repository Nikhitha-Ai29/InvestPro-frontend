import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashScreen from './pages/SplashScreen';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import ExploreFunds from './pages/ExploreFunds';
import InvestFund from './pages/InvestFund';
import Portfolio from './pages/Portfolio';
import SIPCalculator from './pages/SIPCalculator';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageFunds from './pages/admin/ManageFunds';
import Reports from './pages/admin/Reports';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('investproUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({ id: parsed.id, name: parsed.name, email: parsed.email, role: parsed.role });
    }
  }, []);

  const ProtectedRoute = ({ children, allowedRole }) => {
    const stored = localStorage.getItem('investproUser');
    if (!stored) return <Navigate to="/login" />;
    const parsed = JSON.parse(stored);
    const role = parsed.role?.toUpperCase();
    if (allowedRole && role !== allowedRole.toUpperCase()) {
      return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/verify-otp" element={<VerifyOTP setUser={setUser} />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRole="user"><Dashboard user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute allowedRole="user"><ExploreFunds /></ProtectedRoute>} />
        <Route path="/invest/:fundName" element={<ProtectedRoute allowedRole="user"><InvestFund /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute allowedRole="user"><Portfolio /></ProtectedRoute>} />
        <Route path="/sip-calculator" element={<ProtectedRoute allowedRole="user"><SIPCalculator /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRole="user"><Profile user={user} setUser={setUser} /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard setUser={setUser} /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><ManageUsers setUser={setUser} /></ProtectedRoute>} />
        <Route path="/admin/funds" element={<ProtectedRoute allowedRole="admin"><ManageFunds setUser={setUser} /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><Reports setUser={setUser} /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
