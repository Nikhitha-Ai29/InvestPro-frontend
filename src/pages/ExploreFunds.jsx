import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/ExploreFunds.css';

const ALL_FUNDS = [
  { id: 1,  name: 'Axis Midcap Fund',              category: 'Mid Cap',       risk: 'High',   returns: 18.5, minInvestment: 500  },
  { id: 2,  name: 'Mirae Asset Large Cap',          category: 'Large Cap',     risk: 'Medium', returns: 14.2, minInvestment: 1000 },
  { id: 3,  name: 'HDFC Balanced Advantage Fund',   category: 'Hybrid',        risk: 'Low',    returns: 12.8, minInvestment: 500  },
  { id: 4,  name: 'SBI Small Cap Fund',             category: 'Small Cap',     risk: 'High',   returns: 22.3, minInvestment: 500  },
  { id: 5,  name: 'ICICI Pru Bluechip Fund',        category: 'Large Cap',     risk: 'Medium', returns: 15.6, minInvestment: 1000 },
  { id: 6,  name: 'Kotak Emerging Equity Fund',     category: 'Mid Cap',       risk: 'High',   returns: 19.8, minInvestment: 500  },
  { id: 7,  name: 'Nippon India Liquid Fund',       category: 'Liquid',        risk: 'Low',    returns: 6.8,  minInvestment: 500  },
  { id: 8,  name: 'DSP Tax Saver Fund (ELSS)',      category: 'ELSS',          risk: 'Medium', returns: 16.4, minInvestment: 500  },
  { id: 9,  name: 'Parag Parikh Flexi Cap Fund',    category: 'Flexi Cap',     risk: 'Medium', returns: 17.1, minInvestment: 1000 },
  { id: 10, name: 'Aditya Birla SL Debt Fund',      category: 'Debt',          risk: 'Low',    returns: 8.2,  minInvestment: 1000 },
  { id: 11, name: 'Tata Digital India Fund',        category: 'Sectoral',      risk: 'High',   returns: 24.7, minInvestment: 500  },
  { id: 12, name: 'Franklin India Feeder US Fund',  category: 'International', risk: 'High',   returns: 20.1, minInvestment: 1000 },
];

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Hybrid', 'ELSS', 'Debt', 'Liquid', 'Flexi Cap', 'Sectoral', 'International'];

const RISK_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const RISK_BG     = { high: '#fef2f2', medium: '#fffbeb', low: '#f0fdf4' };

function ExploreFunds() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_FUNDS.filter(f => {
    const matchCat    = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="explore-page">

        {/* ── Page heading ── */}
        <div className="explore-heading">
          <div>
            <h1>Explore Mutual Funds</h1>
            <p>Discover top-performing funds and start investing today</p>
          </div>
          <span className="total-badge">{filtered.length} Funds</span>
        </div>

        {/* ── Search ── */}
        <input
          className="fund-search-input"
          type="text"
          placeholder="Search funds by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* ── Category filter ── */}
        <div className="cat-filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'cat-btn-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Fund cards ── */}
        {filtered.length === 0 ? (
          <div className="no-funds">
            <p>😕 No funds match your search.</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="funds-grid">
            {filtered.map(fund => {
              const riskKey = fund.risk.toLowerCase();
              return (
                <div key={fund.id} className="fund-card">

                  {/* Card top strip */}
                  <div className="card-strip" style={{ background: `linear-gradient(135deg, ${RISK_COLORS[riskKey]}22, ${RISK_COLORS[riskKey]}11)` }}>
                    <div className="fund-avatar" style={{ background: RISK_COLORS[riskKey] }}>
                      {fund.category.charAt(0)}
                    </div>
                    <div className="fund-name-block">
                      <h3 className="fund-name">{fund.name}</h3>
                      <span className="fund-cat-label">{fund.category}</span>
                    </div>
                  </div>

                  {/* Returns highlight */}
                  <div className="returns-box" style={{ background: RISK_BG[riskKey] }}>
                    <span className="returns-big" style={{ color: RISK_COLORS[riskKey] }}>
                      +{fund.returns}%
                    </span>
                    <span className="returns-sub">3-Year Returns</span>
                  </div>

                  {/* Details */}
                  <div className="fund-meta">
                    <div className="meta-row">
                      <span className="meta-label">Category</span>
                      <span className="meta-value">{fund.category}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Risk</span>
                      <span className="meta-value risk-pill" style={{ color: RISK_COLORS[riskKey], background: RISK_BG[riskKey] }}>
                        {fund.risk}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Min. Investment</span>
                      <span className="meta-value">₹{fund.minInvestment.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    className="invest-btn"
                    onClick={() => navigate(`/invest/${encodeURIComponent(fund.name)}`)}
                  >
                    Invest Now →
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ExploreFunds;
