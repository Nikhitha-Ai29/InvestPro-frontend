import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, sendOtp, localRegister, saveSession } from '../services/authService';
import '../styles/Auth.css';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'USER',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const isNetworkError = (msg = '') =>
    ['fetch', 'network', 'failed to fetch', 'load failed', 'abort'].some(k =>
      msg.toLowerCase().includes(k)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }

    setLoading(true);
    try {
      // Try real backend
      const data = await registerUser(
        formData.name.trim(), formData.email, formData.password, formData.role
      );
      try { await sendOtp(formData.email); } catch (_) { /* sent automatically */ }
      navigate('/verify-otp', { state: { email: formData.email, pendingUser: data?.data || data } });
    } catch (err) {
      if (isNetworkError(err.message)) {
        // Backend unreachable — register locally
        try {
          const user = localRegister(
            formData.name.trim(), formData.email, formData.password, formData.role
          );
          saveSession(user);
          setUser(user);
          navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        } catch (localErr) {
          setError(localErr.message);
        }
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join InvestPro today</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <div className="role-selection">
              <label className="radio-label">
                <input type="radio" name="role" value="USER"
                  checked={formData.role === 'USER'}
                  onChange={e => handleChange('role', e.target.value)} />
                <span>Investor</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="role" value="ADMIN"
                  checked={formData.role === 'ADMIN'}
                  onChange={e => handleChange('role', e.target.value)} />
                <span>Admin</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
