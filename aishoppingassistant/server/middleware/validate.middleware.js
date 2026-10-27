/**
 * Validation Middleware (Regular Expressions)
 * Input validation using RegEx patterns for email, password strength, and name.
 * Syllabus: Regular expressions for server-side input validation
 */

// ─── Regex Patterns ────────────────────────────────────────────────────────────

/** Standard email format: user@domain.tld */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strong password requirements:
 * - At least 8 characters
 * - At least 1 uppercase letter [A-Z]
 * - At least 1 lowercase letter [a-z]
 * - At least 1 digit [0-9]
 * - At least 1 special character [@$!%*?&#^()_+]
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{8,}$/;

/** Name: 2–50 characters, letters and spaces/hyphens only */
const NAME_REGEX = /^[a-zA-Z\s\-']{2,50}$/;


// ─── Validator Functions ───────────────────────────────────────────────────────

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required.' };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, message: 'Invalid email format. Example: user@example.com' };
  }
  return { valid: true };
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&#).',
    };
  }
  return { valid: true };
}

export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Name is required.' };
  }
  if (!NAME_REGEX.test(name.trim())) {
    return {
      valid: false,
      message: 'Name must be 2–50 characters, letters only (spaces and hyphens allowed).',
    };
  }
  return { valid: true };
}


// ─── Express Middleware ────────────────────────────────────────────────────────

/**
 * validateRegisterInput — middleware for POST /api/auth/register
 * Checks name, email, and password using regex validators.
 */
export function validateRegisterInput(req, res, next) {
  const { name, email, password } = req.body;

  const nameCheck = validateName(name);
  if (!nameCheck.valid) {
    return res.status(400).json({ success: false, message: nameCheck.message, field: 'name' });
  }

  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) {
    return res.status(400).json({ success: false, message: emailCheck.message, field: 'email' });
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return res.status(400).json({ success: false, message: passwordCheck.message, field: 'password' });
  }

  next(); // All validations passed
}

/**
 * validateLoginInput — middleware for POST /api/auth/login
 * Checks that email and password fields exist.
 */
export function validateLoginInput(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) {
    return res.status(400).json({ success: false, message: emailCheck.message, field: 'email' });
  }

  next();
}
