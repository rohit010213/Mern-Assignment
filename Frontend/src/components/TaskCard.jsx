import React, { useState } from 'react';
import '../styles/dashboard.css';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    await onUpdate(task._id, { title: editTitle, description: editDesc });
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description);
    setIsEditing(false);
  };

  const handleToggle = () => {
    const isDone = task.status ? task.status === 'completed' : task.completed === true;
    onUpdate(task._id, { status: isDone ? 'pending' : 'completed' });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`task-card ${
        (task.status ? task.status === 'completed' : task.completed) ? 'completed' : ''
      }`}
    >
      <div className="task-card-header">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status ? task.status === 'completed' : task.completed}
          onChange={handleToggle}
          aria-label="Mark task as completed"
        />

        {isEditing ? (
          <input
            className="edit-title-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <h3
            className={`task-title ${
              (task.status ? task.status === 'completed' : task.completed) ? 'strikethrough' : ''
            }`}
          >
            {task.title}
          </h3>
        )}

        <div className="task-actions">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? '...' : 'Save'}
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => onDelete(task._id)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="edit-desc-input"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Add a description..."
          rows={2}
        />
      ) : (
        task.description && (
          <p className="task-description">{task.description}</p>
        )
      )}

      <div className="task-footer">
        <span
          className={`status-pill ${
            (task.status ? task.status === 'completed' : task.completed) ? 'done' : 'pending'
          }`}
        >
          {(task.status ? task.status === 'completed' : task.completed) ? 'Completed' : 'Pending'}
        </span>
        <span className="task-date">{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
};

export default TaskCard;
