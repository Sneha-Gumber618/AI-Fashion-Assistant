/**
 * Upload Routes — Express Router (Multer)
 * POST /api/upload/product-image — Upload a product image (JWT protected)
 * GET  /api/upload/files          — List all uploaded files
 *
 * Syllabus: Multer file uploads, JWT protection on routes, static file serving
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import upload from '../config/multer.config.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── POST /api/upload/product-image ───────────────────────────────────────────
/**
 * Upload a product image file.
 * Protected: Only authenticated admins can upload product images.
 *
 * Multer processes the multipart/form-data request,
 * validates file type via regex (in multer.config.js),
 * and saves the file to public/uploads/.
 *
 * Field name: "productImage"
 */
router.post(
  '/product-image',
  verifyToken,                          // 1. Verify JWT first
  upload.single('productImage'),        // 2. Multer processes the file
  (req, res) => {
    // If no file was included in the request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please attach a product image.',
      });
    }

    // Build the public URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: 'Product image uploaded successfully!',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: fileUrl,                   // Public URL to use in product listings
        uploadedBy: req.user.email,     // From decoded JWT
        uploadedAt: new Date().toISOString(),
      },
    });
  }
);

// ─── GET /api/upload/files ────────────────────────────────────────────────────
/**
 * List all uploaded product images.
 * Protected: JWT required.
 */
router.get('/files', verifyToken, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR).map((filename) => {
      const filePath = path.join(UPLOADS_DIR, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stats.size,
        uploadedAt: stats.birthtime.toISOString(),
      };
    });

    return res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    console.error('[Upload] List files error:', error);
    return res.status(500).json({ success: false, message: 'Could not retrieve files.' });
  }
});

// ─── Multer Error Handler ─────────────────────────────────────────────────────
// Catches errors specifically from Multer (file size, file type rejections)
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum allowed size is 5MB.',
    });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(415).json({
      success: false,
      message: err.message,
    });
  }
  next(err);
});

export default router;
