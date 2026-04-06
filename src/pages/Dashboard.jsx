import DashboardLayout from '../layout/DashboardLayout';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const portfolioData = [
  { month: 'Jan', value: 50000 },
  { month: 'Feb', value: 55000 },
  { month: 'Mar', value: 58000 },
  { month: 'Apr', value: 62000 },
  { month: 'May', value: 68000 },
  { month: 'Jun', value: 75000 }
];

const assetData = [
  { name: 'Equity', value: 45 },
  { name: 'Debt', value: 30 },
  { name: 'Hybrid', value: 25 }
];

const monthlyInvestment = [
  { month: 'Jan', amount: 10000 },
  { month: 'Feb', amount: 12000 },
  { month: 'Mar', amount: 11000 },
  { month: 'Apr', amount: 15000 },
  { month: 'May', amount: 13000 },
  { month: 'Jun', amount: 14000 }
];

const COLORS = ['#667eea', '#10b981', '#f59e0b'];

function Dashboard({ user, setUser }) {
  const displayName = user?.name || localStorage.getItem('userName') || 'User';
  return (
    <DashboardLayout user={user} setUser={setUser}>
      <div className="dashboard-content">
        <h1 className="welcome-title">Welcome back, {displayName}! 👋</h1>
        <p className="welcome-subtitle">Here's your investment overview</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Invested</h3>
            <p className="stat-value">₹75,000</p>
            <span className="stat-label">Current Value</span>
          </div>
          <div className="stat-card">
            <h3>Current Value</h3>
            <p className="stat-value">₹86,250</p>
            <span className="stat-label">Portfolio Worth</span>
          </div>
          <div className="stat-card">
            <h3>Total Profit</h3>
            <p className="stat-value profit">₹11,250</p>
            <span className="stat-label">Gains</span>
          </div>
          <div className="stat-card">
            <h3>Return %</h3>
            <p className="stat-value profit">+15.0%</p>
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
                <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={assetData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
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
