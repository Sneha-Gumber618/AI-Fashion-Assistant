/**
 * AuthContext — Updated to use Express API + JWT + Bcrypt
 *
 * Login and Register now call the real backend API.
 * JWT token is stored in localStorage and auto-attached to all requests.
 * Passwords are NEVER stored client-side — bcrypt handles it on the server.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNotification } from './NotificationContext';
import { loginUserAPI, registerUserAPI, getMeAPI } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'shopai_auth_token';
const USER_KEY = 'shopai_user';

// ─── Helper: Check if JWT token is expired ────────────────────────────────────
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    // decoded.exp is in seconds; Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true; // If decode fails, treat as expired
  }
}

// ─── Helper: Get token from localStorage ─────────────────────────────────────
function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
  return token;
}

export function AuthProvider({ children }) {
  const { showToast, triggerMobilePush } = useNotification();

  // View mode: 'customer' | 'admin'
  const [viewRole, setViewRole] = useState(() => {
    try { return localStorage.getItem('shopai_view_role') || 'customer'; }
    catch { return 'customer'; }
  });

  // Initialize user from stored JWT — only if token is still valid
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = getStoredToken();
      if (!token) return null;
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('shopai_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ORD-894210',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'In Transit',
          totalAmount: 2499,
          items: [
            { id: 4, name: "AeroBeat Headphones", price: 2499, quantity: 1, category: "Electronics", image: "/images/aerobeat.jpg" }
          ],
          shippingAddress: { fullName: 'Alex Johnson', phone: '9876543210', street: '42 Orchid Blossom Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560100' },
          paymentMethod: 'UPI'
        }
      ];
    } catch { return []; }
  });

  // Persist viewRole
  useEffect(() => { localStorage.setItem('shopai_view_role', viewRole); }, [viewRole]);

  // Persist orders
  useEffect(() => { localStorage.setItem('shopai_orders', JSON.stringify(orders)); }, [orders]);

  // ─── Listen for 401 Unauthorized (token expired mid-session) ──────────────
  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      showToast('Your session has expired. Please log in again.', 'warning');
    };
    window.addEventListener('shopai:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('shopai:unauthorized', handleUnauthorized);
  }, [showToast]);

  const toggleViewRole = () => {
    const nextRole = viewRole === 'customer' ? 'admin' : 'customer';
    setViewRole(nextRole);
    showToast(
      nextRole === 'admin'
        ? 'Switched to Admin / Seller Portal ⚙️ You can now register and sell products.'
        : 'Switched to Customer Storefront 🛍️ You can now browse and purchase pieces.',
      'info'
    );
  };

  // ─── LOGIN — calls Express API (bcrypt compare on server, JWT returned) ────
  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return false;
    }

    try {
      const data = await loginUserAPI({ email, password });

      if (data.success) {
        // Store JWT token
        localStorage.setItem(TOKEN_KEY, data.token);
        // Store user profile (no password — bcrypt handled it on server)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setCurrentUser(data.user);
        showToast(`Welcome back, ${data.user.name}! ✨`, 'success');
        return true;
      }
    } catch (error) {
      // API returned an error response (401, 400, etc.)
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(message, 'error');
      return false;
    }

    return false;
  }, [showToast]);

  // ─── REGISTER — calls Express API (bcrypt hash on server, JWT returned) ───
  const register = useCallback(async (name, email, password) => {
    if (!name || !email || !password) {
      showToast('Please complete all required fields.', 'error');
      return false;
    }

    try {
      const data = await registerUserAPI({ name, email, password });

      if (data.success) {
        // Store JWT token
        localStorage.setItem(TOKEN_KEY, data.token);
        // Store user profile
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setCurrentUser(data.user);
        showToast('Account created successfully! Welcome to ShopAI 🚀', 'success');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(message, 'error');
      return false;
    }

    return false;
  }, [showToast]);

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
  }, [showToast]);

  // ─── UPDATE PROFILE ───────────────────────────────────────────────────────
  const updateProfile = useCallback((data) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
    showToast('Profile updated successfully.', 'success');
  }, [showToast]);

  // ─── PLACE ORDER ──────────────────────────────────────────────────────────
  const placeOrder = useCallback((orderDetails) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      ...orderDetails,
    };

    setOrders((prev) => [newOrder, ...prev]);

    triggerMobilePush({
      title: `🛵 Order ${newOrder.id} Placed!`,
      message: `Your payment of ₹${newOrder.totalAmount} was successful. Packing your ${newOrder.items.length} item(s)!`,
      type: 'order',
      link: '/orders',
      badgeText: 'Order Tracking',
    });

    return newOrder;
  }, [triggerMobilePush]);

  // ─── UPDATE ORDER STATUS (Admin) ──────────────────────────────────────────
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    triggerMobilePush({
      title: `🛵 Shipment Milestone: ${newStatus}`,
      message: `Order #${orderId} is now ${newStatus}! Tap to track live shipment.`,
      type: 'order',
      link: '/orders',
      badgeText: 'Live Tracking',
    });

    showToast(`Order #${orderId} status updated to ${newStatus}!`, 'success');
  }, [showToast, triggerMobilePush]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        viewRole,
        setViewRole,
        toggleViewRole,
        login,
        register,
        logout,
        updateProfile,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
