import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Cell, ResponsiveContainer
} from 'recharts';
import '../styles/Dashboard.css';

const API           = import.meta.env.VITE_API_URL || 'https://investpro-backend.onrender.com';
const PORTFOLIO_KEY = (id) => `portfolio_${id}`;
const COLORS        = ['#667eea', '#10b981', '#f59e0b'];

function Dashboard({ user, setUser }) {
  const stored      = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const displayName = stored.name || user?.name || 'Investor';
  const userId      = stored.id;

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadLocal = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(PORTFOLIO_KEY(userId)) || '[]');
        return Array.isArray(saved) ? saved : [];
      } catch { return []; }
    };

    fetch(`${API}/investments/user/${userId}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        const remote = Array.isArray(data) ? data : [];
        setInvestments(remote.length ? remote : loadLocal());
      })
      .catch(() => setInvestments(loadLocal()))
      .finally(() => setLoading(false));
  }, [userId]); // eslint-disable-line

  const totalInvested    = investments.reduce((s, i) => s + Number(i.investment || i.amount || 0), 0);
  const totalReturns     = investments.reduce((s, i) => s + Number(i.returns || 0), 0);
  const currentValue     = investments.reduce((s, i) => s + Number(i.maturityValue || 0), 0) || totalInvested + totalReturns;
  const returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : '0.0';

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const portfolioData = [
    { month: 'Jan', value: Math.round(currentValue * 0.70) },
    { month: 'Feb', value: Math.round(currentValue * 0.75) },
    { month: 'Mar', value: Math.round(currentValue * 0.80) },
    { month: 'Apr', value: Math.round(currentValue * 0.85) },
    { month: 'May', value: Math.round(currentValue * 0.92) },
    { month: 'Jun', value: Math.round(currentValue) },
  ];

  const assetData = [
    { name: 'Equity',  value: 45 },
    { name: 'Debt',    value: 30 },
    { name: 'Hybrid',  value: 25 },
  ];

  const monthlyInvestment = [
    { month: 'Jan', amount: Math.round(totalInvested * 0.15) },
    { month: 'Feb', amount: Math.round(totalInvested * 0.18) },
    { month: 'Mar', amount: Math.round(totalInvested * 0.16) },
    { month: 'Apr', amount: Math.round(totalInvested * 0.20) },
    { month: 'May', amount: Math.round(totalInvested * 0.17) },
    { month: 'Jun', amount: Math.round(totalInvested * 0.14) },
  ];

  if (loading) {
    return (
      <DashboardLayout user={user} setUser={setUser}>
        <div className="page-loading">Loading your dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} setUser={setUser}>
      <div className="dashboard-content">
        <h1 className="welcome-title">Welcome back, {displayName}! 👋</h1>
        <p className="welcome-subtitle">Here's your investment overview.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Invested</h3>
            <p className="stat-value">{fmt(totalInvested)}</p>
            <span className="stat-label">Amount Invested</span>
          </div>
          <div className="stat-card">
            <h3>Current Value</h3>
            <p className="stat-value">{fmt(currentValue)}</p>
            <span className="stat-label">Portfolio Worth</span>
          </div>
          <div className="stat-card">
            <h3>Total Profit</h3>
            <p className="stat-value profit">{fmt(totalReturns)}</p>
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
                <Tooltip formatter={(v) => fmt(v)} />
                <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={assetData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {assetData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="amount" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
