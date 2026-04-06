import { useNavigate } from 'react-router-dom';
import ChatSupport from '../components/ChatSupport';
import '../styles/AdminLayout.css';

function AdminLayout({ children, setUser }) {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const userName = stored.name || localStorage.getItem('userName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('investproUser');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    if (setUser) setUser(null);
    navigate('/home');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-brand">InvestPro Admin</div>
        <div className="sidebar-user">
          <div className="sidebar-avatar admin-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{userName}</span>
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
