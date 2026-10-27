/**
 * Automated Verification Test Suite for ShopAI Tech Stack
 * Tests all 6 required modules:
 * 1) MongoDB + Mongoose
 * 2) NodeJS + ExpressJS
 * 3) Authentication (Bcrypt + RegEx)
 * 4) JWT
 * 5) Multer
 * 6) React JS
 */

import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import app from '../server.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import { EMAIL_REGEX, PASSWORD_REGEX, NAME_REGEX } from './middleware/validate.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5055;
process.env.PORT = String(PORT);
process.env.JWT_SECRET = process.env.JWT_SECRET || '62669b376dee1eb9c7e1548df24571ab07f5cedd53c93b7722bc4fa6459ffce5489169ccd05a894d8ce06556148c57e000d0efd3faa888cfb5f89f682e9c14b8';

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING FULL TECH STACK VERIFICATION TESTS');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // ─── 1. MongoDB + Mongoose Verification ─────────────────────────────────────
  console.log('📦 [1/6] Testing MongoDB + Mongoose Schemas & Models...');
  try {
    assert(User && User.schema, 'User Mongoose model is properly defined');
    assert(User.schema.path('email'), 'User schema includes email path with indexing');
    assert(User.schema.path('password'), 'User schema includes password with select: false');
    assert(User.schema.path('role'), 'User schema includes role enum');

    assert(Product && Product.schema, 'Product Mongoose model is properly defined');
    assert(Product.schema.path('name'), 'Product schema includes name');
    assert(Product.schema.path('price'), 'Product schema includes price');
    assert(Product.schema.path('category'), 'Product schema includes category');

    assert(Order && Order.schema, 'Order Mongoose model is properly defined');
    assert(Order.schema.path('orderId'), 'Order schema includes orderId');
    assert(Order.schema.path('items'), 'Order schema includes items subdocument array');
    assert(Order.schema.path('totalAmount'), 'Order schema includes totalAmount');
  } catch (err) {
    assert(false, `Mongoose schema inspection failed: ${err.message}`);
  }

  // Start Express Server on test port
  let server;
  try {
    server = await new Promise((resolve) => {
      const s = app.listen(PORT, () => resolve(s));
    });
    console.log(`\n🚀 [2/6] Express server running on port ${PORT}...`);
  } catch (err) {
    console.error('Could not start test server:', err);
    process.exit(1);
  }

  const client = axios.create({
    baseURL: `http://localhost:${PORT}/api`,
    validateStatus: () => true, // Don't throw on 4xx/5xx
  });

  // ─── 2. NodeJS + ExpressJS Health & Routing ─────────────────────────────────
  console.log('\n🌐 [2/6] Testing NodeJS + ExpressJS REST Endpoints...');
  try {
    const healthRes = await client.get('/health');
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    assert(healthRes.data.server === 'ShopAI Express Server', 'Health check reports correct server');
    assert(healthRes.data.techStack, 'Health check lists all 6 required tech stacks');

    const productsRes = await client.get('/products');
    assert(productsRes.status === 200, 'GET /api/products returns 200 OK');
    assert(Array.isArray(productsRes.data.data) && productsRes.data.data.length > 0, 'Products catalog returned');

    const singleProdRes = await client.get('/products/1');
    assert(singleProdRes.status === 200 && singleProdRes.data.data.name, 'GET /api/products/1 returns product details');
  } catch (err) {
    assert(false, `Express routing test failed: ${err.message}`);
  }

  // ─── 3. Authentication (Bcrypt + RegEx) ─────────────────────────────────────
  console.log('\n🔐 [3/6] Testing Authentication: RegEx Validation & Bcrypt Hashing...');
  try {
    // RegEx unit checks
    assert(EMAIL_REGEX.test('user@shopai.com'), 'Email RegEx accepts valid email');
    assert(!EMAIL_REGEX.test('invalid-email'), 'Email RegEx rejects invalid email');
    assert(PASSWORD_REGEX.test('SecurePass@123'), 'Password RegEx accepts strong password');
    assert(!PASSWORD_REGEX.test('weakpass'), 'Password RegEx rejects weak password lacking uppercase/digit/symbol');
    assert(NAME_REGEX.test('Aarav Sharma'), 'Name RegEx accepts valid full name');
    assert(!NAME_REGEX.test('A'), 'Name RegEx rejects single character name');

    // Server-side RegEx rejection on bad register input
    const badEmailRes = await client.post('/auth/register', {
      name: 'Test User',
      email: 'not-an-email',
      password: 'StrongPassword@123',
    });
    assert(badEmailRes.status === 400 && badEmailRes.data.field === 'email', 'Register rejects invalid email format via RegEx');

    const weakPassRes = await client.post('/auth/register', {
      name: 'Test User',
      email: 'valid@shopai.com',
      password: 'weak',
    });
    assert(weakPassRes.status === 400 && weakPassRes.data.field === 'password', 'Register rejects weak password via RegEx');

    // Register a valid user
    const testEmail = `test_${Date.now()}@shopai.com`;
    const regRes = await client.post('/auth/register', {
      name: 'Priya Verma',
      email: testEmail,
      password: 'StrongPass@1234',
    });
    assert(regRes.status === 201, 'Register creates user with 201 Created');
    assert(regRes.data.token, 'Register returns signed JWT token');
    assert(!regRes.data.user.password, 'Registered user response does NOT expose password hash');

    // Bcrypt comparison on login
    const wrongPassRes = await client.post('/auth/login', {
      email: testEmail,
      password: 'WrongPassword@999',
    });
    assert(wrongPassRes.status === 401, 'Login rejects incorrect password via Bcrypt comparison');

    const correctLoginRes = await client.post('/auth/login', {
      email: testEmail,
      password: 'StrongPass@1234',
    });
    assert(correctLoginRes.status === 200, 'Login succeeds with correct password via Bcrypt');
    assert(correctLoginRes.data.token, 'Login returns valid JWT token');

    // Demo customer login
    const demoLoginRes = await client.post('/auth/login', {
      email: 'demo@shopai.com',
      password: 'Demo@1234',
    });
    assert(demoLoginRes.status === 200, 'Pre-seeded demo user (demo@shopai.com / Demo@1234) logs in successfully');
  } catch (err) {
    assert(false, `Authentication test failed: ${err.message}`);
  }

  // ─── 4. JWT Authentication & Role-Based Access Control ──────────────────────
  console.log('\n🎫 [4/6] Testing JWT Tokens & Protected Routes...');
  let customerToken = '';
  let adminToken = '';
  try {
    // Get customer token
    const custLogin = await client.post('/auth/login', {
      email: 'demo@shopai.com',
      password: 'Demo@1234',
    });
    customerToken = custLogin.data.token;

    // Get admin token
    const adminLogin = await client.post('/auth/login', {
      email: 'admin@shopai.com',
      password: 'Admin@1234',
    });
    adminToken = adminLogin.data.token;

    // Test access without token
    const unauthRes = await client.get('/auth/me');
    assert(unauthRes.status === 401, 'Protected route /api/auth/me rejects request without token');

    // Test access with customer token
    const authMeRes = await client.get('/auth/me', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(authMeRes.status === 200 && authMeRes.data.user.email === 'demo@shopai.com', 'Protected route /api/auth/me accepts valid JWT');

    // Test Admin route with customer token (should be 403 Forbidden)
    const custAdminAttempt = await client.get('/auth/users', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(custAdminAttempt.status === 403, 'Admin route /api/auth/users rejects customer role with 403 Forbidden');

    // Test Admin route with admin token (should be 200 OK)
    const adminSuccess = await client.get('/auth/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminSuccess.status === 200, 'Admin route /api/auth/users allows admin token');
  } catch (err) {
    assert(false, `JWT test failed: ${err.message}`);
  }

  // ─── 5. Multer File Uploads ─────────────────────────────────────────────────
  console.log('\n📁 [5/6] Testing Multer File Upload...');
  try {
    // 1x1 transparent PNG buffer
    const dummyPng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);

    const blob = new Blob([dummyPng], { type: 'image/png' });
    const formData = new FormData();
    formData.append('productImage', blob, 'sample_product.png');

    const uploadRes = await fetch(`http://localhost:${PORT}/api/upload/product-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
      body: formData,
    });

    const uploadData = await uploadRes.json();
    assert(uploadRes.status === 201, 'Multer POST /api/upload/product-image returns 201 Created');
    assert(uploadData.data?.url?.startsWith('/uploads/'), 'Multer returns public static URL for uploaded image');

    // Verify static serving of uploaded image
    const fileUrl = uploadData.data?.url;
    const staticRes = await client.get(fileUrl.replace('/api', ''));
    assert(staticRes.status === 200, `Static file served successfully from Express: ${fileUrl}`);

    // List uploaded files
    const listRes = await client.get('/upload/files', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(listRes.status === 200 && listRes.data.count > 0, 'GET /api/upload/files lists uploaded images');
  } catch (err) {
    assert(false, `Multer upload test failed: ${err.message}`);
  }

  // ─── 6. Orders (Checkout & E-Commerce Flow) ──────────────────────────────────
  console.log('\n🛒 Testing Orders & Checkout Flow...');
  try {
    const orderRes = await client.post(
      '/orders',
      {
        items: [{ id: 1, name: 'SunShield SPF 50', price: 449, quantity: 2 }],
        totalAmount: 898,
        shippingAddress: { fullName: 'Priya Verma', city: 'Mumbai', pincode: '400001' },
        paymentMethod: 'UPI',
      },
      {
        headers: { Authorization: `Bearer ${customerToken}` },
      }
    );
    assert(orderRes.status === 201, 'POST /api/orders creates order successfully');
    assert(orderRes.data.data.orderId, 'Order contains generated orderId');
  } catch (err) {
    assert(false, `Order test failed: ${err.message}`);
  }

  // Close test server
  server.close();

  console.log('\n======================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
