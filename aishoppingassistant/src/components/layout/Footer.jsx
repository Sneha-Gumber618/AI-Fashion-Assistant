import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { Sparkles, Mail, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  const { showToast } = useNotification();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to ShopAI Atelier VIP Drops & Lookbooks! ✨', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#1C120B] text-mocha-300 pt-16 pb-12 border-t border-mocha-900 mt-20">
      {/* Editorial Value Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-mocha-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blush-500/10 border border-blush-400/20 text-blush-300 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#FAF7F2] font-bold">Express Delivery</h4>
              <p className="text-xs text-mocha-400 mt-0.5">Complimentary on orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-mocha-500/10 border border-mocha-400/20 text-mocha-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#FAF7F2] font-bold">Curated Authenticity</h4>
              <p className="text-xs text-mocha-400 mt-0.5">100% verified atelier standards</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#FAF7F2] font-bold">Effortless Returns</h4>
              <p className="text-xs text-mocha-400 mt-0.5">7-day doorstep pickup & refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blush-500/10 border border-blush-400/20 text-blush-300 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#FAF7F2] font-bold">AI Stylist Atelier</h4>
              <p className="text-xs text-mocha-400 mt-0.5">24/7 intelligent wardrobe consulting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-mocha-800 to-blush-600 flex items-center justify-center text-[#FAF7F2] shadow-sm">
              <Sparkles className="w-4 h-4 text-blush-200" />
            </div>
            <span className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-[#FAF7F2]">
              SHOP<span className="text-blush-400 font-semibold italic">AI</span>
            </span>
          </Link>
          <p className="text-xs text-mocha-400 leading-relaxed max-w-sm font-sans">
            ShopAI is an intelligent luxury shopping destination and style atelier. Discover curated skincare, aesthetic apparel, and tactile electronics with effortless, natural clarity.
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-mocha-500 block mb-2 font-bold">
              Atelier Guarantees
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-mocha-900 border border-mocha-800 text-[10px] text-blush-300">100% Authentic</span>
              <span className="px-2.5 py-0.5 rounded-full bg-mocha-900 border border-mocha-800 text-[10px] text-mocha-300">Express Delivery</span>
              <span className="px-2.5 py-0.5 rounded-full bg-mocha-900 border border-mocha-800 text-[10px] text-blush-200">Encrypted Checkout</span>
              <span className="px-2.5 py-0.5 rounded-full bg-mocha-900 border border-mocha-800 text-[10px] text-mocha-300">7-Day Returns</span>
              <span className="px-2.5 py-0.5 rounded-full bg-mocha-900 border border-mocha-800 text-[10px] text-blush-300">Quality Verified</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FAF7F2] mb-4 font-bold">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs text-mocha-400">
            <li><Link to="/" className="hover:text-blush-300 transition-colors">Atelier Collection</Link></li>
            <li><Link to="/products" className="hover:text-blush-300 transition-colors">All Pieces</Link></li>
            <li><Link to="/assistant" className="hover:text-blush-300 transition-colors">AI Shopping Stylist</Link></li>
            <li><Link to="/orders" className="hover:text-blush-300 transition-colors">Shipment Tracking</Link></li>
            <li><Link to="/cart" className="hover:text-blush-300 transition-colors">Shopping Bag</Link></li>
            <li><Link to="/wishlist" className="hover:text-blush-300 transition-colors">Saved Pieces</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FAF7F2] mb-4 font-bold">
            Categories
          </h4>
          <ul className="space-y-2.5 text-xs text-mocha-400">
            <li><Link to="/products" className="hover:text-blush-300 transition-colors">Skincare & Daily Shields</Link></li>
            <li><Link to="/products" className="hover:text-blush-300 transition-colors">Acoustics & Headwear</Link></li>
            <li><Link to="/products" className="hover:text-blush-300 transition-colors">Tactile Mechanical Keyboards</Link></li>
            <li><Link to="/products" className="hover:text-blush-300 transition-colors">Minimalist Sneakers & Tops</Link></li>
            <li><Link to="/products" className="hover:text-blush-300 transition-colors">Smart Living & Lamps</Link></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FAF7F2] mb-4 font-bold">
            Atelier Dispatch
          </h4>
          <p className="text-xs text-mocha-400 mb-3">
            Receive exclusive seasonal capsule drops, styling notes, and private promos.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <Mail className="w-4 h-4 text-mocha-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-mocha-900/90 text-xs text-[#FAF7F2] placeholder-mocha-500 pl-9 pr-3 py-2.5 rounded-full border border-mocha-800 focus:outline-none focus:border-blush-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FAF7F2] hover:bg-blush-200 text-mocha-950 text-xs font-bold py-2.5 rounded-full transition-colors uppercase tracking-wider"
            >
              {subscribed ? 'Subscribed' : 'Join Atelier'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-mocha-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mocha-500 font-mono">
        <p>© 2026 ShopAI Atelier. High-Fashion Aesthetics & Intelligent Discovery.</p>
        <div className="flex items-center gap-1.5 text-mocha-400">
          <span>Tailored with</span>
          <Heart className="w-3 h-3 text-blush-400 fill-blush-400 inline" />
          <span>in Warm Pastel Pink & Mocha</span>
        </div>
      </div>
    </footer>
  );
}
