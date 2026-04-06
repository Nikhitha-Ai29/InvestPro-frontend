import { useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import '../../styles/ManageUsers.css';

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'user' },
  { id: 5, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
];

function ManageUsers({ setUser }) {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <AdminLayout setUser={setUser}>
      <div className="admin-content">
        <h1>Manage Users</h1>
        <p className="page-subtitle">View and manage platform users</p>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
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
      </div>
    </AdminLayout>
  );
}

export default ManageUsers;
