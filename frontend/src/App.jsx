import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import API from './api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Chat from './components/Chat';
import Logout from './components/logout';

function Navigation({ user, onLogout }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="nav-sticky">
      <div className="nav-container">
        <div className="nav-logo">TaskFlow</div>
        <ul className="nav-links">
          <li>
            <a className="nav-link" onClick={() => scrollToSection('tasks')}>
              Tasks
            </a>
          </li>
          <li>
            <a className="nav-link" onClick={() => scrollToSection('chat')}>
              Chat
            </a>
          </li>
          <li className="user-badge">
            {user?.username || 'User'}
          </li>
          <li>
            <button className="btn btn-secondary" onClick={onLogout} style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function HeroSection({ user }) {
  return (
    <section className="hero-section">
      <h1 className="hero-title">
        Welcome to TaskFlow
      </h1>
      <p className="hero-subtitle">
        Your modern task management platform with real-time collaboration.
        Organize, prioritize, and conquer your goals.
      </p>
      <div className="hero-animated-text">
        <span>Build</span>{' '}
        <span>Organize</span>{' '}
        <span>Achieve</span>
      </div>
    </section>
  );
}

function MainPage({ user }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <HeroSection user={user} />
      
      {/* Tasks Section */}
      <section id="tasks" className="section">
        <h2 className="section-title">Your Tasks</h2>
        <p className="section-subtitle">
          Create, manage, and track all your tasks in one beautiful interface
        </p>
        
        <div className="grid-2">
          <div>
            <TaskForm onCreated={fetchTasks} />
          </div>
          <div>
            <TaskList tasks={tasks} onChange={fetchTasks} />
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section id="chat" className="section">
        <h2 className="section-title">Live Collaboration</h2>
        <p className="section-subtitle">
          Connect with your team in real-time and stay synchronized
        </p>
        
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Chat user={user} />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Built with modern design principles inspired by innovative platforms</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>TaskFlow © 2025</p>
      </footer>
    </>
  );
}

export default function App() {
  // Initialize user state from localStorage to prevent redirect on refresh
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      return { username };
    }
    return null;
  });

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('username', userData.username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onAuth={handleAuth} />}
        />
        <Route
          path="/logout"
          element={<Logout onLogout={handleLogout} />}
        />
        <Route
          path="/"
          element={
            user ? (
              <>
                <Navigation user={user} onLogout={handleLogout} />
                <MainPage user={user} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}