import AdminLayout from '../../layout/AdminLayout';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import '../../styles/AdminDashboard.css';

const userGrowth = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1800 },
  { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 3200 },
  { month: 'May', users: 4100 },
  { month: 'Jun', users: 5300 }
];

const investmentDist = [
  { name: 'Equity Funds', value: 45 },
  { name: 'Debt Funds', value: 30 },
  { name: 'Hybrid Funds', value: 25 }
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 450000 },
  { month: 'Feb', revenue: 520000 },
  { month: 'Mar', revenue: 680000 },
  { month: 'Apr', revenue: 750000 },
  { month: 'May', revenue: 890000 },
  { month: 'Jun', revenue: 1020000 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

function AdminDashboard({ setUser }) {
  const displayName = localStorage.getItem('userName') || 'Admin';
  return (
    <AdminLayout setUser={setUser}>
      <div className="admin-content">
        <h1>Welcome, {displayName}! 👋</h1>
        <p className="page-subtitle">Platform analytics and insights</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">5,342</p>
            <span className="stat-change positive">+12.5%</span>
          </div>
          <div className="stat-card">
            <h3>Total Investments</h3>
            <p className="stat-value">₹12.5Cr</p>
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
