import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/InvestFund.css';

const API           = import.meta.env.VITE_API_URL || 'https://investpro-backend.onrender.com';
const PORTFOLIO_KEY = (id) => `portfolio_${id}`;

function InvestFund() {
  const { fundName } = useParams();
  const navigate     = useNavigate();
  const decodedName  = decodeURIComponent(fundName);

  const [investmentType, setInvestmentType] = useState('oneTime');
  const [amount, setAmount]               = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [duration, setDuration]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');

  const calcReturns = () => {
    const rate = 0.12;
    if (investmentType === 'oneTime') {
      const p = parseFloat(amount) || 0;
      const m = p * Math.pow(1 + rate, 3);
      return { investment: p, returns: m - p, maturity: m };
    }
    const monthly = parseFloat(monthlyAmount) || 0;
    const years   = parseFloat(duration) || 0;
    const months  = years * 12;
    const mr      = rate / 12;
    const m       = months > 0 ? monthly * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr) : 0;
    return { investment: monthly * months, returns: m - monthly * months, maturity: m };
  };

  const saveToLocal = (userId, entry) => {
    const key = PORTFOLIO_KEY(userId);
    let list = [];
    try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch { list = []; }
    localStorage.setItem(key, JSON.stringify([...list, entry]));
  };

  const handleAdd = async () => {
    const calc   = calcReturns();
    const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
    const userId = stored.id;

    if (!userId) { setError('Session expired. Please sign in again.'); return; }

    if (investmentType === 'oneTime' && parseFloat(amount) <= 0) {
      setError('Please enter a valid investment amount.'); return;
    }
    if (investmentType === 'sip') {
      if (parseFloat(monthlyAmount) <= 0) { setError('Please enter a valid monthly amount.'); return; }
      if (parseFloat(duration) <= 0)      { setError('Please enter a valid duration.'); return; }
    }

    const payload = {
      id:            Date.now(),
      userId,
      fundName:      decodedName,
      type:          investmentType === 'oneTime' ? 'ONE_TIME' : 'SIP',
      amount:        parseFloat(investmentType === 'oneTime' ? amount : monthlyAmount) || 0,
      duration:      investmentType === 'sip' ? parseFloat(duration) || 0 : null,
      investment:    calc.investment,
      returns:       calc.returns,
      maturityValue: calc.maturity,
      date:          new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setLoading(true);
    setError('');

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
      saveToLocal(userId, payload);
    }

    setSuccess(`✅ Investment in ${decodedName} added to your portfolio!`);
    setTimeout(() => navigate('/portfolio'), 1500);
    setLoading(false);
  };

  const calc      = calcReturns();
  const hasAmount = investmentType === 'oneTime'
    ? parseFloat(amount) > 0
    : parseFloat(monthlyAmount) > 0 && parseFloat(duration) > 0;

  const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

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
                <input type="number" placeholder="e.g. 25000" min="1"
                  value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Monthly SIP Amount (₹)</label>
                  <input type="number" placeholder="e.g. 5000" min="1"
                    value={monthlyAmount} onChange={e => { setMonthlyAmount(e.target.value); setError(''); }} />
                </div>
                <div className="form-group">
                  <label>Investment Duration (Years)</label>
                  <input type="number" placeholder="e.g. 5" min="1" max="30"
                    value={duration} onChange={e => { setDuration(e.target.value); setError(''); }} />
                </div>
              </>
            )}

            {hasAmount && (
              <div className="calculation-summary">
                <h3>Investment Summary</h3>
                <div className="summary-item">
                  <span>Total Investment</span>
                  <span className="summary-value">₹{fmt(calc.investment)}</span>
                </div>
                <div className="summary-item">
                  <span>Estimated Returns (12% p.a.)</span>
                  <span className="summary-value returns">₹{fmt(calc.returns)}</span>
                </div>
                <div className="summary-item">
                  <span>Estimated Maturity Value</span>
                  <span className="summary-value maturity">₹{fmt(calc.maturity)}</span>
                </div>
              </div>
            )}

            <div className="action-buttons">
              {error   && <p className="page-error">{error}</p>}
              {success && <p className="page-success">{success}</p>}
              {!success && (
                <>
                  <button className="btn btn-primary" onClick={handleAdd}
                    disabled={loading || !hasAmount}>
                    {loading ? 'Adding to Portfolio...' : 'Add to Portfolio'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/explore')}
                    disabled={loading}>
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
