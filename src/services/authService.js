// 🔥 Direct backend URL (IMPORTANT FIX)
const BASE = "https://investpro-backend-3.onrender.com";

// ── Generic POST helper ─────────────────────────────
const post = async (path, body) => {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message ||
        data.error ||
        `Request failed (${res.status})`
      );
    }

    return data;
  } catch (err) {
    console.error("❌ API ERROR:", err);
    throw err;
  }
};

// ── Session helpers ─────────────────────────────────
export const saveSession = (data) => {
  localStorage.setItem('investproUser', JSON.stringify(data));
  localStorage.setItem('userName', data.name || '');
  localStorage.setItem('userEmail', data.email || '');
  localStorage.setItem('role', data.role || '');
};

export const getSession = () => {
  const raw = localStorage.getItem('investproUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem('investproUser');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('role');
};

// ── Auth API calls ──────────────────────────────────

// ✅ Register
export const registerUser = (name, email, password, role) =>
  post('/auth/register', { name, email, password, role });

// ✅ Send OTP
export const sendOtp = (email) =>
  post('/auth/send-otp', { email });

// ✅ Verify OTP
export const verifyOtp = (email, otp) =>
  post('/auth/verify-otp', { email, otp });

// ✅ Resend OTP
export const resendOtp = (email) =>
  post('/auth/resend-otp', { email });

// ✅ Login
export const loginUser = (email, password) =>
  post('/auth/login', { email, password });