const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./models');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express();

// ✅ CORS: allow all CRUD methods
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// ✅ Health check
app.get('/healthz', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 8001;
const server = http.createServer(app);

// ✅ Socket.io setup
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
  });

  socket.on('message', (payload) => {
    if (payload?.room) {
      io.to(payload.room).emit('message', {
        user: payload.user,
        text: payload.text,
        ts: Date.now()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// ✅ Start server after DB sync
db.sequelize.sync().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('DB sync error:', err);
});