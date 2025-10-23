import React, { useState } from 'react';
import API from '../api';

export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setLoading(true);
    try {
      await API.post('/api/tasks', { title, description, dueDate });
      setTitle('');
      setDescription('');
      setDueDate('');
      onCreated && onCreated();
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">Create New Task</h3>
      
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}