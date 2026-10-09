import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSupport from '../components/ChatSupport';
import { clearSession, saveSession, getSession } from '../services/authService';
import '../styles/AdminLayout.css';

function AdminLayout({ children, setUser }) {
  const navigate = useNavigate();
  const stored   = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const [userName, setUserName] = useState(stored.name || localStorage.getItem('userName') || 'Admin');
  const [editing, setEditing]   = useState(false);
  const [editVal, setEditVal]   = useState(userName);

  const handleLogout = () => {
    clearSession();
    if (setUser) setUser(null);
    navigate('/home');
  };

  const saveName = () => {
    const trimmed = editVal.trim() || 'Admin';
    setUserName(trimmed);
    setEditing(false);
    const session = getSession() || {};
    const updated = { ...session, name: trimmed };
    saveSession(updated);
    if (setUser) setUser(prev => prev ? { ...prev, name: trimmed } : prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveName();
    if (e.key === 'Escape') { setEditVal(userName); setEditing(false); }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-brand">InvestPro Admin</div>
        <div className="sidebar-user">
          <div className="sidebar-avatar admin-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            {editing ? (
              <input
                className="sidebar-name-edit"
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                onBlur={saveName}
                onKeyDown={handleKeyDown}
                autoFocus
                maxLength={40}
              />
            ) : (
              <span className="sidebar-user-name">
                {userName}
                <button className="edit-name-btn" onClick={() => { setEditVal(userName); setEditing(true); }} title="Edit name">✏️</button>
              </span>
            )}
            <span className="sidebar-user-role">Administrator</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate('/admin/dashboard')}>
            <span>📊</span> Dashboard
          </div>
          <div className="nav-item" onClick={() => navigate('/admin/users')}>
            <span>👥</span> Manage Users
          </div>
          <div className="nav-item" onClick={() => navigate('/admin/funds')}>
            <span>💰</span> Manage Funds
          </div>
          <div className="nav-item" onClick={() => navigate('/admin/reports')}>
            <span>📈</span> Reports
          </div>
          <div className="nav-item logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </div>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
      <ChatSupport />
    </div>
  );
}

export default AdminLayout;
