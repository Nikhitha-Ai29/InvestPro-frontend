import { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import '../../styles/AdminDashboard.css';

const API_URL = "https://investpro-backend-3.onrender.com/auth";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

function AdminDashboard({ setUser }) {
  const displayName = localStorage.getItem('userName') || 'Admin';
  const [stats, setStats] = useState({ totalUsers: 0, totalInvestments: 0, totalFunds: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch admin stats from backend
    Promise.all([
      fetch(`${API}/users`).then(r => r.json()).catch(() => []),
      fetch(`${API}/investments`).then(r => r.json()).catch(() => []),
      fetch(`${API}/funds`).then(r => r.json()).catch(() => [])
    ])
    .then(([users, investments, funds]) => {
      const totalInv = Array.isArray(investments) ? investments.reduce((sum, inv) => sum + (inv.amount || 0), 0) : 0;
      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalInvestments: totalInv,
        totalFunds: Array.isArray(funds) ? funds.length : 0
      });
    })
    .finally(() => setLoading(false));
  }, []);

  // Mock data for charts
  const userGrowth = [
    { month: 'Jan', users: stats.totalUsers * 0.5 },
    { month: 'Feb', users: stats.totalUsers * 0.6 },
    { month: 'Mar', users: stats.totalUsers * 0.7 },
    { month: 'Apr', users: stats.totalUsers * 0.8 },
    { month: 'May', users: stats.totalUsers * 0.9 },
    { month: 'Jun', users: stats.totalUsers }
  ];

  const investmentDist = [
    { name: 'Equity Funds', value: 45 },
    { name: 'Debt Funds', value: 30 },
    { name: 'Hybrid Funds', value: 25 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: stats.totalInvestments * 0.2 },
    { month: 'Feb', revenue: stats.totalInvestments * 0.3 },
    { month: 'Mar', revenue: stats.totalInvestments * 0.4 },
    { month: 'Apr', revenue: stats.totalInvestments * 0.5 },
    { month: 'May', revenue: stats.totalInvestments * 0.7 },
    { month: 'Jun', revenue: stats.totalInvestments }
  ];

  if (loading) return <AdminLayout setUser={setUser}><div className="admin-content"><p>Loading...</p></div></AdminLayout>;
  return (
    <AdminLayout setUser={setUser}>
      <div className="admin-content">
        <h1>Welcome, {displayName}! 👋</h1>
        <p className="page-subtitle">Platform analytics and insights</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <span className="stat-change positive">Active</span>
          </div>
          <div className="stat-card">
            <h3>Total Investments</h3>
            <p className="stat-value">₹{(stats.totalInvestments / 10000000).toFixed(1)}Cr</p>
            <span className="stat-change positive">+18.2%</span>
          </div>
          <div className="stat-card">
            <h3>Total Funds</h3>
            <p className="stat-value">{stats.totalFunds}</p>
            <span className="stat-change">Active</span>
          </div>
          <div className="stat-card">
            <h3>Monthly Growth</h3>
            <p className="stat-value">24.8%</p>
            <span className="stat-change positive">+5.3%</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>User Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Investment Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={investmentDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {investmentDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card full-width">
            <h3>Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
