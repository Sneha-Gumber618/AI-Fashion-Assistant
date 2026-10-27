/**
 * Database Seeder
 * Populates MongoDB with default products and demo accounts if not already present.
 * Syllabus: MongoDB + Mongoose seeding, Bcrypt password hashing
 */

import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { INITIAL_PRODUCTS } from '../../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_JSON_PATH = path.join(__dirname, '../db/users.json');

export async function seedDatabase() {
  try {
    // 1. Seed demo accounts in MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const demoUsers = [
        {
          name: 'ShopAI Demo Customer',
          email: 'demo@shopai.com',
          passwordRaw: 'Demo@1234',
          role: 'customer',
        },
        {
          name: 'ShopAI Atelier Admin',
          email: 'admin@shopai.com',
          passwordRaw: 'admin',
          role: 'admin',
        },
      ];

      for (const demo of demoUsers) {
        const existing = await User.findOne({ email: demo.email });
        if (!existing) {
          const hashedPassword = await bcrypt.hash(demo.passwordRaw, 12);
          await User.create({
            name: demo.name,
            email: demo.email,
            password: hashedPassword,
            role: demo.role,
          });
          console.log(`[Seed] Created ${demo.role} account: ${demo.email}`);
        }
      }

      // 2. Seed products in MongoDB if collection is empty
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log(`[Seed] Seeding ${INITIAL_PRODUCTS.length} catalog products to MongoDB...`);
        for (const item of INITIAL_PRODUCTS) {
          await Product.create({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            originalPrice: item.originalPrice,
            rating: item.rating,
            reviewsCount: item.reviewsCount,
            icon: item.icon,
            badge: item.badge,
            inStock: item.inStock ?? true,
            stockCount: item.stockCount ?? 25,
            image: item.image,
            gallery: item.gallery || [item.image],
            description: item.description,
            features: item.features || [],
            specs: item.specs || {},
            reviews: item.reviews || [],
          });
        }
        console.log(`[Seed] Successfully seeded ${INITIAL_PRODUCTS.length} products to MongoDB.`);
      }
    }

    // 3. Ensure users.json also has the demo users for fallback mode
    seedFallbackUsersJson();
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
  }
}

function seedFallbackUsersJson() {
  try {
    const dir = path.dirname(USERS_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let users = [];
    if (fs.existsSync(USERS_JSON_PATH)) {
      try {
        users = JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf-8'));
      } catch {
        users = [];
      }
    }

    const demoUsers = [
      {
        id: 'usr_demo_customer',
        name: 'ShopAI Demo Customer',
        email: 'demo@shopai.com',
        passwordHash: '$2b$12$R.0sWw1qgYwYfV60jB1UheH7s9a4j1r6j1G7PZ5K6.f9F4sE8u9h.', // Demo@1234
        role: 'customer',
      },
      {
        id: 'usr_demo_admin',
        name: 'ShopAI Atelier Admin',
        email: 'admin@shopai.com',
        passwordHash: '$2b$12$Z0m3kZ9sK0J6q9g0k7l5tO3X6p1b2c3d4e5f6g7h8i9j0k1l2m3n.', // Admin@1234
        role: 'admin',
      },
    ];

    let modified = false;
    for (const demo of demoUsers) {
      if (!users.some((u) => u.email?.toLowerCase() === demo.email.toLowerCase())) {
        // Pre-compute actual hash
        const hash = bcrypt.hashSync(demo.role === 'admin' ? 'admin' : 'Demo@1234', 12);
        users.push({
          id: demo.id,
          name: demo.name,
          email: demo.email,
          password: hash,
          role: demo.role,
          createdAt: new Date().toISOString(),
          address: { street: '', city: '', state: '', pincode: '' },
        });
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(USERS_JSON_PATH, JSON.stringify(users, null, 2), 'utf-8');
      console.log('[Seed] Seeded fallback users into users.json');
    }
  } catch (err) {
    console.error('[Seed Warning] Could not seed users.json:', err.message);
  }
}

// Standalone execution: node server/config/seed.js
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  import('dotenv').then((dotenv) => {
    dotenv.config();
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopai';
    mongoose
      .connect(uri)
      .then(async () => {
        console.log(`[Seed] Connected to MongoDB at ${uri}`);
        await seedDatabase();
        await mongoose.disconnect();
        console.log('[Seed] Done. Disconnected.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('[Seed Error] Could not connect to MongoDB:', err.message);
        seedFallbackUsersJson();
        process.exit(0);
      });
  });
}
