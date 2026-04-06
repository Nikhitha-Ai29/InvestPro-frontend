import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const API = 'http://localhost:8081';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      if (!res.ok) throw new Error('Invalid email or password');
      const data = await res.json();
      if (!data?.id) throw new Error('Invalid response from server');

      localStorage.setItem('investproUser', JSON.stringify(data));
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('role', data.role);

      setUser({ id: data.id, name: data.name, email: data.email, role: data.role });

      if (data.role?.toUpperCase() === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your InvestPro account</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;