import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/Profile.css';

const API = 'http://localhost:8081';

function Profile({ user }) {
  const stored = JSON.parse(localStorage.getItem('investproUser') || '{}');
  const userId = stored.id || user?.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetch(`${API}/users/profile/${userId}`)
      .then(res => { if (!res.ok) throw new Error('Failed to load profile'); return res.json(); })
      .then(data => {
        setProfile(data);
        setEditData({ name: data.name, email: data.email, riskPreference: data.riskPreference || 'Medium', investmentGoal: data.investmentGoal || 'Wealth Creation' });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = () => {
    localStorage.setItem('userName', editData.name);
    localStorage.setItem('userEmail', editData.email);
    const updated = { ...stored, name: editData.name, email: editData.email };
    localStorage.setItem('investproUser', JSON.stringify(updated));
    setProfile(prev => ({ ...prev, ...editData }));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const roleLabel = (profile?.role || stored.role || '')?.toUpperCase() === 'ADMIN' ? 'Administrator' : 'Investor';
  const roleIcon = roleLabel === 'Administrator' ? '🛡️' : '👤';

  if (loading) return <DashboardLayout><div className="page-loading">Loading profile...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="page-error">{error}</div></DashboardLayout>;

  const displayName = profile?.name || stored.name || 'User';
  const displayEmail = profile?.email || stored.email || '';

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
                {isEditing ? (
                  <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                ) : <p>{displayName}</p>}
              </div>
              <div className="detail-group">
                <label>Email</label>
                {isEditing ? (
                  <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                ) : <p>{displayEmail || 'Not provided'}</p>}
              </div>
              <div className="detail-group">
                <label>Role</label>
                <p className="role-value">{roleLabel}</p>
              </div>
              <div className="detail-group">
                <label>Risk Preference</label>
                {isEditing ? (
                  <select value={editData.riskPreference} onChange={(e) => setEditData({ ...editData, riskPreference: e.target.value })}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                ) : <p>{editData.riskPreference}</p>}
              </div>
              <div className="detail-group">
                <label>Investment Goal</label>
                {isEditing ? (
                  <input type="text" value={editData.investmentGoal} onChange={(e) => setEditData({ ...editData, investmentGoal: e.target.value })} />
                ) : <p>{editData.investmentGoal}</p>}
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
