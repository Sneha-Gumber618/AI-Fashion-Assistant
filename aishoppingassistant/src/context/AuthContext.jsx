import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNotification } from './NotificationContext';
import { loginUserAPI, registerUserAPI, getMeAPI } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'shopai_auth_token';
const USER_KEY = 'shopai_user';
const ADMIN_TOKEN_KEY = 'shopai_admin_token';
const ADMIN_USER_KEY = 'shopai_admin_user';
const GUEST_KEY = 'shopai_is_guest';

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
  return token;
}

function getStoredAdminToken() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
  return token;
}

export function AuthProvider({ children }) {
  const { showToast, triggerMobilePush } = useNotification();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const isGuestStored = sessionStorage.getItem(GUEST_KEY);
      if (isGuestStored === 'true') {
        return { id: 'guest_user', name: 'Guest Explorer', role: 'guest', isGuest: true };
      }

      const token = getStoredToken();
      if (!token) return null;

      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const token = getStoredAdminToken();
      if (!token) return null;

      const saved = localStorage.getItem(ADMIN_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.role === 'admin' ? parsed : null;
      }
      return null;
    } catch {
      return null;
    }
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
            {
              id: 4,
              name: 'AeroBeat Headphones',
              price: 2499,
              quantity: 1,
              category: 'Electronics',
              image: '/images/aerobeat.jpg',
            },
          ],
          shippingAddress: {
            fullName: 'Alex Johnson',
            phone: '9876543210',
            street: '42 Orchid Blossom Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560100',
          },
          paymentMethod: 'UPI',
        },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shopai_orders', JSON.stringify(orders));
  }, [orders]);

  const isGuest = Boolean(currentUser?.isGuest || currentUser?.role === 'guest');
  const isAuthenticated = Boolean(currentUser && !isGuest);
  const isAdmin = Boolean((adminUser && adminUser.role === 'admin') || (currentUser && currentUser.role === 'admin'));
  const viewRole = isAdmin ? 'admin' : 'customer';

  useEffect(() => {
    const handleUnauthorized = () => {
      if (!isGuest) {
        setCurrentUser(null);
        showToast('Your session has expired. Please log in again.', 'warning');
      }
    };

    window.addEventListener('shopai:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('shopai:unauthorized', handleUnauthorized);
  }, [showToast, isGuest]);

  useEffect(() => {
    if (isGuest || !getStoredToken()) return undefined;

    let active = true;
    getMeAPI()
      .then(({ user }) => {
        if (active && user) {
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          setCurrentUser(user);
        }
      })
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error('[Auth] Could not verify the saved session:', error);
        }
      });

    return () => {
      active = false;
    };
  }, [isGuest]);

  const continueAsGuest = useCallback(() => {
    sessionStorage.setItem(GUEST_KEY, 'true');
    const guestObj = { id: 'guest_' + Date.now(), name: 'Guest Explorer', role: 'guest', isGuest: true };
    setCurrentUser(guestObj);
    showToast('Browsing catalog as Guest. Sign in when ready to view full details or purchase! ✨', 'info');
    return guestObj;
  }, [showToast]);

  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return false;
    }

    try {
      const data = await loginUserAPI({ email, password });

      if (data.success) {
        sessionStorage.removeItem(GUEST_KEY);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setCurrentUser(data.user);

        if (data.user.role === 'admin') {
          localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
          setAdminUser(data.user);
        }

        showToast(`Welcome back, ${data.user.name}! ✨`, 'success');
        return true;
      }
      return false;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please verify your credentials.';
      showToast(message, 'error');
      return false;
    }
  }, [showToast]);

  const register = useCallback(async (name, email, password) => {
    if (!name || !email || !password) {
      showToast('Please complete all required fields.', 'error');
      return false;
    }

    try {
      const data = await registerUserAPI({ name, email, password });

      if (data.success) {
        sessionStorage.removeItem(GUEST_KEY);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setCurrentUser(data.user);
        showToast('Account created successfully! Welcome to ShopAI 🚀', 'success');
        return true;
      }
      return false;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(message, 'error');
      return false;
    }
  }, [showToast]);

  const adminLogin = useCallback(async (email, password) => {
    if (!email || !password) {
      showToast('Please provide both administrator email and security password.', 'error');
      return { success: false, message: 'Please enter both administrator credentials.' };
    }

    try {
      const data = await loginUserAPI({ email, password });

      if (data.success) {
        if (data.user.role !== 'admin') {
          const errMessage = 'Access Forbidden: Customer credentials are not authorized for Administrator Portal.';
          showToast(errMessage, 'error');
          return { success: false, message: errMessage };
        }

        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
        setAdminUser(data.user);
        showToast(`Welcome to Atelier Merchant Portal, ${data.user.name}! ⚙️`, 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Invalid credentials.' };
    } catch (error) {
      const message = error.response?.data?.message || 'Administrator authentication failed.';
      showToast(message, 'error');
      return { success: false, message };
    }
  }, [showToast]);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdminUser(null);
    showToast('Administrator logged out successfully.', 'info');
  }, [showToast]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(GUEST_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
  }, [showToast]);

  const updateProfile = useCallback((data) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
    showToast('Profile updated successfully.', 'success');
  }, [showToast]);

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
      message: `Your order of ₹${newOrder.totalAmount} was placed successfully. Preparing dispatch!`,
      type: 'order',
      link: '/orders',
      badgeText: 'Order Tracking',
    });

    return newOrder;
  }, [triggerMobilePush]);

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
        adminUser,
        isAuthenticated,
        isGuest,
        isAdmin,
        viewRole,
        continueAsGuest,
        login,
        register,
        logout,
        adminLogin,
        adminLogout,
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
