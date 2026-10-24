import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { playNotificationSound } from '../utils/sound';

const NotificationContext = createContext(null);

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'offer',
    title: '🔥 20% Privilege Discount Unlocked',
    message: 'Welcome offer! Apply code "STYLE20" at checkout for 20% off your order.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    link: '/products',
    badgeText: 'Offer'
  },
  {
    id: 'notif_2',
    type: 'product',
    title: '✨ Restocked: SunShield SPF 50',
    message: 'The zero white cast bestseller sunscreen is back in inventory.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    link: '/product/1',
    badgeText: 'Catalog'
  },
  {
    id: 'notif_3',
    type: 'system',
    title: '🤖 Meet Your Personal AI Stylist',
    message: 'Need help choosing? Ask our AI Stylist for custom recommendations by budget & category.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/assistant',
    badgeText: 'Atelier'
  }
];

export function NotificationProvider({ children }) {
  // 1. Toast notifications (bottom-right pills)
  const [toasts, setToasts] = useState([]);

  // 2. Notification Center feed (Amazon/Zomato notification drawer)
  const [notificationFeed, setNotificationFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('shopai_notifications_feed');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // 3. Zomato/Swiggy/iOS Style Smartphone Push Notification Banner (Top of screen)
  const [activeMobilePush, setActiveMobilePush] = useState(null);

  useEffect(() => {
    localStorage.setItem('shopai_notifications_feed', JSON.stringify(notificationFeed));
  }, [notificationFeed]);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Show standard bottom toast
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  // Trigger Zomato/Swiggy/Amazon smartphone push notification
  const triggerMobilePush = useCallback(({
    title,
    message,
    type = 'order', // 'order' | 'offer' | 'product' | 'system'
    link = '/orders',
    badgeText = 'ShopAI',
    sound = true,
    duration = 6000
  }) => {
    const id = 'notif_' + Date.now();
    const newNotif = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link,
      badgeText
    };

    // Add to persistent notification feed
    setNotificationFeed((prev) => [newNotif, ...prev]);

    // Show simulated phone push banner
    setActiveMobilePush(newNotif);

    if (sound) {
      playNotificationSound();
    }

    if (duration > 0) {
      setTimeout(() => {
        setActiveMobilePush((current) => (current?.id === id ? null : current));
      }, duration);
    }
  }, []);

  const dismissMobilePush = () => {
    setActiveMobilePush(null);
  };

  const markAsRead = (id) => {
    setNotificationFeed((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotificationFeed((prev) => prev.map((item) => ({ ...item, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id) => {
    setNotificationFeed((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllNotifications = () => {
    setNotificationFeed([]);
    showToast('Notification center cleared', 'info');
  };

  const unreadCount = notificationFeed.filter((item) => !item.read).length;

  // Delightful Zomato/Swiggy style smart nudge after 15 seconds
  useEffect(() => {
    const hasNudged = sessionStorage.getItem('shopai_zomato_nudge_sent');
    if (!hasNudged) {
      const timer = setTimeout(() => {
        sessionStorage.setItem('shopai_zomato_nudge_sent', 'true');
        triggerMobilePush({
          title: '☕ Style Break with ShopAI',
          message: 'BrewMate Coffee Maker & Aesthetic Streetwear are trending this hour. Code "STYLE20" active!',
          type: 'offer',
          link: '/product/10',
          badgeText: 'Trending Nudge'
        });
      }, 14000);

      return () => clearTimeout(timer);
    }
  }, [triggerMobilePush]);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        notificationFeed,
        unreadCount,
        activeMobilePush,
        triggerMobilePush,
        dismissMobilePush,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
