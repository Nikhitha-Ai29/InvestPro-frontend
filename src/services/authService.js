const BASE = import.meta.env.VITE_API_URL || 'https://investpro-backend.onrender.com';
const USERS_KEY = 'investproUsers';

// ── Generic POST ──────────────────────────────────────────
const post = async (path, body) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.message || data.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
};

// ── Session ───────────────────────────────────────────────
export const saveSession = (data) => {
  const { password, hash, ...safe } = data;
  localStorage.setItem('investproUser', JSON.stringify(safe));
  localStorage.setItem('userName',  safe.name  || '');
  localStorage.setItem('userEmail', safe.email || '');
  localStorage.setItem('role',      safe.role  || '');
};

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem('investproUser') || 'null'); }
  catch { return null; }
};

export const clearSession = () => {
  ['investproUser', 'userName', 'userEmail', 'role', 'demoPortfolio'].forEach(k =>
    localStorage.removeItem(k)
  );
};

// kept for import compatibility — always false now
export const isDemoSession = () => false;

// ── Local user registry ───────────────────────────────────
const getLocalUsers = () => {
  try {
    const u = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(u) ? u : [];
  } catch { return []; }
};

const saveLocalUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const simpleHash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h.toString(16);
};

export const localRegister = (name, email, password, role = 'USER') => {
  const users = getLocalUsers();
  const norm  = email.trim().toLowerCase();
  if (users.some(u => u.email.toLowerCase() === norm))
    throw new Error('This email is already registered. Please sign in instead.');
  const user = {
    id:    `usr-${Date.now()}`,
    name:  name.trim(),
    email: email.trim(),
    role:  role.toUpperCase(),
    hash:  simpleHash(password),
  };
  saveLocalUsers([...users, user]);
  const { hash, ...safe } = user;
  return safe;
};

export const localLogin = (email, password) => {
  const norm = email.trim().toLowerCase();
  const user = getLocalUsers().find(u => u.email.toLowerCase() === norm);
  if (!user) throw new Error('No account found with this email. Please register first.');
  if (user.hash !== simpleHash(password)) throw new Error('Incorrect password. Please try again.');
  const { hash, ...safe } = user;
  return safe;
};

// ── Backend API ───────────────────────────────────────────
export const registerUser = (name, email, password, role) =>
  post('/auth/register', { name, email, password, role });

export const sendOtp    = (email)       => post('/auth/send-otp',    { email });
export const verifyOtp  = (email, otp)  => post('/auth/verify-otp',  { email, otp });
export const resendOtp  = (email)       => post('/auth/resend-otp',  { email });
export const loginUser  = (email, pass) => post('/auth/login',       { email, password: pass });

export const checkBackendHealth = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${BASE}/actuator/health`, { signal: controller.signal });
    return res.ok;
  } catch { return false; }
  finally { clearTimeout(timeout); }
};
