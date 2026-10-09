import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/Portfolio.css';

const API           = import.meta.env.VITE_API_URL || 'https://investpro-backend.onrender.com';
const PORTFOLIO_KEY = (id) => `portfolio_${id}`;

function Portfolio() {
  const navigate = useNavigate();
  const stored   = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const userId   = stored.id;

  const [investments, setInvestments]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    fetch(`${API}/investments/user/${userId}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        const remote = Array.isArray(data) ? data : [];
        const local  = loadLocal();
        // Merge: remote wins on same id
        const map = new Map(local.map(i => [String(i.id), i]));
        remote.forEach(i => map.set(String(i.id), i));
        const merged = [...map.values()];
        setInvestments(merged);
        saveLocal(merged);
      })
      .catch(() => setInvestments(loadLocal()))
      .finally(() => setLoading(false));
  }, [userId]); // eslint-disable-line

  const loadLocal = () => {
    try { return JSON.parse(localStorage.getItem(PORTFOLIO_KEY(userId)) || '[]'); }
    catch { return []; }
  };

  const saveLocal = (list) =>
    localStorage.setItem(PORTFOLIO_KEY(userId), JSON.stringify(list));

  const handleDelete = async () => {
    const inv = deleteTarget;
    setDeleteTarget(null);
    try {
      await fetch(`${API}/investments/delete/${inv.id}`, { method: 'DELETE' });
    } catch { /* update locally regardless */ }
    const updated = investments.filter(i => i.id !== inv.id);
    setInvestments(updated);
    saveLocal(updated);
  };

  const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const totalInvested = investments.reduce((s, i) => s + Number(i.investment || 0), 0);
  const totalReturns  = investments.reduce((s, i) => s + Number(i.returns    || 0), 0);
  const totalMaturity = investments.reduce((s, i) => s + Number(i.maturityValue || 0), 0);

  return (
    <DashboardLayout>
      <div className="portfolio-page">

        <div className="portfolio-header">
          <div>
            <h1>My Portfolio</h1>
            <p className="page-subtitle">Track your investments and returns</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/explore')}>
            + Invest More
          </button>
        </div>

        {investments.length > 0 && (
          <div className="portfolio-summary">
            <div className="summary-card">
              <h3>Total Invested</h3>
              <p className="amount">{fmt(totalInvested)}</p>
            </div>
            <div className="summary-card">
              <h3>Expected Returns</h3>
              <p className="amount returns">{fmt(totalReturns)}</p>
            </div>
            <div className="summary-card">
              <h3>Maturity Value</h3>
              <p className="amount maturity">{fmt(totalMaturity)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Funds</h3>
              <p className="amount">{investments.length}</p>
            </div>
          </div>
        )}

        <div className="portfolio-list">
          <h2>Your Investments</h2>

          {loading && <div className="page-loading">Loading your portfolio...</div>}

          {!loading && investments.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No investments yet</h3>
              <p>
                Explore mutual funds and click <strong>Invest Now</strong> to start
                building your portfolio.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/explore')}>
                Explore Funds
              </button>
            </div>
          )}

          {!loading && investments.length > 0 && (
            <div className="investments-grid">
              {investments.map((inv, index) => {
                const isSIP = (inv.type || '').toUpperCase() === 'SIP';
                return (
                  <div key={inv.id || index} className="investment-card card">
                    <div className="inv-card-header">
                      <div className="inv-fund-info">
                        <div className="inv-avatar">
                          {(inv.fundName || 'F').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3>{inv.fundName || 'Fund'}</h3>
                          <span className={`inv-type-badge ${isSIP ? 'sip' : 'onetime'}`}>
                            {isSIP ? 'SIP' : 'One Time'}
                          </span>
                        </div>
                      </div>
                      <button
                        className="inv-delete-btn"
                        onClick={() => setDeleteTarget(inv)}
                        title="Remove investment"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="investment-details">
                      <div className="detail-row">
                        <span>Amount Invested</span>
                        <span>{fmt(inv.investment)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Expected Returns</span>
                        <span className="returns">{fmt(inv.returns)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Maturity Value</span>
                        <span className="maturity">{fmt(inv.maturityValue)}</span>
                      </div>
                      {isSIP && inv.duration && (
                        <div className="detail-row">
                          <span>Duration</span>
                          <span>{inv.duration} {inv.duration === 1 ? 'Year' : 'Years'}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span>Date</span>
                        <span>{inv.date || inv.createdAt || '-'}</span>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary btn-invest-more"
                      onClick={() => navigate(`/invest/${encodeURIComponent(inv.fundName || '')}`)}
                    >
                      Invest More
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3>Remove Investment?</h3>
            <p>
              Are you sure you want to remove your investment in{' '}
              <strong>{deleteTarget.fundName}</strong>? This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Remove</button>
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Portfolio;
