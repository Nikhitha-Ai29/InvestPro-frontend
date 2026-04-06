import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/ExploreFunds.css';

const API = 'http://localhost:8081';

const FALLBACK_FUNDS = [
  { id: 1,  name: 'Axis Midcap Fund',              category: 'Mid Cap',    risk: 'High',   returns: '18.5', minInvestment: 500  },
  { id: 2,  name: 'Mirae Asset Large Cap',          category: 'Large Cap',  risk: 'Medium', returns: '14.2', minInvestment: 1000 },
  { id: 3,  name: 'HDFC Balanced Advantage Fund',   category: 'Hybrid',     risk: 'Low',    returns: '12.8', minInvestment: 500  },
  { id: 4,  name: 'SBI Small Cap Fund',             category: 'Small Cap',  risk: 'High',   returns: '22.3', minInvestment: 500  },
  { id: 5,  name: 'ICICI Pru Bluechip Fund',        category: 'Large Cap',  risk: 'Medium', returns: '15.6', minInvestment: 1000 },
  { id: 6,  name: 'Kotak Emerging Equity Fund',     category: 'Mid Cap',    risk: 'High',   returns: '19.8', minInvestment: 500  },
  { id: 7,  name: 'Nippon India Liquid Fund',       category: 'Liquid',     risk: 'Low',    returns: '6.8',  minInvestment: 500  },
  { id: 8,  name: 'DSP Tax Saver Fund (ELSS)',      category: 'ELSS',       risk: 'Medium', returns: '16.4', minInvestment: 500  },
  { id: 9,  name: 'Parag Parikh Flexi Cap Fund',    category: 'Flexi Cap',  risk: 'Medium', returns: '17.1', minInvestment: 1000 },
  { id: 10, name: 'Aditya Birla SL Debt Fund',      category: 'Debt',       risk: 'Low',    returns: '8.2',  minInvestment: 1000 },
  { id: 11, name: 'Tata Digital India Fund',        category: 'Sectoral',   risk: 'High',   returns: '24.7', minInvestment: 500  },
  { id: 12, name: 'Franklin India Feeder US Fund',  category: 'International', risk: 'High', returns: '20.1', minInvestment: 1000 },
];

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Hybrid', 'ELSS', 'Debt', 'Liquid', 'Flexi Cap', 'Sectoral', 'International'];

function ExploreFunds() {
  const navigate = useNavigate();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/funds`)
      .then(res => { if (!res.ok) throw new Error('api_error'); return res.json(); })
      .then(data => setFunds(Array.isArray(data) && data.length > 0 ? data : FALLBACK_FUNDS))
      .catch(() => setFunds(FALLBACK_FUNDS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = funds.filter(f => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="explore-funds">
        <div className="explore-header">
          <div>
            <h1>Explore Mutual Funds</h1>
            <p className="page-subtitle">Discover top-performing funds for your portfolio</p>
          </div>
          <div className="fund-count-badge">{filtered.length} Funds</div>
        </div>

        <div className="explore-controls">
          <input
            className="fund-search"
            type="text"
            placeholder="🔍  Search funds..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <div className="page-loading">Loading funds...</div>}
        {error && <div className="page-error">{error}</div>}

        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="no-results">No funds found. Try a different search or category.</div>
            ) : (
              <div className="funds-grid">
                {filtered.map((fund, index) => {
                  const risk = (fund.risk || fund.riskLevel || 'medium').toLowerCase();
                  const returns = fund.returns || fund.returnRate || '0';
                  const minInv = fund.minInvestment || fund.minimumInvestment || 500;
                  return (
                    <div key={fund.id || index} className="fund-card">
                      <div className="fund-header">
                        <div className="fund-icon">{fund.category?.charAt(0) || 'F'}</div>
                        <div className="fund-title">
                          <h3>{fund.name}</h3>
                          <span className="fund-category">{fund.category}</span>
                        </div>
                        <span className={`badge badge-${risk}`}>{fund.risk || fund.riskLevel}</span>
                      </div>

                      <div className="fund-returns-highlight">
                        <span className="returns-number">+{returns}%</span>
                        <span className="returns-label">3Y Returns</span>
                      </div>

                      <div className="fund-details">
                        <div className="fund-info">
                          <span className="info-label">Category</span>
                          <span className="info-value">{fund.category}</span>
                        </div>
                        <div className="fund-info">
                          <span className="info-label">Risk Level</span>
                          <span className={`info-value risk-${risk}`}>{fund.risk || fund.riskLevel}</span>
                        </div>
                        <div className="fund-info">
                          <span className="info-label">Min Investment</span>
                          <span className="info-value">₹{minInv.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-full"
                        onClick={() => navigate(`/invest/${encodeURIComponent(fund.name)}`)}
                      >
                        Invest Now
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ExploreFunds;
