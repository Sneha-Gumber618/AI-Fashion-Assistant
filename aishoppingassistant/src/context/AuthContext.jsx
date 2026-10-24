import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'usr_demo',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+91 98765 43210',
  address: {
    street: '42 Orchid Blossom Road, Tech Park Avenue',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560100'
  }
};

export function AuthProvider({ children }) {
  const { showToast, triggerMobilePush } = useNotification();
  
  // View mode: 'customer' | 'admin'
  const [viewRole, setViewRole] = useState(() => {
    try {
      return localStorage.getItem('shopai_view_role') || 'customer';
    } catch {
      return 'customer';
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shopai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('shopai_orders');
      if (saved) return JSON.parse(saved);
      // Pre-seed a sample order for demonstration
      return [
        {
          id: 'ORD-894210',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'In Transit',
          totalAmount: 2499,
          items: [
            {
              id: 4,
              name: "AeroBeat Headphones",
              price: 2499,
              quantity: 1,
              category: "Electronics",
              image: "/images/aerobeat.jpg"
            }
          ],
          shippingAddress: {
            fullName: 'Alex Johnson',
            phone: '9876543210',
            street: '42 Orchid Blossom Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560100'
          },
          paymentMethod: 'UPI'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shopai_view_role', viewRole);
  }, [viewRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shopai_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shopai_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('shopai_orders', JSON.stringify(orders));
  }, [orders]);

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

  const login = (email, password) => {
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return false;
    }

    const users = JSON.parse(localStorage.getItem('shopai_registered_users') || '[]');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      if (existing.password === password) {
        setCurrentUser(existing);
        showToast(`Welcome back, ${existing.name}! ✨`, 'success');
        return true;
      } else {
        showToast('Incorrect password. Please try again.', 'error');
        return false;
      }
    } else if (email.toLowerCase() === 'alex@example.com' && password === 'password123') {
      setCurrentUser(DEMO_USER);
      showToast('Logged in as Demo User Alex! 🎉', 'success');
      return true;
    } else {
      const newUser = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0],
        email,
        phone: '+91 98765 43210',
        address: DEMO_USER.address
      };
      setCurrentUser(newUser);
      showToast(`Welcome to ShopAI, ${newUser.name}!`, 'success');
      return true;
    }
  };

  const register = (name, email, password) => {
    if (!name || !email || !password) {
      showToast('Please complete all required fields.', 'error');
      return false;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return false;
    }

    const users = JSON.parse(localStorage.getItem('shopai_registered_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showToast('An account with this email already exists.', 'error');
      return false;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      password,
      phone: '+91 98765 43210',
      address: {
        street: '12 Cyber Way, Silicon Crescent',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    };

    users.push(newUser);
    localStorage.setItem('shopai_registered_users', JSON.stringify(users));
    setCurrentUser(newUser);
    showToast('Account registered successfully! Welcome aboard 🚀', 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = (data) => {
    setCurrentUser(prev => ({
      ...prev,
      ...data
    }));
    showToast('Profile information updated successfully.', 'success');
  };

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      ...orderDetails
    };

    setOrders(prev => [newOrder, ...prev]);

    // Zomato/Swiggy style smartphone push notification
    triggerMobilePush({
      title: `🛵 Order ${newOrder.id} Placed!`,
      message: `Your payment of ₹${newOrder.totalAmount} was successful. Our atelier is packing your ${newOrder.items.length} item(s)!`,
      type: 'order',
      link: '/orders',
      badgeText: 'Order Tracking'
    });

    return newOrder;
  };

  // Admin function: Update order shipment status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord)
    );

    // Trigger Swiggy/Zomato style phone push notification
    triggerMobilePush({
      title: `🛵 Shipment Milestone: ${newStatus}`,
      message: `Order #${orderId} is now ${newStatus}! Tap to track live shipment.`,
      type: 'order',
      link: '/orders',
      badgeText: 'Live Tracking'
    });

    showToast(`Order #${orderId} status updated to ${newStatus}! Customer notified.`, 'success');
  };

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
        updateOrderStatus
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
