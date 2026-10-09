import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/InvestFund.css';

const API           = import.meta.env.VITE_API_URL || 'https://investpro-backend.onrender.com';
const PORTFOLIO_KEY = (userId) => `portfolio_${userId}`;

function InvestFund() {
  const { fundName } = useParams();
  const navigate     = useNavigate();

  const [investmentType, setInvestmentType] = useState('oneTime');
  const [amount, setAmount]               = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [duration, setDuration]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');

  const decodedName = decodeURIComponent(fundName);

  const calculateReturns = () => {
    const rate = 0.12;
    if (investmentType === 'oneTime') {
      const principal = parseFloat(amount) || 0;
      const maturity  = principal * Math.pow(1 + rate, 3);
      return { investment: principal, returns: maturity - principal, maturity };
    }
    const monthly     = parseFloat(monthlyAmount) || 0;
    const years       = parseFloat(duration) || 0;
    const months      = years * 12;
    const monthlyRate = rate / 12;
    const maturity    = months > 0
      ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      : 0;
    return { investment: monthly * months, returns: maturity - monthly * months, maturity };
  };

  const handleAddToPortfolio = async () => {
    const calc   = calculateReturns();
    const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
    const userId = stored.id;

    if (!userId) { setError('Session expired. Please login again.'); return; }

    // Validate inputs
    if (investmentType === 'oneTime' && (!amount || parseFloat(amount) <= 0)) {
      setError('Please enter a valid investment amount.'); return;
    }
    if (investmentType === 'sip') {
      if (!monthlyAmount || parseFloat(monthlyAmount) <= 0) {
        setError('Please enter a valid monthly amount.'); return;
      }
      if (!duration || parseFloat(duration) <= 0) {
        setError('Please enter a valid duration.'); return;
      }
    }

    const payload = {
      id:           Date.now(),
      userId,
      fundName:     decodedName,
      type:         investmentType === 'oneTime' ? 'ONE_TIME' : 'SIP',
      amount:       parseFloat(investmentType === 'oneTime' ? amount : monthlyAmount) || 0,
      duration:     investmentType === 'sip' ? parseFloat(duration) || 0 : null,
      investment:   calc.investment,
      returns:      calc.returns,
      maturityValue: calc.maturity,
      date:         new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setLoading(true);
    setError('');

    // Try backend
    try {
      const res = await fetch(`${API}/investments/add`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json().catch(() => payload);
      saveToLocal(userId, { ...payload, id: saved.id || payload.id });
    } catch {
      // Backend unavailable — save locally
      saveToLocal(userId, payload);
    }

    setSuccess(`✅ Investment in ${decodedName} added to your portfolio!`);
    setTimeout(() => navigate('/portfolio'), 1600);
    setLoading(false);
  };

  const saveToLocal = (userId, entry) => {
    const key      = PORTFOLIO_KEY(userId);
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...existing, entry]));
  };

  const calc = calculateReturns();
  const hasAmount = investmentType === 'oneTime'
    ? parseFloat(amount) > 0
    : parseFloat(monthlyAmount) > 0 && parseFloat(duration) > 0;

  return (
    <DashboardLayout>
      <div className="invest-fund">
        <div className="invest-fund-header">
          <button className="back-btn" onClick={() => navigate('/explore')}>← Back to Explore</button>
          <h1>Invest in {decodedName}</h1>
          <p className="page-subtitle">Choose your investment type and enter the amount</p>
        </div>

        <div className="invest-container">
          <div className="invest-form card">

            {/* Type toggle */}
            <div className="investment-type">
              <button
                className={`type-btn ${investmentType === 'oneTime' ? 'active' : ''}`}
                onClick={() => { setInvestmentType('oneTime'); setError(''); }}
              >
                One Time
              </button>
              <button
                className={`type-btn ${investmentType === 'sip' ? 'active' : ''}`}
                onClick={() => { setInvestmentType('sip'); setError(''); }}
              >
                SIP (Monthly)
              </button>
            </div>

            {investmentType === 'oneTime' ? (
              <div className="form-group">
                <label>Investment Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  min="1"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setError(''); }}
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Monthly SIP Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    min="1"
                    value={monthlyAmount}
                    onChange={e => { setMonthlyAmount(e.target.value); setError(''); }}
                  />
                </div>
                <div className="form-group">
                  <label>Investment Duration (Years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={e => { setDuration(e.target.value); setError(''); }}
                  />
                </div>
              </>
            )}

            {/* Live summary — only show when values are entered */}
            {hasAmount && (
              <div className="calculation-summary">
                <h3>Investment Summary</h3>
                <div className="summary-item">
                  <span>Total Investment</span>
                  <span className="summary-value">
                    ₹{calc.investment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Estimated Returns (12% p.a.)</span>
                  <span className="summary-value returns">
                    ₹{calc.returns.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Estimated Maturity Value</span>
                  <span className="summary-value maturity">
                    ₹{calc.maturity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            <div className="action-buttons">
              {error   && <p className="page-error">{error}</p>}
              {success && <p className="page-success">{success}</p>}
              {!success && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddToPortfolio}
                    disabled={loading || !hasAmount}
                  >
                    {loading ? 'Adding to Portfolio...' : 'Add to Portfolio'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/explore')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InvestFund;
