import AdminLayout from '../../layout/AdminLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/Reports.css';

const performanceData = [
  { month: 'Jan', users: 1200, investments: 450000, revenue: 45000 },
  { month: 'Feb', users: 1800, investments: 520000, revenue: 52000 },
  { month: 'Mar', users: 2400, investments: 680000, revenue: 68000 },
  { month: 'Apr', users: 3200, investments: 750000, revenue: 75000 },
  { month: 'May', users: 4100, investments: 890000, revenue: 89000 },
  { month: 'Jun', users: 5300, investments: 1020000, revenue: 102000 }
];

function Reports({ setUser }) {
  return (
    <AdminLayout setUser={setUser}>
      <div className="admin-content">
        <h1>Reports & Analytics</h1>
        <p className="page-subtitle">Detailed platform performance reports</p>

        <div className="report-cards">
          <div className="report-card">
            <h3>User Acquisition</h3>
            <div className="report-value">5,342</div>
            <div className="report-change positive">+24.5% from last month</div>
          </div>
          <div className="report-card">
            <h3>Total AUM</h3>
            <div className="report-value">₹12.5Cr</div>
            <div className="report-change positive">+18.2% from last month</div>
          </div>
          <div className="report-card">
            <h3>Revenue</h3>
            <div className="report-value">₹1.02L</div>
            <div className="report-change positive">+14.6% from last month</div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card full-width">
            <h3>Platform Performance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card full-width">
            <h3>Investment Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="investments" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reports;
