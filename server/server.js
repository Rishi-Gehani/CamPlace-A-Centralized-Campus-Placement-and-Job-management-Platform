/* global process */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import queryRoutes from './routes/queries.js';
import resourceRoutes from './routes/resources.js';
import noticeRoutes from './routes/notices.js';
import notificationRoutes from './routes/notifications.js';
import quizRoutes from './routes/quiz.js';
import User from './models/User.js';
import { startCronJobs } from './utils/cronJobs.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Make io accessible to routes
app.set('io', io);

// Database Connection
const mongoURL = process.env.MONGODB_URI;

if (!mongoURL) {
  console.error("❌ ERROR: MONGODB_URI is missing! Check your .env file.");
  process.exit(1); // Stops the server from crashing wildly
}

mongoose.connect(mongoURL)
  .then(async () => {
    console.log('MongoDB connected successfully!');
    
    // Create default admin if not exists
    const adminEmail = 'rishi.gehani@somaiya.edu';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Rishi@7984', salt);
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Default admin created');
    }
    
    // Start cron jobs
    startCronJobs(io);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/quiz', quizRoutes);

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import('vite');
  async function setupVite() {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
  await setupVite();
} else {
  // Serve static files in production
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
