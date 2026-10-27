/**
 * ShopAI Express Backend Server
 *
 * Full Stack Architecture:
 * 1) MongoDB + Mongoose  — Database connection, schemas, queries, validations, and auto-seeding
 * 2) NodeJS + ExpressJS  — Robust REST API framework, modular routers, middleware chain
 * 3) Authentication      — Bcrypt password hashing, regular expressions validation, demo accounts
 * 4) JWT (JSON Web Token)— Stateless session management, verifyToken, and role-based access control
 * 5) Multer              — Multipart form-data handling, regex MIME type check, static file serving
 * 6) React JS            — Integrated with luxury frontend UI
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { connectDatabase, isDatabaseConnected } from './server/config/database.js';

// Import Modular Routers
import authRoutes from './server/routes/auth.routes.js';
import productRoutes from './server/routes/product.routes.js';
import orderRoutes from './server/routes/order.routes.js';
import uploadRoutes from './server/routes/upload.routes.js';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 1. Express App Initialization ────────────────────────────────────────────
const app = express();

// ─── 2. EventEmitter (Store Event Bus) ─────────────────────────────────────────
class StoreEventEmitter extends EventEmitter {}
export const storeEvents = new StoreEventEmitter();

storeEvents.on('order:created', (order) => {
  console.log(`[EVENT] 📦 Order placed: ${order.orderId || order.id} | Amount: ₹${order.totalAmount} | ${new Date().toISOString()}`);
});

storeEvents.on('product:queried', (query) => {
  console.log(`[EVENT] 🔍 Search query: "${query}"`);
});

storeEvents.on('user:registered', (email) => {
  console.log(`[EVENT] 👤 User registered: ${email}`);
});

// ─── 3. Core Middleware Chain ──────────────────────────────────────────────────

// CORS — support Vite dev servers and production
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      const requestOrigin = new URL(origin);
      const isLocalViteOrigin =
        requestOrigin.protocol === 'http:' &&
        (requestOrigin.hostname === 'localhost' || requestOrigin.hostname === '127.0.0.1') &&
        Number(requestOrigin.port) >= 5173 &&
        Number(requestOrigin.port) <= 5199;

      callback(null, isLocalViteOrigin);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static uploads
const uploadsPath = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Optionally serve built React dist if available
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// ─── 4. Health Check Endpoint ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const dbConnected = isDatabaseConnected();
  res.status(200).json({
    status: dbConnected ? 'healthy' : 'degraded',
    database: dbConnected ? 'connected (MongoDB)' : 'fallback mode (local store)',
    server: 'ShopAI Express Server',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    techStack: {
      '1_database': 'MongoDB + Mongoose',
      '2_backend': 'NodeJS + ExpressJS',
      '3_authentication': 'Bcrypt password hashing + RegEx validation',
      '4_tokens': 'JWT (JSON Web Tokens)',
      '5_uploads': 'Multer multipart/form-data',
      '6_frontend': 'React JS (Vite + Tailwind CSS)',
    },
    demoAccounts: {
      customer: { email: 'demo@shopai.com', password: 'Demo@1234' },
      admin: { email: 'admin@shopai.com', password: 'Admin@1234' },
    },
  });
});

// ─── 5. Mount Modular Express Routers ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// ─── 6. Global Error Handler Middleware ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      errors: err.errors,
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
      field,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

// ─── 7. 404 Handler for Unmatched API Routes ──────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// For any non-API routes, serve React index.html if dist exists
app.use((req, res, next) => {
  if (req.method === 'GET') {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// ─── 8. Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

export async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a unique secret of at least 32 characters in .env');
  }

  // Connect to MongoDB (with graceful fallback if mongod is not yet running)
  await connectDatabase();

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log('\n================================================================');
      console.log(`🚀 ShopAI Full Stack Server running on http://localhost:${PORT}`);
      console.log('📡 Available API Endpoints:');
      console.log('   ✅ Health:       GET    /api/health');
      console.log('   ✅ Auth:         POST   /api/auth/register  (Bcrypt + RegEx + JWT)');
      console.log('   ✅ Auth:         POST   /api/auth/login     (Bcrypt compare + JWT)');
      console.log('   ✅ Auth:         GET    /api/auth/me        (JWT Protected)');
      console.log('   ✅ Products:     GET    /api/products       (MongoDB/Mongoose query)');
      console.log('   ✅ Products:     POST   /api/products       (Admin + JWT Protected)');
      console.log('   ✅ Orders:       POST   /api/orders         (Checkout + Mongoose)');
      console.log('   ✅ Orders:       GET    /api/orders         (JWT Protected)');
      console.log('   ✅ Upload:       POST   /api/upload/product-image (Multer + JWT)');
      console.log('   ✅ Upload:       GET    /api/upload/files   (Multer listings)');
      console.log('================================================================\n');
      resolve(server);
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer().catch(async (error) => {
    console.error('[Startup Error] Unable to start API server:', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
    process.exitCode = 1;
  });
}

export default app;
