import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await API.post(url, { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      API.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      onAuth && onAuth({ username });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(mode === 'login' ? 'Login failed. Please check your credentials.' : 'Registration failed. Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <h1 className="login-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="login-subtitle">
          {mode === 'login' 
            ? 'Sign in to access your tasks and collaborate with your team' 
            : 'Join TaskFlow to start organizing your work'}
        </p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <p className="toggle-text">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span 
            className="toggle-link" 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}