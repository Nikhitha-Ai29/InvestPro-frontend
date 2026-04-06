import { useNavigate } from 'react-router-dom';
import ChatSupport from '../components/ChatSupport';
import '../styles/Layout.css';

function DashboardLayout({ children, setUser }) {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const userName = stored.name || localStorage.getItem('userName') || 'User';

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
      <aside className="sidebar">
        <div className="sidebar-brand">InvestPro</div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{userName}</span>
            <span className="sidebar-user-role">Investor</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate('/dashboard')}>
            <span>📊</span> Overview
          </div>
          <div className="nav-item" onClick={() => navigate('/portfolio')}>
            <span>💼</span> Portfolio
          </div>
          <div className="nav-item" onClick={() => navigate('/explore')}>
            <span>🔍</span> Explore Funds
          </div>
          <div className="nav-item" onClick={() => navigate('/sip-calculator')}>
            <span>🧮</span> SIP Calculator
          </div>
          <div className="nav-item" onClick={() => navigate('/profile')}>
            <span>👤</span> Profile
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

export default DashboardLayout;
