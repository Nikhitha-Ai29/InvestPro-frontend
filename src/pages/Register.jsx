import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, sendOtp } from '../services/authService';
import '../styles/Auth.css';

function Register({ setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      // ✅ Step 1: Register
      const registerResponse = await registerUser(formData.name, formData.email, formData.password, formData.role);

      console.log("✅ Register success:", registerResponse);

      // ✅ Step 2: Send OTP
      const otpResponse = await sendOtp(formData.email);

      console.log("🔥 OTP triggered:", otpResponse);

      // ✅ Step 3: Navigate
      navigate('/verify-otp', {
        state: {
          email: formData.email,
          pendingUser: registerResponse.data,
        },
      });

    } catch (err) {
      console.error("❌ ERROR:", err);

      setError(err.message || 'Registration or OTP sending failed.');
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
              onChange={e => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
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
              placeholder="Create a password (min 6 chars)"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
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
                  onChange={e => handleChange('role', e.target.value)}
                />
                <span>User</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={formData.role === 'ADMIN'}
                  onChange={e => handleChange('role', e.target.value)}
                />
                <span>Admin</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register & Send OTP'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;