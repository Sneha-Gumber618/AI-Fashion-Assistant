/**
 * JWT Auth Middleware
 * Protects routes that require authentication.
 * Syllabus: JWT verification, middleware pattern in Express
 */

import jwt from 'jsonwebtoken';

/**
 * verifyToken — Express middleware
 * Extracts the Bearer token from Authorization header,
 * verifies it with JWT_SECRET, and attaches decoded user to req.user.
 */
export function verifyToken(req, res, next) {
  // Extract "Authorization: Bearer <token>" header
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided. Please log in.',
    });
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

  try {
    // Verify the token signature and expiry using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload (user id, email, name) to the request
    req.user = decoded;
    next(); // Proceed to the actual route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or tampered token. Access denied.',
    });
  }
}
