const BASE = import.meta.env.VITE_API_URL || 'https://investpro-backend.onrender.com';

// ── Generic POST helper ───────────────────────────────────
const post = async (path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Request failed (${res.status})`);
  return data;
};

// ── Session helpers ───────────────────────────────────────
export const saveSession = (data) => {
  const { password, ...safe } = data;
  localStorage.setItem('investproUser', JSON.stringify(safe));
  localStorage.setItem('userName',  safe.name  || '');
  localStorage.setItem('userEmail', safe.email || '');
  localStorage.setItem('role',      safe.role  || '');
};

export const getSession = () => {
  const raw = localStorage.getItem('investproUser');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const clearSession = () => {
  localStorage.removeItem('investproUser');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('role');
  localStorage.removeItem('demoPortfolio');
};

export const isDemoSession = () => false; // all sessions are treated as real

// ── Local user registry (fallback when backend is down) ───
const USERS_KEY = 'investproUsers';

const getLocalUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Simple deterministic hash — not cryptographic, just prevents plain-text storage
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
};

// Register a new user locally — throws if email already exists
export const localRegister = (name, email, password, role = 'USER') => {
  const users = getLocalUsers();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error('Email is already registered. Please login instead.');
  const user = {
    id:    `usr-${Date.now()}`,
    name,
    email,
    role:  role.toUpperCase(),
    hash:  simpleHash(password),
  };
  saveLocalUsers([...users, user]);
  const { hash, ...safe } = user;
  return safe;
};

// Login locally — throws if not found or wrong password
export const localLogin = (email, password) => {
  const users = getLocalUsers();
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('No account found with this email. Please register first.');
  if (user.hash !== simpleHash(password)) throw new Error('Incorrect password. Please try again.');
  const { hash, ...safe } = user;
  return safe;
};

// ── Auth API calls ────────────────────────────────────────
export const registerUser = (name, email, password, role) =>
  post('/auth/register', { name, email, password, role });

export const sendOtp = (email) =>
  post('/auth/send-otp', { email });

export const verifyOtp = (email, otp) =>
  post('/auth/verify-otp', { email, otp });

export const resendOtp = (email) =>
  post('/auth/resend-otp', { email });

export const loginUser = (email, password) =>
  post('/auth/login', { email, password });

// ── Backend health check ──────────────────────────────────
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${BASE}/actuator/health`, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
};
