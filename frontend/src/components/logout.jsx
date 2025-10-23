import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Logout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    onLogout && onLogout(null);
    navigate('/login'); // redirect to login page
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '28px' // matches your body padding
    }}>
      <div className="card form" style={{
        padding: '40px 30px',
        textAlign: 'center',
        width: '100%',
        maxWidth: 400,
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 15
      }}>
        <h2 style={{ marginBottom: 10 }}>Logout</h2>
        <p>Are you sure you want to logout?</p>

        <button className="btn" onClick={handleLogout} style={{ padding: '12px' }}>
          Logout
        </button>
      </div>
    </div>
  );
}