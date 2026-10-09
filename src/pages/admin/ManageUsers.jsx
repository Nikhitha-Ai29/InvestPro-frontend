import { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import '../../styles/ManageUsers.css';

function ManageUsers({ setUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load real registered users from localStorage registry
    const registered = JSON.parse(localStorage.getItem('investproUsers') || '[]');

    // Attach investment count per user
    const enriched = registered.map(u => {
      const portfolio = JSON.parse(localStorage.getItem(`portfolio_${u.id}`) || '[]');
      return { ...u, investmentCount: portfolio.length };
    });

    // If no registered users yet, show a placeholder so admin panel isn't empty
    if (enriched.length === 0) {
      setUsers([]);
    } else {
      setUsers(enriched);
    }
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all their data?')) return;
    // Remove user from registry
    const updated = users.filter(u => u.id !== id);
    const registry = JSON.parse(localStorage.getItem('investproUsers') || '[]');
    localStorage.setItem('investproUsers', JSON.stringify(registry.filter(u => u.id !== id)));
    // Remove their portfolio
    localStorage.removeItem(`portfolio_${id}`);
    setUsers(updated);
  };

  return (
    <AdminLayout setUser={setUser}>
      <div className="admin-content">
        <h1>Manage Users</h1>
        <p className="page-subtitle">View and manage registered platform users</p>

        {users.length === 0 ? (
          <div className="no-users-state">
            <div className="no-users-icon">👥</div>
            <h3>No registered users yet</h3>
            <p>Users who register on the platform will appear here.</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Investments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role?.toLowerCase()}`}>
                        {user.role?.toUpperCase() === 'ADMIN' ? 'Admin' : 'Investor'}
                      </span>
                    </td>
                    <td>
                      <span className="inv-count-badge">
                        {user.investmentCount} fund{user.investmentCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
