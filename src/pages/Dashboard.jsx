import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Cell, ResponsiveContainer
} from 'recharts';
import '../styles/Dashboard.css';

const API = "https://investpro-backend-3.onrender.com";
const COLORS = ['#667eea', '#10b981', '#f59e0b'];

function Dashboard({ user, setUser }) {
  const displayName = user?.name || localStorage.getItem('userName') || 'User';
  const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const userId = stored.id;

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${API}/investments/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load investments');
        return res.json();
      })
      .then(data => {
        setInvestments(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(err => {
        console.error('❌ Dashboard fetch error:', err);
        // Show empty state instead of error - user can still use app
        setInvestments([]);
        setError('Unable to load investments. Displaying sample data.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const totalInvested = investments.reduce(
    (sum, item) => sum + (item.amount || item.investment || 0),
    0
  );

  const totalReturns = investments.reduce(
    (sum, item) => sum + (item.returns || item.expectedReturns || 0),
    0
  );

  const currentValue = totalInvested + totalReturns;
  const returnPercentage =
    totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : 0;

  const portfolioData = [
    { month: 'Jan', value: currentValue * 0.7 },
    { month: 'Feb', value: currentValue * 0.75 },
    { month: 'Mar', value: currentValue * 0.8 },
    { month: 'Apr', value: currentValue * 0.85 },
    { month: 'May', value: currentValue * 0.9 },
    { month: 'Jun', value: currentValue }
  ];

  const assetData = [
    { name: 'Equity', value: 45 },
    { name: 'Debt', value: 30 },
    { name: 'Hybrid', value: 25 }
  ];

  const monthlyInvestment = [
    { month: 'Jan', amount: totalInvested * 0.15 },
    { month: 'Feb', amount: totalInvested * 0.18 },
    { month: 'Mar', amount: totalInvested * 0.16 },
    { month: 'Apr', amount: totalInvested * 0.20 },
    { month: 'May', amount: totalInvested * 0.17 },
    { month: 'Jun', amount: totalInvested * 0.14 }
  ];

  if (loading) {
    return (
      <DashboardLayout user={user} setUser={setUser}>
        <div className="dashboard-content">
          <p>Loading investments...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} setUser={setUser}>
      <div className="dashboard-content">
        <h1 className="welcome-title">Welcome back, {displayName}! 👋</h1>
        <p className="welcome-subtitle">Here's your investment overview</p>

        {error && <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '15px', color: '#856404' }}>⚠️ {error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Invested</h3>
            <p className="stat-value">₹{totalInvested.toFixed(2)}</p>
            <span className="stat-label">Current Value</span>
          </div>

          <div className="stat-card">
            <h3>Current Value</h3>
            <p className="stat-value">₹{currentValue.toFixed(2)}</p>
            <span className="stat-label">Portfolio Worth</span>
          </div>

          <div className="stat-card">
            <h3>Total Profit</h3>
            <p className="stat-value profit">₹{totalReturns.toFixed(2)}</p>
            <span className="stat-label">Gains</span>
          </div>

          <div className="stat-card">
            <h3>Return %</h3>
            <p className="stat-value profit">+{returnPercentage}%</p>
            <span className="stat-label">Overall Return</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Portfolio Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#667eea"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card full-width">
            <h3>Monthly Investment</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyInvestment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;