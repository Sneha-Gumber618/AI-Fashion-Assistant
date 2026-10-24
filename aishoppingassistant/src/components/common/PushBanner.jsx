import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { Sparkles, X, ChevronRight, Bell, Tag, Package, ShoppingBag } from 'lucide-react';

export default function PushBanner() {
  const { activeMobilePush, dismissMobilePush, markAsRead } = useNotification();
  const navigate = useNavigate();

  if (!activeMobilePush) return null;

  const handleClick = () => {
    markAsRead(activeMobilePush.id);
    dismissMobilePush();
    if (activeMobilePush.link) {
      navigate(activeMobilePush.link);
    }
  };

  const getIcon = () => {
    switch (activeMobilePush.type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-blush-400" />;
      case 'product':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-blush-300" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-md animate-slide-up">
      {/* Smartphone Push Notification Bubble (Zomato/Swiggy/iOS Dynamic Island style) */}
      <div
        onClick={handleClick}
        className="bg-[#2C1E14]/95 backdrop-blur-xl border border-mocha-700/80 rounded-3xl p-4 shadow-2xl text-[#FAF7F2] cursor-pointer hover:bg-[#2C1E14] transition-all transform hover:scale-[1.01] active:scale-[0.99] group select-none"
      >
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-mocha-800 to-blush-600 flex items-center justify-center text-white shrink-0 shadow-sm border border-mocha-600/50">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header / App Info */}
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-mocha-400 mb-0.5">
              <span className="flex items-center gap-1.5 font-bold text-blush-300">
                <span>SHOPAI ATELIER</span>
                <span>•</span>
                <span className="text-mocha-400 font-normal">now</span>
              </span>

              <span className="bg-mocha-800/80 px-2 py-0.5 rounded-full text-[9px] text-mocha-300">
                {activeMobilePush.badgeText || 'Notice'}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1">
              {activeMobilePush.title}
            </h4>

            {/* Message Body */}
            <p className="text-xs text-mocha-200 mt-0.5 line-clamp-2 leading-relaxed font-sans">
              {activeMobilePush.message}
            </p>

            <div className="flex items-center gap-1 text-[11px] font-mono text-blush-300 mt-2 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Tap to view details</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissMobilePush();
            }}
            className="p-1 rounded-full text-mocha-400 hover:text-white hover:bg-mocha-800 transition-colors"
            title="Dismiss notification"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
