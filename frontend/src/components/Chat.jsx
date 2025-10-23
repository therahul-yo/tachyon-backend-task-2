import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8001');
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('message', (m) => setMessages((prev) => [...prev, m]));

    return () => socket.disconnect();
  }, []);

  // Join or create room
  const joinRoom = () => {
    if (!room.trim()) return;
    socketRef.current.emit('join', room);
    setJoined(true);
  };

  // Leave the room
  const leaveRoom = () => {
    if (!room) return;
    socketRef.current.emit('leave', room); // optional backend event
    socketRef.current.leave?.(room); // disconnect from room if supported
    setJoined(false);
    setRoom('');
    setMessages([]);
  };

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !joined) return;

    socketRef.current.emit('message', {
      room,
      user: user?.username || 'Anonymous',
      text,
    });
    setText('');
  };

  return (
    <div className="glass-card">
      {/* Room input */}
      {!joined && (
        <div className="form" style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="form-input"
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button onClick={joinRoom} disabled={!room.trim()} className="btn btn-primary">
              Create Room
            </button>
            <button onClick={joinRoom} disabled={!room.trim()} className="btn btn-primary">
              Join Room
            </button>
          </div>
        </div>
      )}

      {/* Chat Header */}
      {joined && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>Live Chat - {room}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: connected ? '#10b981' : '#ef4444', display: 'inline-block' }}></span>
            {connected ? 'Connected' : 'Disconnected'}
            <button
              onClick={leaveRoom}
              className="btn btn-secondary"
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
            >
              Leave Room
            </button>
          </div>
        </div>
      )}

      {/* Chat messages */}
      {joined && (
        <>
          <div className="chat-container">
            {messages.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="chat-message">
                  <div className="chat-user">{msg.user}</div>
                  <div className="chat-text">{msg.text}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send message input */}
          <form onSubmit={send}>
            <div className="chat-input-group">
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!connected}
              />
              <button type="submit" className="btn btn-primary" disabled={!connected || !text.trim()}>
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}