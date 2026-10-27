/**
 * Auth Routes — Express Router
 * POST /api/auth/register  — Register new user (bcrypt hash + JWT)
 * POST /api/auth/login     — Login (bcrypt compare + JWT issue)
 * GET  /api/auth/me        — Get current user (JWT protected)
 *
 * Syllabus: Bcrypt hashing, JWT sign/verify, Express routing, RegEx validation
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { validateRegisterInput, validateLoginInput } from '../middleware/validate.middleware.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to our simple JSON "database"
const USERS_DB_PATH = path.join(__dirname, '../db/users.json');

// ─── Helper: Read / Write Users DB ────────────────────────────────────────────

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.mkdirSync(path.dirname(USERS_DB_PATH), { recursive: true });
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

// ─── Helper: Sign JWT ──────────────────────────────────────────────────────────

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// ─── POST /api/auth/register ───────────────────────────────────────────────────
/**
 * Register a new user account.
 * 1. Validate input with Regex middleware (validateRegisterInput)
 * 2. Check if email already exists
 * 3. Hash password with bcrypt (saltRounds = 12)
 * 4. Save user to JSON database
 * 5. Sign and return a JWT token
 */
router.post('/register', validateRegisterInput, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const users = readUsers();

    // Check if email already registered (case-insensitive)
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
        field: 'email',
      });
    }

    // ── Bcrypt: Hash the password with 12 salt rounds ──────────────────────
    // Higher salt rounds = more secure but slower. 12 is industry standard.
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Build new user object — NEVER store plain-text password
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,   // ← bcrypt hash, NOT plain text
      role: 'customer',
      createdAt: new Date().toISOString(),
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
      },
    };

    users.push(newUser);
    writeUsers(users);

    // ── JWT: Sign a token with user's id, name, email, role ───────────────
    const token = signToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    // Return token and user (excluding password)
    const { password: _pw, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to ShopAI ✨',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
    });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
/**
 * Log in an existing user.
 * 1. Validate email + password presence
 * 2. Find user by email
 * 3. Compare submitted password with bcrypt hash → bcrypt.compare()
 * 4. Sign and return a JWT token
 */
router.post('/login', validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = readUsers();

    // Find user by email (case-insensitive)
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    // Security: Same generic error for "user not found" and "wrong password"
    // This prevents user enumeration attacks
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // ── Bcrypt: Compare submitted password against stored hash ─────────────
    // bcrypt.compare() handles all the salt/hash logic internally
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // ── JWT: Issue a fresh token ───────────────────────────────────────────
    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Return token + user profile (no password)
    const { password: _pw, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! 🎉`,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
/**
 * Protected route — get the currently authenticated user's profile.
 * Requires: Authorization: Bearer <token>
 * The verifyToken middleware decodes the JWT and sets req.user.
 */
router.get('/me', verifyToken, (req, res) => {
  try {
    const users = readUsers();

    // Find full user profile by ID from decoded JWT
    const user = users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    // Return profile without password
    const { password: _pw, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('[Auth] /me error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
