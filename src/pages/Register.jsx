import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const API = 'http://localhost:8081';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      if (!res.ok) throw new Error('Registration failed. Email may already be in use.');
      const data = await res.json();

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
      setError(err.message || 'Registration failed. Please try again.');
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
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
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
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Select Role</label>
            <div className="role-selection">
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={formData.role === 'USER'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <span>User</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={formData.role === 'ADMIN'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <span>Admin</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
