import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, localLogin, saveSession } from '../services/authService';
import '../styles/Auth.css';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const isNetworkError = (msg = '') =>
    ['fetch', 'network', 'failed to fetch', 'load failed', 'abort'].some(k =>
      msg.toLowerCase().includes(k)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(formData.email, formData.password);
      if (!data?.id) throw new Error('Something went wrong. Please try again.');
      saveSession(data);
      setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
      navigate(data.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      if (isNetworkError(err.message)) {
        // Backend unreachable — try local registry silently
        try {
          const user = localLogin(formData.email, formData.password);
          saveSession(user);
          setUser(user);
          navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        } catch (localErr) {
          setError(localErr.message);
        }
      } else {
        setError(err.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your InvestPro account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Create Account</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
