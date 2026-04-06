import { useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import '../../styles/ManageFunds.css';

const initialFunds = [
  { id: 1, name: 'Axis Midcap Fund', category: 'Mid Cap', risk: 'High', returns: '18.5%' },
  { id: 2, name: 'Mirae Asset Large Cap', category: 'Large Cap', risk: 'Medium', returns: '14.2%' },
  { id: 3, name: 'HDFC Balanced Fund', category: 'Balanced', risk: 'Low', returns: '12.8%' }
];

function ManageFunds({ setUser }) {
  const [funds, setFunds] = useState(initialFunds);
  const [showForm, setShowForm] = useState(false);
  const [newFund, setNewFund] = useState({ name: '', category: '', risk: 'Low', returns: '' });

  const handleAddFund = (e) => {
    e.preventDefault();
    const fund = { ...newFund, id: Date.now() };
    setFunds([...funds, fund]);
    setNewFund({ name: '', category: '', risk: 'Low', returns: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fund?')) {
      setFunds(funds.filter(fund => fund.id !== id));
    }
  };

  return (
    <AdminLayout setUser={setUser}>
      <div className="admin-content">
        <div className="header-row">
          <div>
            <h1>Manage Funds</h1>
            <p className="page-subtitle">Add and manage mutual funds</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Fund'}
          </button>
        </div>

        {showForm && (
          <div className="add-fund-form card">
            <h3>Add New Fund</h3>
            <form onSubmit={handleAddFund}>
              <div className="form-row">
                <div className="form-group">
                  <label>Fund Name</label>
                  <input
                    type="text"
                    value={newFund.name}
                    onChange={(e) => setNewFund({ ...newFund, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={newFund.category}
                    onChange={(e) => setNewFund({ ...newFund, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Risk Level</label>
                  <select
                    value={newFund.risk}
                    onChange={(e) => setNewFund({ ...newFund, risk: e.target.value })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Returns (%)</label>
                  <input
                    type="text"
                    value={newFund.returns}
                    onChange={(e) => setNewFund({ ...newFund, returns: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Add Fund</button>
            </form>
          </div>
        )}

        <div className="funds-grid">
          {funds.map(fund => (
            <div key={fund.id} className="fund-card card">
              <h3>{fund.name}</h3>
              <div className="fund-details">
                <div className="detail-item">
                  <span>Category:</span>
                  <span>{fund.category}</span>
                </div>
                <div className="detail-item">
                  <span>Risk:</span>
                  <span className={`badge badge-${fund.risk.toLowerCase()}`}>{fund.risk}</span>
                </div>
                <div className="detail-item">
                  <span>Returns:</span>
                  <span className="returns">{fund.returns}</span>
                </div>
              </div>
              <button className="btn-delete" onClick={() => handleDelete(fund.id)}>
                Delete Fund
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageFunds;
