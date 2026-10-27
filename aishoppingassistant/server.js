/**
 * ShopAI Express Backend Server
 *
 * Syllabus coverage:
 * - Lab 9:  Path, File System, Events, Buffers, Streams, EventEmitter
 * - Lab 10: HTTP Module → upgraded to Express.js, Routing, Query Params, JSON responses
 * - NEW:    Express.js framework, Middleware chain, Router modules
 * - NEW:    Bcrypt password hashing (in auth.routes.js)
 * - NEW:    JWT authentication (auth.middleware.js + auth.routes.js)
 * - NEW:    Multer file uploads (multer.config.js + upload.routes.js)
 * - NEW:    Regular Expressions for input validation (validate.middleware.js)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import Express route modules
import authRoutes from './server/routes/auth.routes.js';
import uploadRoutes from './server/routes/upload.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 1. Express App Initialization ────────────────────────────────────────────
const app = express();

// ─── 2. EventEmitter (Lab 9) ──────────────────────────────────────────────────
class StoreEventEmitter extends EventEmitter {}
const storeEvents = new StoreEventEmitter();

storeEvents.on('order:created', (order) => {
  console.log(`[EVENT] 📦 Order received: ${order.id} | Amount: ₹${order.totalAmount} | ${new Date().toISOString()}`);
});

storeEvents.on('product:queried', (query) => {
  console.log(`[EVENT] 🔍 Search query: "${query}"`);
});

storeEvents.on('user:registered', (email) => {
  console.log(`[EVENT] 👤 New user registered: ${email}`);
});

// ─── 3. Core Middleware Chain ──────────────────────────────────────────────────

// CORS — allow requests from Vite dev server and any origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON request bodies (replaces manual Buffer.concat from Lab 10)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Request logger middleware (replaces console.log in each route)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static files: public/uploads/ for product images
const uploadsPath = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// ─── 4. In-Memory Product Dataset (Lab 10 preserved) ──────────────────────────
const products = [
  {
    id: 1, name: "SunShield SPF 50", category: "Skincare", price: 449, originalPrice: 649,
    rating: 4.6, reviewsCount: 128, badge: "Bestseller", image: "/images/sunshield.jpg",
    description: "Lightweight, non-greasy broad-spectrum sunscreen engineered for daily protection. Zero white cast."
  },
  {
    id: 2, name: "DermaGuard SPF 50", category: "Skincare", price: 399, originalPrice: 599,
    rating: 4.4, reviewsCount: 95, badge: "Budget Choice",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    description: "Soothing mineral sunscreen with aloe vera extracts. Ideal for sensitive skin."
  },
  {
    id: 3, name: "GlowClean Face Wash", category: "Skincare", price: 299, originalPrice: 449,
    rating: 4.7, reviewsCount: 210, badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
    description: "Deep cleansing facial foam infused with Salicylic Acid and Vitamin C."
  },
  {
    id: 4, name: "AeroBeat Headphones", category: "Electronics", price: 2499, originalPrice: 4999,
    rating: 4.8, reviewsCount: 340, badge: "Trending", image: "/images/aerobeat.jpg",
    description: "Immersive over-ear headphones with Active Noise Cancellation and 40-hour battery life."
  },
  {
    id: 5, name: "CodePro Keyboard", category: "Electronics", price: 3899, originalPrice: 5999,
    rating: 4.9, reviewsCount: 512, badge: "Editor's Choice", image: "/images/codepro.jpg",
    description: "Tactile mechanical keyboard with hot-swappable switches and PBT keycaps."
  },
  {
    id: 6, name: "PixelView 27 Monitor", category: "Electronics", price: 14999, originalPrice: 19999,
    rating: 4.7, reviewsCount: 88, badge: "High Performance",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    description: "Crisp 27-inch Quad HD IPS display with 165Hz refresh rate and 99% sRGB."
  },
  {
    id: 7, name: "UrbanStep Sneakers", category: "Fashion", price: 1899, originalPrice: 2999,
    rating: 4.5, reviewsCount: 176, badge: "Popular", image: "/images/urbanstep.jpg",
    description: "Lifestyle sneakers designed with breathable mesh uppers and cloud-cushioned soles."
  },
  {
    id: 8, name: "Classic Overshirt", category: "Fashion", price: 1299, originalPrice: 2199,
    rating: 4.3, reviewsCount: 64, badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    description: "Versatile heavy-cotton utility overshirt featuring dual flap pockets."
  },
  {
    id: 9, name: "Flex Backpack", category: "Fashion", price: 999, originalPrice: 1799,
    rating: 4.6, reviewsCount: 142, badge: "Best Value",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    description: "Water-resistant commuter laptop backpack with padded 15.6 inch compartment."
  },
  {
    id: 10, name: "BrewMate Coffee Maker", category: "Home", price: 2799, originalPrice: 3999,
    rating: 4.8, reviewsCount: 230, badge: "Top Seller", image: "/images/brewmate.jpg",
    description: "Programmable drip coffee maker with high-temp extraction and keep-warm plate."
  },
  {
    id: 11, name: "AirPure Mini Purifier", category: "Home", price: 1599, originalPrice: 2499,
    rating: 4.4, reviewsCount: 89, badge: "Essential",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    description: "Compact True HEPA desktop air purifier for removing dust and odors."
  },
  {
    id: 12, name: "GlowDesk LED Lamp", category: "Home", price: 849, originalPrice: 1499,
    rating: 4.6, reviewsCount: 115, badge: "Smart Light",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    description: "Eye-caring touch LED desk lamp with 5 color temperatures and wireless charger."
  },
];

let ordersDb = [];

// ─── 5. Mount Auth and Upload Routers ─────────────────────────────────────────
// All auth routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/auth', authRoutes);

// All upload routes: /api/upload/product-image, /api/upload/files
app.use('/api/upload', uploadRoutes);

// ─── 6. Product Routes (Express style, preserved from Lab 10) ─────────────────

// GET /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    server: 'ShopAI Express Server',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    features: ['Express.js', 'JWT Auth', 'Bcrypt', 'Multer Uploads', 'RegEx Validation'],
  });
});

// GET /api/products — with search, filter, sort query params
app.get('/api/products', (req, res) => {
  let result = [...products];
  const { search, category, maxPrice, sort } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    storeEvents.emit('product:queried', q);
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    result = result.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }

  if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

  res.status(200).json({ success: true, count: result.length, data: result });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({ success: true, data: product });
});

// POST /api/orders — place an order (Stream/Buffer preserved for syllabus)
app.post('/api/orders', (req, res) => {
  // Note: express.json() above already parses req.body,
  // but we use streams here to demonstrate Lab 10 Buffers/Streams concepts
  let bodyBuffers = [];

  req.on('data', (chunk) => {
    bodyBuffers.push(chunk);
  });

  req.on('end', () => {
    try {
      // Buffer.concat demonstrates Node.js Buffers (Lab 9)
      const rawBody = Buffer.concat(bodyBuffers).toString();
      const orderData = JSON.parse(rawBody);

      const newOrder = {
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
        ...orderData,
      };

      ordersDb.push(newOrder);
      storeEvents.emit('order:created', newOrder); // EventEmitter (Lab 9)

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: newOrder,
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
    }
  });
});

// ─── 7. Global Error Handler ───────────────────────────────────────────────────
// Express 4-argument error handler — catches any unhandled errors
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

// ─── 8. 404 Handler for unknown routes ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `API Endpoint Not Found: ${req.method} ${req.path}` });
});

// ─── 9. Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log(`🚀 ShopAI Express Server running on http://localhost:${PORT}`);
  console.log('📡 Endpoints Available:');
  console.log('   AUTH:');
  console.log('   - POST /api/auth/register  (Bcrypt + RegEx + JWT)');
  console.log('   - POST /api/auth/login     (Bcrypt compare + JWT)');
  console.log('   - GET  /api/auth/me        (JWT Protected)');
  console.log('   UPLOAD:');
  console.log('   - POST /api/upload/product-image  (Multer + JWT)');
  console.log('   - GET  /api/upload/files           (JWT Protected)');
  console.log('   PRODUCTS:');
  console.log('   - GET  /api/health');
  console.log('   - GET  /api/products');
  console.log('   - GET  /api/products/:id');
  console.log('   - POST /api/orders');
  console.log('======================================================\n');
});

export default app;
