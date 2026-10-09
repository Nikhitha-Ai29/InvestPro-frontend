import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { isDemoSession } from '../services/authService';
import '../styles/Profile.css';

const API = import.meta.env.VITE_API_URL || 'https://investpro-backend.onrender.com';

function Profile({ user }) {
  const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const userId = stored.id || user?.id;
  const isDemo = isDemoSession();

  const fallbackProfile = {
    name:             stored.name  || user?.name  || 'User',
    email:            stored.email || user?.email || '',
    role:             stored.role  || user?.role  || 'USER',
    riskPreference:   'Medium',
    investmentGoal:   'Wealth Creation',
  };

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(!isDemo);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    if (isDemo || !userId) {
      setProfile(fallbackProfile);
      setEditData(fallbackProfile);
      setLoading(false);
      return;
    }
    fetch(`${API}/users/profile/${userId}`)
      .then(res => { if (!res.ok) throw new Error('server'); return res.json(); })
      .then(data => {
        const p = { ...fallbackProfile, ...data };
        setProfile(p);
        setEditData({ name: p.name, email: p.email, riskPreference: p.riskPreference || 'Medium', investmentGoal: p.investmentGoal || 'Wealth Creation' });
      })
      .catch(() => {
        setBackendDown(true);
        setProfile(fallbackProfile);
        setEditData(fallbackProfile);
      })
      .finally(() => setLoading(false));
  }, [userId, isDemo]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    localStorage.setItem('userName', editData.name);
    localStorage.setItem('userEmail', editData.email);
    localStorage.setItem('investproUser', JSON.stringify({ ...stored, name: editData.name, email: editData.email }));
    setProfile(prev => ({ ...prev, ...editData }));
    setIsEditing(false);
  };

  const roleLabel = (profile?.role || '')?.toUpperCase() === 'ADMIN' ? 'Administrator' : 'Investor';
  const roleIcon  = roleLabel === 'Administrator' ? '🛡️' : '👤';

  if (loading) return <DashboardLayout><div className="page-loading">Loading profile...</div></DashboardLayout>;

  const displayName  = profile?.name  || 'User';
  const displayEmail = profile?.email || '';

  return (
    <DashboardLayout>
      <div className="profile-page">
        <h1>My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>

        <div className="profile-container">
          <div className="profile-card card">
            <div className="profile-header">
              <div className="profile-avatar">{displayName.charAt(0).toUpperCase()}</div>
              <div>
                <h2>{displayName}</h2>
                <p>{displayEmail}</p>
                <span className="role-tag">{roleIcon} {roleLabel}</span>
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-group">
                <label>Full Name</label>
                {isEditing
                  ? <input type="text" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                  : <p>{displayName}</p>}
              </div>
              <div className="detail-group">
                <label>Email</label>
                {isEditing
                  ? <input type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
                  : <p>{displayEmail || 'Not provided'}</p>}
              </div>
              <div className="detail-group">
                <label>Role</label>
                <p className="role-value">{roleLabel}</p>
              </div>
              <div className="detail-group">
                <label>Risk Preference</label>
                {isEditing
                  ? <select value={editData.riskPreference} onChange={e => setEditData({ ...editData, riskPreference: e.target.value })}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                  : <p>{editData.riskPreference}</p>}
              </div>
              <div className="detail-group">
                <label>Investment Goal</label>
                {isEditing
                  ? <input type="text" value={editData.investmentGoal} onChange={e => setEditData({ ...editData, investmentGoal: e.target.value })} />
                  : <p>{editData.investmentGoal}</p>}
              </div>
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
