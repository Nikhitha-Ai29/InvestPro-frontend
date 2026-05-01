import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/Portfolio.css';

const API = "https://investpro-backend-3.onrender.com";

function Portfolio() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const userId = stored.id;

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInvestments = () => {
    if (!userId) {
      setLoading(false);
      setError('User session not found. Please login again.');
      return;
    }

    fetch(`${API}/investments/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load investments');
        return res.json();
      })
      .then(data => setInvestments(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || 'Failed to fetch'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInvestments();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!id) {
      alert('Investment ID not found');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to remove this investment?'
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/investments/delete/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete investment');

      setInvestments(prev => prev.filter(inv => inv.id !== id));
      alert('Investment removed successfully!');
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const totalInvested = investments.reduce(
    (sum, item) => sum + (item.amount || item.investment || 0),
    0
  );

  const totalReturns = investments.reduce(
    (sum, item) => sum + (item.returns || item.expectedReturns || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="portfolio-page">
        <div className="portfolio-header">
          <div>
            <h1>My Portfolio</h1>
            <p className="page-subtitle">Track your investments and returns</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/explore')}
          >
            + Invest Funds
          </button>
        </div>

        <div className="portfolio-summary">
          <div className="summary-card">
            <h3>Total Invested</h3>
            <p className="amount">₹{totalInvested.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <h3>Expected Returns</h3>
            <p className="amount returns">₹{totalReturns.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <h3>Total Funds</h3>
            <p className="amount">{investments.length}</p>
          </div>
        </div>

        <div className="portfolio-list">
          <h2>Your Investments</h2>

          {loading && <div className="page-loading">Loading investments...</div>}

          {error && <div className="page-error">{error}</div>}

          {!loading && !error && investments.length === 0 && (
            <div className="empty-state">
              <p>No investments yet. Start exploring funds!</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/explore')}
              >
                Explore Funds
              </button>
            </div>
          )}

          {!loading && !error && investments.length > 0 && (
            <div className="investments-grid">
              {investments.map((inv, index) => (
                <div key={inv.id || index} className="investment-card card">
                  <h3>{inv.fundName || inv.fund?.name || 'Fund'}</h3>

                  <div className="investment-details">
                    <div className="detail-row">
                      <span>Type</span>
                      <span className="badge">
                        {(inv.type || inv.investmentType) === 'SIP'
                          ? 'SIP'
                          : 'One Time'}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span>Invested</span>
                      <span>
                        ₹{(inv.amount || inv.investment || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span>Expected Returns</span>
                      <span className="returns">
                        ₹{(inv.returns || inv.expectedReturns || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span>Maturity Value</span>
                      <span className="maturity">
                        ₹{(inv.maturityValue || inv.maturity || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span>Date</span>
                      <span>{inv.date || inv.createdAt || '-'}</span>
                    </div>
                  </div>

                  <div className="portfolio-actions">
                    <button
                      className="btn btn-secondary btn-invest-more"
                      onClick={() => navigate('/explore')}
                    >
                      Invest More
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(inv.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Portfolio;