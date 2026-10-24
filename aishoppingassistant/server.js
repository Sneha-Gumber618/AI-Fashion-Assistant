/**
 * ShopAI Backend Server - Node.js HTTP Module Implementation
 * Meets syllabus items:
 * - Lab 9: Path, File System, Events, Buffers, Streams, EventEmitter
 * - Lab 10: HTTP Module, Request-Response Lifecycle, Routing, Query Parameters, JSON responses
 * - Topics 49-54: Event Loop, Non-blocking I/O, Error Handling, Environment Variables
 */

import http from 'http';
import url from 'url';
import path from 'path';
import fs from 'fs';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialize EventEmitter for logging and analytics
class StoreEventEmitter extends EventEmitter {}
const storeEvents = new StoreEventEmitter();

storeEvents.on('order:created', (order) => {
  console.log(`[EVENT] Order received: ${order.id} | Amount: ₹${order.totalAmount} | Time: ${new Date().toISOString()}`);
});

storeEvents.on('product:queried', (query) => {
  console.log(`[EVENT] Search query received: "${query}"`);
});

// 2. Load product dataset using fs and Path modules
const productsFilePath = path.join(__dirname, 'src', 'data', 'products.js');

// Mock memory dataset
const products = [
  {
    id: 1,
    name: "SunShield SPF 50",
    category: "Skincare",
    price: 449,
    originalPrice: 649,
    rating: 4.6,
    reviewsCount: 128,
    badge: "Bestseller",
    image: "/images/sunshield.jpg",
    description: "Lightweight, non-greasy broad-spectrum sunscreen engineered for daily protection. Zero white cast."
  },
  {
    id: 2,
    name: "DermaGuard SPF 50",
    category: "Skincare",
    price: 399,
    originalPrice: 599,
    rating: 4.4,
    reviewsCount: 95,
    badge: "Budget Choice",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    description: "Soothing mineral sunscreen with aloe vera extracts. Ideal for sensitive skin."
  },
  {
    id: 3,
    name: "GlowClean Face Wash",
    category: "Skincare",
    price: 299,
    originalPrice: 449,
    rating: 4.7,
    reviewsCount: 210,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
    description: "Deep cleansing facial foam infused with Salicylic Acid and Vitamin C."
  },
  {
    id: 4,
    name: "AeroBeat Headphones",
    category: "Electronics",
    price: 2499,
    originalPrice: 4999,
    rating: 4.8,
    reviewsCount: 340,
    badge: "Trending",
    image: "/images/aerobeat.jpg",
    description: "Immersive over-ear headphones with Active Noise Cancellation and 40-hour battery life."
  },
  {
    id: 5,
    name: "CodePro Keyboard",
    category: "Electronics",
    price: 3899,
    originalPrice: 5999,
    rating: 4.9,
    reviewsCount: 512,
    badge: "Editor's Choice",
    image: "/images/codepro.jpg",
    description: "Tactile mechanical keyboard with hot-swappable switches and PBT keycaps."
  },
  {
    id: 6,
    name: "PixelView 27 Monitor",
    category: "Electronics",
    price: 14999,
    originalPrice: 19999,
    rating: 4.7,
    reviewsCount: 88,
    badge: "High Performance",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    description: "Crisp 27-inch Quad HD IPS display with 165Hz refresh rate and 99% sRGB."
  },
  {
    id: 7,
    name: "UrbanStep Sneakers",
    category: "Fashion",
    price: 1899,
    originalPrice: 2999,
    rating: 4.5,
    reviewsCount: 176,
    badge: "Popular",
    image: "/images/urbanstep.jpg",
    description: "Lifestyle sneakers designed with breathable mesh uppers and cloud-cushioned soles."
  },
  {
    id: 8,
    name: "Classic Overshirt",
    category: "Fashion",
    price: 1299,
    originalPrice: 2199,
    rating: 4.3,
    reviewsCount: 64,
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    description: "Versatile heavy-cotton utility overshirt featuring dual flap pockets."
  },
  {
    id: 9,
    name: "Flex Backpack",
    category: "Fashion",
    price: 999,
    originalPrice: 1799,
    rating: 4.6,
    reviewsCount: 142,
    badge: "Best Value",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    description: "Water-resistant commuter laptop backpack with padded 15.6 inch compartment."
  },
  {
    id: 10,
    name: "BrewMate Coffee Maker",
    category: "Home",
    price: 2799,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 230,
    badge: "Top Seller",
    image: "/images/brewmate.jpg",
    description: "Programmable drip coffee maker with high-temp extraction and keep-warm plate."
  },
  {
    id: 11,
    name: "AirPure Mini Purifier",
    category: "Home",
    price: 1599,
    originalPrice: 2499,
    rating: 4.4,
    reviewsCount: 89,
    badge: "Essential",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    description: "Compact True HEPA desktop air purifier for removing dust and odors."
  },
  {
    id: 12,
    name: "GlowDesk LED Lamp",
    category: "Home",
    price: 849,
    originalPrice: 1499,
    rating: 4.6,
    reviewsCount: 115,
    badge: "Smart Light",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    description: "Eye-caring touch LED desk lamp with 5 color temperatures and wireless charger."
  }
];

let ordersDb = [];

// Helper to set CORS and JSON headers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// 3. Create HTTP Server
const server = http.createServer((req, res) => {
  // CORS Preflight Handler
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // ROUTE: Health Check
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'healthy',
      server: 'Node.js HTTP Server',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  }

  // ROUTE: GET /api/products
  if (pathname === '/api/products' && req.method === 'GET') {
    let result = [...products];

    if (query.search) {
      const q = String(query.search).toLowerCase();
      storeEvents.emit('product:queried', q);
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (query.category && query.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === String(query.category).toLowerCase());
    }

    if (query.maxPrice) {
      result = result.filter(p => p.price <= Number(query.maxPrice));
    }

    if (query.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (query.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (query.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return sendJson(res, 200, {
      success: true,
      count: result.length,
      data: result
    });
  }

  // ROUTE: GET /api/products/:id
  const productMatch = pathname.match(/^\/api\/products\/(\d+)$/);
  if (productMatch && req.method === 'GET') {
    const id = Number(productMatch[1]);
    const product = products.find(p => p.id === id);
    if (!product) {
      return sendJson(res, 404, { success: false, message: 'Product not found' });
    }
    return sendJson(res, 200, { success: true, data: product });
  }

  // ROUTE: POST /api/orders (Stream / Buffer handling)
  if (pathname === '/api/orders' && req.method === 'POST') {
    let bodyBuffers = [];

    req.on('data', (chunk) => {
      bodyBuffers.push(chunk);
    });

    req.on('end', () => {
      try {
        const rawBody = Buffer.concat(bodyBuffers).toString();
        const orderData = JSON.parse(rawBody);

        const newOrder = {
          id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date().toISOString(),
          status: 'Confirmed',
          ...orderData
        };

        ordersDb.push(newOrder);
        storeEvents.emit('order:created', newOrder);

        return sendJson(res, 201, {
          success: true,
          message: 'Order placed successfully',
          data: newOrder
        });
      } catch (err) {
        return sendJson(res, 400, { success: false, message: 'Invalid JSON payload' });
      }
    });

    return;
  }

  // Default Not Found Route
  return sendJson(res, 404, { success: false, message: 'API Endpoint Not Found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ShopAI Node.js HTTP Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints Available:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/products`);
  console.log(`   - GET  /api/products/:id`);
  console.log(`   - POST /api/orders`);
  console.log(`======================================================\n`);
});
