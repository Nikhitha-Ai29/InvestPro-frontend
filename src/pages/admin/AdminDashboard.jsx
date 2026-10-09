import AdminLayout from '../../layout/AdminLayout';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Cell, ResponsiveContainer
} from 'recharts';
import '../../styles/AdminDashboard.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

function AdminDashboard({ setUser }) {
  const stored      = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const displayName = stored.name || 'Admin';

  // Read real registered users from local registry
  const registeredUsers = (() => {
    try { return JSON.parse(localStorage.getItem('investproUsers') || '[]'); } catch { return []; }
  })();

  const totalUsers = registeredUsers.length || 5342;

  // Sum all investments across all users
  const totalInvested = registeredUsers.reduce((sum, u) => {
    try {
      const portfolio = JSON.parse(localStorage.getItem(`portfolio_${u.id}`) || '[]');
      return sum + portfolio.reduce((s, i) => s + Number(i.investment || 0), 0);
    } catch { return sum; }
  }, 0);

  const displayInvested = totalInvested > 0
    ? `₹${(totalInvested / 10000000).toFixed(2)}Cr`
    : '₹12.5Cr';

  const userGrowth = [
    { month: 'Jan', users: Math.round(totalUsers * 0.50) },
    { month: 'Feb', users: Math.round(totalUsers * 0.60) },
    { month: 'Mar', users: Math.round(totalUsers * 0.70) },
    { month: 'Apr', users: Math.round(totalUsers * 0.80) },
    { month: 'May', users: Math.round(totalUsers * 0.90) },
    { month: 'Jun', users: totalUsers },
  ];

  const investmentDist = [
    { name: 'Equity Funds', value: 45 },
    { name: 'Debt Funds',   value: 30 },
    { name: 'Hybrid Funds', value: 25 },
  ];

  const base = totalInvested > 0 ? totalInvested : 4000000;
  const monthlyRevenue = [
    { month: 'Jan', revenue: Math.round(base * 0.20) },
    { month: 'Feb', revenue: Math.round(base * 0.30) },
    { month: 'Mar', revenue: Math.round(base * 0.45) },
    { month: 'Apr', revenue: Math.round(base * 0.60) },
    { month: 'May', revenue: Math.round(base * 0.78) },
    { month: 'Jun', revenue: Math.round(base) },
  ];

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0 });

  return (
    <AdminLayout setUser={setUser}>
      <div className="admin-content">
        <h1>Welcome, {displayName}! 👋</h1>
        <p className="page-subtitle">Platform analytics and insights</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{totalUsers.toLocaleString('en-IN')}</p>
            <span className="stat-change positive">+12.5%</span>
          </div>
          <div className="stat-card">
            <h3>Total Investments</h3>
            <p className="stat-value">{displayInvested}</p>
            <span className="stat-change positive">+18.2%</span>
          </div>
          <div className="stat-card">
            <h3>Total Funds</h3>
            <p className="stat-value">48</p>
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
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Investment Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={investmentDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {investmentDist.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
