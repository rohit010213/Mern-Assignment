import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 6;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const token = localStorage.getItem('token');
      const { data } = await api.get('/tasks', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(data.tasks || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleAddTask = async ({ title, description }) => {
    const token = localStorage.getItem('token');
    const { data } = await api.post('/tasks', { title, description }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
    return data;
  };

  const handleUpdate = async (id, updates) => {
    const token = localStorage.getItem('token');
    const { data } = await api.put(`/tasks/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    const token = localStorage.getItem('token');
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  if (authLoading) return <div className="page-loader">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="dashboard-header">
          <div>
            <h2>My Tasks</h2>
            <p className="task-count">{total} task{total !== 1 ? 's' : ''} total</p>
          </div>
        </div>

        <TaskForm onAdd={handleAddTask} />

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

        {error && <div className="page-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found.</p>
            <span>Add a task above to get started!</span>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
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

            <span className="page-info">
              Page {page} of {totalPages}
            </span>

            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
