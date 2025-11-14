import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../store/auth';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'POLICE',
    department: ''
  });

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, usersData] = await Promise.all([
        axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(statsData.data);
      setUsers(usersData.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await axios.post('/api/admin/users', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewUser({ fullName: '', email: '', password: '', role: 'POLICE', department: '' });
      setShowUserForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-govGray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="tricolor-border pl-6">
        <h1 className="gov-heading-1 mb-2">{t('adminDashboard') || 'Admin Dashboard'}</h1>
        <p className="text-govGray-600 text-lg">System Administration & Management</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number">{stats?.totalComplaints || 0}</div>
              <div className="stat-label">{t('totalComplaints') || 'Total Complaints'}</div>
            </div>
            <div className="w-12 h-12 bg-govBlue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number text-govGreen-600">{stats?.closedComplaints || 0}</div>
              <div className="stat-label">{t('closedComplaints') || 'Closed Complaints'}</div>
            </div>
            <div className="w-12 h-12 bg-govGreen-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number text-govOrange-600">{stats?.judges || 0}</div>
              <div className="stat-label">{t('judges') || 'Judges'}</div>
            </div>
            <div className="w-12 h-12 bg-govOrange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number text-govBlue-600">{stats?.police || 0}</div>
              <div className="stat-label">{t('police') || 'Police Officers'}</div>
            </div>
            <div className="w-12 h-12 bg-govBlue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="gov-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-govGray-800">User Management</h3>
          <button
            onClick={() => setShowUserForm(!showUserForm)}
            className="btn-primary"
          >
            {showUserForm ? 'Cancel' : '+ Add New User'}
          </button>
        </div>

        {/* Create User Form */}
        {showUserForm && (
          <form onSubmit={handleCreateUser} className="mb-6 p-4 bg-govGray-50 rounded-lg border border-govGray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  required
                >
                  <option value="POLICE">Police</option>
                  <option value="JUDGE">Judge</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {newUser.role === 'JUDGE' && (
                <div className="md:col-span-2">
                  <label className="form-label">Court/Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="e.g., Ahmedabad Central Court"
                  />
                </div>
              )}
            </div>
            <button type="submit" className="btn-primary mt-4">
              Create User
            </button>
          </form>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-govGray-200">
            <thead className="bg-govGray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-govGray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-govGray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-govGray-900">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${
                      user.role === 'ADMIN' ? 'status-completed' :
                      user.role === 'JUDGE' ? 'status-in-progress' :
                      'status-pending'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                    {user.department || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${
                      user.isActive ? 'status-completed' : 'status-rejected'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-8 text-govGray-500">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


