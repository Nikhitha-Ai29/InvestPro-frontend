import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-brand">InvestPro</div>
        <div className="nav-buttons">
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Register</button>
        </div>
      </nav>
      
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-title">Invest Smart. Grow Secure.</h1>
          <p className="hero-subtitle">Your trusted partner in mutual fund investments. Build wealth with confidence through smart, diversified investment strategies.</p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Real-time Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure Investments</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>High Returns</span>
            </div>
          </div>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/register')}>Get Started</button>
            <button className="btn btn-secondary btn-large" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="illustration-container">
            <svg viewBox="0 0 500 400" className="finance-illustration">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              
              {/* Growth Chart */}
              <path d="M 50 300 L 100 250 L 150 280 L 200 200 L 250 220 L 300 150 L 350 100 L 400 80" 
                    stroke="url(#grad1)" strokeWidth="4" fill="none" className="chart-line"/>
              
              {/* Data Points */}
              <circle cx="50" cy="300" r="6" fill="#667eea" className="data-point"/>
              <circle cx="100" cy="250" r="6" fill="#667eea" className="data-point"/>
              <circle cx="150" cy="280" r="6" fill="#667eea" className="data-point"/>
              <circle cx="200" cy="200" r="6" fill="#667eea" className="data-point"/>
              <circle cx="250" cy="220" r="6" fill="#667eea" className="data-point"/>
              <circle cx="300" cy="150" r="6" fill="#667eea" className="data-point"/>
              <circle cx="350" cy="100" r="6" fill="#667eea" className="data-point"/>
              <circle cx="400" cy="80" r="6" fill="#667eea" className="data-point"/>
              
              {/* Percentage Badge */}
              <rect x="320" y="40" width="100" height="50" rx="10" fill="white" opacity="0.9"/>
              <text x="370" y="60" textAnchor="middle" fill="#10b981" fontSize="20" fontWeight="bold">+24.5%</text>
              <text x="370" y="78" textAnchor="middle" fill="#666" fontSize="12">Growth</text>
            </svg>
            
            <div className="stats-floating">
              <div className="stat-badge stat-badge-1">
                <div className="stat-value">₹2.5Cr+</div>
                <div className="stat-label">Invested</div>
              </div>
              <div className="stat-badge stat-badge-2">
                <div className="stat-value">10K+</div>
                <div className="stat-label">Users</div>
              </div>
              <div className="stat-badge stat-badge-3">
                <div className="stat-value">18.5%</div>
                <div className="stat-label">Avg Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
