/**
 * JWT Auth Middleware
 * Protects routes that require authentication and role-based access control.
 * Syllabus: JWT verification, RBAC (Role-Based Access Control), Express middleware
 */

import jwt from 'jsonwebtoken';

/**
 * verifyToken — Express middleware
 * Extracts the Bearer token from Authorization header,
 * verifies it with JWT_SECRET, and attaches decoded user to req.user.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided. Please log in.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or tampered token. Access denied.',
      code: 'INVALID_TOKEN',
    });
  }
}

/**
 * requireAdmin — Express middleware
 * Ensures the authenticated user has an 'admin' role.
 * Must be used after verifyToken middleware.
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in first.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Administrator privileges required for this action.',
    });
  }

  next();
}

/**
 * requireRole — Express middleware factory
 * Allows specific roles to access the route.
 * Example: requireRole('admin', 'manager')
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in first.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
}
