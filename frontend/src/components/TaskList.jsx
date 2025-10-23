import React, { useState } from 'react';
import API from '../api';

export default function TaskList({ tasks, onChange }) {
  const [loadingId, setLoadingId] = useState(null); // Track which task is loading

  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-card">
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  // Trigger parent's onChange callback to refresh tasks
  const refreshTasks = () => {
    if (onChange) onChange();
  };

  // Handle completing a task
  const handleComplete = async (task) => {
    setLoadingId(task.id);
    try {
      if (task.status !== 'done') {
        await API.patch(`/api/tasks/${task.id}/complete`);
        refreshTasks(); // Refresh the task list
      } else {
        alert('Task is already completed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to complete task');
    } finally {
      setLoadingId(null);
    }
  };

  // Handle deleting a task
  const handleDelete = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoadingId(task.id);
    try {
      await API.delete(`/api/tasks/${task.id}`);
      refreshTasks(); // Refresh the task list
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">All Tasks ({tasks.length})</h3>
      <div>
        {tasks.map((task) => (
          <div key={task.id} className={`task-item ${task.status === 'done' ? 'completed' : ''}`}>
            <div className="task-content">
              <h4 className="task-title">{task.title}</h4>
              {task.description && <p className="task-description">{task.description}</p>}
              <div className="task-meta">
                <span>Status: {task.status === 'done' ? '✅ Completed' : task.status === 'in-progress' ? '🔄 In Progress' : '⏳ Pending'}</span>
                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="task-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleComplete(task)}
                disabled={loadingId === task.id || task.status === 'done'}
                style={{ padding: '0.5rem 1rem' }}
              >
                {task.status === 'done' ? 'Completed' : 'Complete'}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(task)}
                disabled={loadingId === task.id}
                style={{ padding: '0.5rem 1rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}