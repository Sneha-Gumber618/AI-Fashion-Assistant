/**
 * Database Connection Handler (MongoDB + Mongoose)
 * Connects to MongoDB, manages connection lifecycle, and seeds initial data.
 * Syllabus: MongoDB + Mongoose connection, events, and resilient error handling
 */

import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

let isConnected = false;

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopai';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[Database] ✅ Connected to MongoDB database: "${mongoose.connection.name}"`);

    // Listen to connection events
    mongoose.connection.on('error', (err) => {
      console.error('[Database Error]', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[Database] Disconnected from MongoDB.');
    });

    // Seed default products and demo accounts
    await seedDatabase();
  } catch (error) {
    isConnected = false;
    console.warn('\n--------------------------------------------------------------');
    console.warn(`[Database Notice] Could not connect to MongoDB (${uri})`);
    console.warn(`Reason: ${error.message}`);
    console.warn('👉 The server will continue in RESILIENT FALLBACK MODE.');
    console.warn('👉 To connect to a live MongoDB database:');
    console.warn('   1. Start your local MongoDB server (mongod)');
    console.warn('   2. Or set MONGODB_URI in .env to a MongoDB Atlas cluster URI');
    console.warn('--------------------------------------------------------------\n');

    // Also ensure fallback users are seeded
    try {
      await seedDatabase();
    } catch {
      // ignore
    }
  }

  return isConnected;
}

export default connectDatabase;
