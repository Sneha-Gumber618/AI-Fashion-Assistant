/**
 * Multer Configuration
 * Handles product image uploads for the Admin panel.
 * Syllabus: Multer middleware for multipart/form-data file handling
 */

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Storage Engine ───────────────────────────────────────────────────────────
// Defines WHERE and HOW files are saved on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save all uploaded product images to public/uploads/
    const uploadPath = path.join(__dirname, '../../public/uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + sanitized original name
    // e.g., "1698321456789-product-image.jpg"
    const sanitizedName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const uniqueFilename = `${Date.now()}-${sanitizedName}`;
    cb(null, uniqueFilename);
  },
});

// ─── File Filter (Regex-based mime type validation) ───────────────────────────
// Only allow image MIME types using a Regular Expression
const imageFileFilter = (req, file, cb) => {
  // Regex: match allowed image MIME types
  const allowedMimeTypes = /^image\/(jpeg|jpg|png|webp|gif)$/;
  const isAllowed = allowedMimeTypes.test(file.mimetype);

  if (isAllowed) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error(
        `Invalid file type: "${file.mimetype}". Only JPEG, PNG, WebP, and GIF images are allowed.`
      ),
      false // Reject the file
    );
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1,                   // Max 1 file per request
  },
});

export default upload;
