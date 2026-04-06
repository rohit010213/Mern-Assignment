import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminPanel = () => {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskTotal, setTaskTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 8;

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const token = localStorage.getItem('token');
      const { data } = await api.get('/admin/tasks', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(data.tasks);
      setTaskTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else fetchTasks();
  }, [activeTab, fetchTasks]);

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.put(`/admin/tasks/${taskId}`, {
        status: currentStatus === 'completed' ? 'pending' : 'completed',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
    } catch (err) {
      setError('Failed to update task status.');
    }
  };

  if (authLoading) return <div className="page-loader">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <p>Manage all users and tasks on the platform.</p>
        </div>

        <div className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
            {users.length > 0 && <span className="tab-count">{users.length}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            All Tasks
            {taskTotal > 0 && <span className="tab-count">{taskTotal}</span>}
          </button>
        </div>

        {error && <div className="page-error">{error}</div>}

        {activeTab === 'users' && (
          <div className="admin-section">
            {loading ? (
              <div className="loading-state">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="empty-state"><p>No users found.</p></div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id}>
                        <td>{i + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="admin-section">
            <div className="filters-bar">
              <span className="filter-label">Filter:</span>
              {['all', 'pending', 'completed'].map((val) => (
                <button
                  key={val}
                  className={`filter-btn ${statusFilter === val ? 'active' : ''}`}
                  onClick={() => handleFilterChange(val)}
                >
                  {val === 'all' ? 'All' : val === 'completed' ? 'Completed' : 'Pending'}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="loading-state">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="empty-state"><p>No tasks found.</p></div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Action</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, i) => (
                      <tr key={t._id}>
                        <td className="task-index-cell">{(page - 1) * limit + i + 1}</td>
                        <td className="task-title-cell">{t.title}</td>
                        <td className="task-desc-cell">{t.description || '—'}</td>
                        <td className="task-owner-cell">
                          <span className="owner-name">{t.user?.name}</span>
                          <span className="owner-email">{t.user?.email}</span>
                        </td>
                        <td className="task-status-cell">
                          <span
                            className={`status-pill ${(t.status ? t.status === 'completed' : t.completed) ? 'done' : 'pending'
                              }`}
                          >
                            {(t.status ? t.status === 'completed' : t.completed) ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="task-action-cell">
                          <button
                            className="btn-primary admin-action-btn"
                            onClick={() => handleToggleTaskStatus(t._id, t.status || ((t.completed && 'completed') || 'pending'))}
                          >
                            {(t.status ? t.status === 'completed' : t.completed) ? 'Mark Pending' : 'Mark Complete'}
                          </button>
                        </td>
                        <td className="task-created-cell">{formatDate(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                <span className="page-info">Page {page} of {totalPages}</span>
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
