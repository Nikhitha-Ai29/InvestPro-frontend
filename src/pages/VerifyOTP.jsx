import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, resendOtp, saveSession } from '../services/authService';
import '../styles/Auth.css';
import '../styles/OTP.css';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function VerifyOTP({ setUser }) {
  const navigate   = useNavigate();
  const location   = useLocation();

  // email + pendingUser passed from Register via navigate state
  const email       = location.state?.email       || '';
  const pendingUser = location.state?.pendingUser || null;

  const [digits,    setDigits]    = useState(Array(OTP_LENGTH).fill(''));
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [timer,     setTimer]     = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Redirect away if no email in state
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  // ── Handle single digit input ──
  const handleChange = (index, value) => {
    // Allow only digits
    if (!/^\d?$/.test(value)) return;

    const updated = [...digits];
    updated[index] = value;
    setDigits(updated);
    setError('');

    // Auto-advance focus
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ── Handle backspace ──
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── Handle paste (paste full OTP at once) ──
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { updated[i] = ch; });
    setDigits(updated);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Verify OTP ──
  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await verifyOtp(email, otp);

      // Use verified user data from backend if returned, else use pendingUser
      const userData = (data?.id ? data : pendingUser) || {};

      if (userData.id) {
        saveSession(userData);
        setUser({ id: userData.id, name: userData.name, email: userData.email, role: userData.role });
      }

      setSuccess('✅ OTP verified successfully! Redirecting...');

      setTimeout(() => {
        const role = userData.role?.toUpperCase();
        navigate(role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    try {
      await resendOtp(email);
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimer(RESEND_SECONDS);
      setSuccess('OTP resent successfully! Check your email.');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const otpFilled = digits.every(d => d !== '');

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Step indicator */}
        <div className="otp-steps">
          <div className="step-dot done" />
          <div className="step-dot active" />
          <div className="step-dot" />
        </div>

        <div className="otp-icon">📧</div>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Verify Your Email</h2>
        <p className="auth-subtitle" style={{ textAlign: 'center' }}>
          We sent a 6-digit OTP to
        </p>
        <p className="otp-email-hint">{email}</p>

        {error   && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* 6-box OTP input */}
        <div className="otp-input-row" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              className={`otp-box ${digit ? (success ? 'success' : 'filled') : ''}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={i === 0}
              disabled={!!success}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          className="btn btn-primary btn-full"
          onClick={handleVerify}
          disabled={loading || !otpFilled || !!success}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Resend row */}
        <div className="otp-resend-row">
          {timer > 0 ? (
            <span>Resend OTP in <span className="otp-timer">{timer}s</span></span>
          ) : (
            <span>
              Didn't receive it?{' '}
              <button
                className="resend-btn"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            </span>
          )}
        </div>

        <p className="auth-link" style={{ marginTop: 20 }}>
          Wrong email? <span onClick={() => navigate('/register')}>Go back</span>
        </p>

      </div>
    </div>
  );
}

export default VerifyOTP;
