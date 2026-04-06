import { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/SIPCalculator.css';

function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [rateOfReturn, setRateOfReturn] = useState('12');
  const [years, setYears] = useState('');

  const calculateSIP = () => {
    const P = parseFloat(monthlyAmount) || 0;
    const r = (parseFloat(rateOfReturn) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;

    if (P === 0 || n === 0) {
      return {
        investment: 0,
        returns: 0,
        maturity: 0
      };
    }

    const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const investment = P * n;
    const returns = maturity - investment;

    return {
      investment,
      returns,
      maturity
    };
  };

  const result = calculateSIP();

  return (
    <DashboardLayout>
      <div className="sip-calculator">
        <h1>SIP Calculator</h1>
        <p className="page-subtitle">Calculate your SIP returns and plan your investments</p>

        <div className="calculator-container">
          <div className="calculator-form card">
            <div className="form-group">
              <label>Monthly Investment Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter monthly amount"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Expected Rate of Return (% per annum)</label>
              <input
                type="number"
                placeholder="Enter rate of return"
                value={rateOfReturn}
                onChange={(e) => setRateOfReturn(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Investment Duration (Years)</label>
              <input
                type="number"
                placeholder="Enter duration in years"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>

            <div className="results-section">
              <h3>Investment Results</h3>
              <div className="result-item">
                <span>Total Investment</span>
                <span className="result-value">₹{result.investment.toFixed(2)}</span>
              </div>
              <div className="result-item">
                <span>Estimated Returns</span>
                <span className="result-value returns">₹{result.returns.toFixed(2)}</span>
              </div>
              <div className="result-item highlight">
                <span>Maturity Amount</span>
                <span className="result-value maturity">₹{result.maturity.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SIPCalculator;
