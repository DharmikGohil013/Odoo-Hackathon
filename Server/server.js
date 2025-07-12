const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const { testCloudinaryConnection } = require('./utils/cloudinaryTest');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Test Cloudinary connection
testCloudinaryConnection();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploaded files (optional, for Multer temp files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/recommend', require('./routes/recommendationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/canvas', require('./routes/canvasRoutes'));

// Fallback route for 404s
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// Error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Socket.io for real-time canvas collaboration
const canvasRooms = new Map(); // Store room participants

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join canvas room
  socket.on('join-canvas-room', (data) => {
    const { roomId, user } = data;
    
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userData = user;

    // Add user to room participants
    if (!canvasRooms.has(roomId)) {
      canvasRooms.set(roomId, new Map());
    }
    canvasRooms.get(roomId).set(socket.id, user);

    // Notify room about new user
    socket.to(roomId).emit('user-joined', user);
    
    // Send current room users to the new user
    const roomUsers = Array.from(canvasRooms.get(roomId).values());
    socket.emit('room-users', roomUsers);
    
    console.log(`User ${user.name} joined canvas room: ${roomId}`);
  });

  // Handle canvas drawing
  socket.on('canvas-drawing', (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('canvas-drawing', data);
    }
  });

  // Handle canvas clear
  socket.on('canvas-clear', (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('canvas-clear', data);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.roomId && canvasRooms.has(socket.roomId)) {
      const roomParticipants = canvasRooms.get(socket.roomId);
      const userData = roomParticipants.get(socket.id);
      
      roomParticipants.delete(socket.id);
      
      // Clean up empty rooms
      if (roomParticipants.size === 0) {
        canvasRooms.delete(socket.roomId);
      } else {
        // Notify room about user leaving
        socket.to(socket.roomId).emit('user-left', userData);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Skill Swap server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for real-time canvas collaboration`);
});
