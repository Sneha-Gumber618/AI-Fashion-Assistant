import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Sparkles, Copy } from 'lucide-react';

export default function Ticker() {
  const { showToast } = useNotification();

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code "${code}" copied to clipboard! 📋`, 'info');
  };

  return (
    <div className="bg-[#2C1D13] text-[#F5EBE0] text-xs py-2.5 px-4 overflow-hidden relative border-b border-mocha-800/80 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 font-medium overflow-hidden whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-blush-300 shrink-0 animate-pulse" />
          <span className="hidden sm:inline text-blush-200 tracking-wider text-[11px] font-bold uppercase">
            ATELIER PROMO:
          </span>
          <span className="text-mocha-100 text-[11px] tracking-wide">
            Enjoy 20% savings on new season arrivals with code:
          </span>
          <button
            onClick={() => copyCoupon('STYLE20')}
            className="inline-flex items-center gap-1 font-mono font-bold bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 border border-blush-300/30 px-2.5 py-0.5 rounded-full text-blush-200 transition-all cursor-pointer shadow-2xs"
            title="Click to copy coupon code"
          >
            <span>STYLE20</span>
            <Copy className="w-3 h-3 opacity-75" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-mocha-300 text-[11px] tracking-wider uppercase">
          <span className="hidden md:inline">✦ COMPLIMENTARY SHIPPING OVER ₹999</span>
        </div>
      </div>
    </div>
  );
}
