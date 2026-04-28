import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/InvestFund.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

function InvestFund() {
  const { fundName } = useParams();
  const navigate = useNavigate();
  const [investmentType, setInvestmentType] = useState('oneTime');
  const [amount, setAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateReturns = () => {
    const rate = 0.12; // 12% annual return
    
    if (investmentType === 'oneTime') {
      const principal = parseFloat(amount) || 0;
      const years = 3;
      const maturity = principal * Math.pow(1 + rate, years);
      return {
        investment: principal,
        returns: maturity - principal,
        maturity: maturity
      };
    } else {
      const monthly = parseFloat(monthlyAmount) || 0;
      const years = parseFloat(duration) || 0;
      const months = years * 12;
      const monthlyRate = rate / 12;
      const maturity = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const investment = monthly * months;
      return {
        investment: investment,
        returns: maturity - investment,
        maturity: maturity
      };
    }
  };

  const handleAddToPortfolio = async () => {
    const calc = calculateReturns();
    const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
    const userId = stored.id;

    if (!userId) {
      setError('User session not found. Please login again.');
      return;
    }

    const payload = {
      userId,
      fundName: decodeURIComponent(fundName),
      type: investmentType === 'oneTime' ? 'ONE_TIME' : 'SIP',
      amount: parseFloat(investmentType === 'oneTime' ? amount : monthlyAmount) || 0,
      duration: investmentType === 'sip' ? parseFloat(duration) || 0 : null,
      investment: calc.investment,
      returns: calc.returns,
      maturityValue: calc.maturity,
      date: new Date().toISOString().split('T')[0],
    };

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/investments/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add investment');
      alert('Investment added to portfolio successfully!');
      navigate('/portfolio');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calc = calculateReturns();

  return (
    <DashboardLayout>
      <div className="invest-fund">
        <h1>Invest in {decodeURIComponent(fundName)}</h1>
        <p className="page-subtitle">Choose your investment plan</p>

        <div className="invest-container">
          <div className="invest-form card">
            <div className="investment-type">
              <button
                className={`type-btn ${investmentType === 'oneTime' ? 'active' : ''}`}
                onClick={() => setInvestmentType('oneTime')}
              >
                One Time
              </button>
              <button
                className={`type-btn ${investmentType === 'sip' ? 'active' : ''}`}
                onClick={() => setInvestmentType('sip')}
              >
                SIP
              </button>
            </div>

            {investmentType === 'oneTime' ? (
              <div className="form-group">
                <label>Investment Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Monthly Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter monthly amount"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Years)</label>
                  <input
                    type="number"
                    placeholder="Enter duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="calculation-summary">
              <h3>Investment Summary</h3>
              <div className="summary-item">
                <span>Total Investment</span>
                <span className="summary-value">₹{calc.investment.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Estimated Returns</span>
                <span className="summary-value returns">₹{calc.returns.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Estimated Maturity</span>
                <span className="summary-value maturity">₹{calc.maturity.toFixed(2)}</span>
              </div>
            </div>

            <div className="action-buttons">
              {error && <p className="page-error">{error}</p>}
              <button className="btn btn-primary" onClick={handleAddToPortfolio} disabled={loading}>
                {loading ? 'Adding...' : 'Add to Portfolio'}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/explore')} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InvestFund;
