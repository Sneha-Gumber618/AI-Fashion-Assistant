import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Tag,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

export default function NotificationBell() {
  const {
    notificationFeed,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'order' | 'offer' | 'product'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredFeed = notificationFeed.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-700" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-blush-600" />;
      case 'product':
        return <ShoppingBag className="w-4 h-4 text-amber-700" />;
      default:
        return <Sparkles className="w-4 h-4 text-blush-600" />;
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'recently';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.round(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.round(diffHours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Animated Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-mocha-800 hover:text-blush-600 hover:bg-blush-100/60 transition-colors"
        title="Notifications Center"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blush-500 text-white text-[10px] font-bold font-mono flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Amazon / Swiggy Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[92vw] sm:w-[420px] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-mocha-200/90 z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-white border-b border-mocha-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-normal text-mocha-950">
                Atelier Updates
              </h3>
              {unreadCount > 0 && (
                <span className="bg-blush-100 text-blush-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-mono uppercase tracking-wider text-mocha-600 hover:text-blush-700 flex items-center gap-1 font-bold"
                  title="Mark all notifications as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Read all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-mocha-400 hover:text-mocha-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categorized Filter Tabs (Amazon/Swiggy style) */}
          <div className="px-4 py-2.5 bg-[#F4ECE1] border-b border-mocha-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'order', label: '📦 Orders' },
              { id: 'offer', label: '🔥 Offers' },
              { id: 'product', label: '✨ Pieces' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-mono transition-colors ${
                  activeTab === tab.id
                    ? 'bg-mocha-900 text-[#FAF7F2] font-bold shadow-2xs'
                    : 'bg-white text-mocha-700 hover:bg-[#FAF7F2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications Feed List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-mocha-100 bg-[#FAF7F2]">
            {filteredFeed.length === 0 ? (
              <div className="py-12 text-center text-xs text-mocha-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-mocha-300 stroke-1" />
                <p>No notifications in this category.</p>
              </div>
            ) : (
              filteredFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3.5 relative group ${
                    item.read
                      ? 'bg-[#FAF7F2] hover:bg-white/80'
                      : 'bg-white hover:bg-blush-50/50'
                  }`}
                >
                  {/* Category Icon */}
                  <div className="w-9 h-9 rounded-2xl bg-[#F4ECE1] flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs truncate ${
                          item.read
                            ? 'font-medium text-mocha-800'
                            : 'font-bold text-mocha-950'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-mocha-400 shrink-0">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-mocha-600 line-clamp-2 leading-relaxed font-sans">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blush-700 font-bold flex items-center gap-0.5">
                        View Details <ChevronRight className="w-2.5 h-2.5" />
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-mocha-400 hover:text-blush-700 transition-opacity"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Unread Indicator Dot */}
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blush-500 shrink-0 mt-2"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredFeed.length > 0 && (
            <div className="p-3 bg-white border-t border-mocha-200 flex items-center justify-between text-xs text-mocha-500 font-mono">
              <span className="text-[10px]">{notificationFeed.length} total updates</span>
              <button
                onClick={clearAllNotifications}
                className="text-[11px] font-mono uppercase tracking-wider text-blush-700 hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
