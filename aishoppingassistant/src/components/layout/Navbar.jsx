import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import NotificationBell from '../common/NotificationBell';
import {
  ShoppingBag,
  Heart,
  User,
  Sparkles,
  Menu,
  X,
  PackageCheck,
  LogOut,
  ChevronDown,
  Shield,
  Layers,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const { cartCount, grandTotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, isAuthenticated, isGuest, isAdmin, logout, adminLogout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 py-1.5 px-3 rounded-full ${
      isActive
        ? 'text-mocha-950 bg-blush-200/70 font-bold border border-blush-300/80 shadow-2xs'
        : 'text-mocha-700 hover:text-mocha-950 hover:bg-mocha-100/80'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBDDCD]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo - Zara & H&M Runway Editorial Serif */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mocha-900 via-mocha-800 to-blush-600 flex items-center justify-center text-[#FAF7F2] shadow-sm group-hover:scale-105 transition-transform duration-500">
              <Sparkles className="w-4 h-4 text-blush-200 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.2em] uppercase text-mocha-950 block leading-none">
                SHOP<span className="text-blush-600 font-semibold italic">AI</span>
              </span>
              <span className="block text-[9px] uppercase font-mono tracking-[0.3em] text-mocha-500 mt-1">
                STUDIO & ATELIER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Collection
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Explore
            </NavLink>
            <NavLink to="/assistant" className={navLinkClass}>
              <span className="flex items-center gap-1.5 text-blush-700 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blush-500" /> AI Stylist
              </span>
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          </nav>

          {/* Right Action Icons (Single Admin Button, Notifications, Wishlist, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Single Admin Portal Button */}
            <Link
              to="/admin"
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold transition-all border ${
                isAdmin
                  ? 'bg-mocha-900 text-[#FAF7F2] border-mocha-800 shadow-2xs hover:bg-mocha-800'
                  : 'bg-white/80 hover:bg-blush-100 text-mocha-850 border-mocha-200 shadow-2xs'
              }`}
              title="Access Admin Management Portal"
            >
              <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-blush-300' : 'text-mocha-600'}`} />
              <span>Admin Portal</span>
            </Link>

            {/* Notification Center Bell */}
            <NotificationBell />

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-mocha-800 hover:text-blush-600 hover:bg-blush-100/60 transition-colors"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blush-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with Price Preview in Mocha & Cream */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-mocha-900 text-[#FAF7F2] hover:bg-mocha-800 transition-all duration-300 shadow-sm hover:shadow-mocha-900/20 group"
              title="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-blush-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wider font-mono">
                {cartCount > 0 ? formatPrice(grandTotal) : 'Bag'}
              </span>
            </Link>

            {/* User Profile / Auth Dropdown or Guest Pill */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated && currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-mocha-100 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-mocha-800 to-blush-500 text-[#FAF7F2] font-serif font-bold text-sm flex items-center justify-center shadow-2xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-mocha-600 hidden sm:block" />
                </button>
              ) : isGuest ? (
                <div className="flex items-center gap-1.5">
                  <span className="hidden md:inline text-[9px] font-mono uppercase tracking-wider text-mocha-600 bg-mocha-100/90 px-2.5 py-1 rounded-full font-bold">
                    Guest Mode
                  </span>
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-mocha-900 hover:text-blush-600 px-3 py-1.5 rounded-full border border-mocha-300 hover:border-blush-400 bg-white/70 transition-colors shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-mocha-900 hover:text-blush-600 px-3 py-2 rounded-full border border-mocha-300 hover:border-blush-400 bg-white/50 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Dropdown Menu for Authenticated Users */}
              {userDropdownOpen && isAuthenticated && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FAF7F2] rounded-2xl shadow-xl border border-mocha-200/90 py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-mocha-200/60">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-mocha-400">Atelier Member</p>
                    <p className="text-sm font-bold text-mocha-950 truncate font-serif">{currentUser.name}</p>
                    <p className="text-xs text-mocha-600 truncate">{currentUser.email}</p>
                  </div>

                  <Link
                    to="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-mocha-950 hover:bg-blush-50 hover:text-blush-700 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-mocha-500" />
                    Admin Portal
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-mocha-800 hover:bg-blush-50 hover:text-blush-700 transition-colors"
                  >
                    <PackageCheck className="w-4 h-4 text-mocha-400" />
                    My Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-mocha-800 hover:bg-blush-50 hover:text-blush-700 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-mocha-400" />
                    Wishlist ({wishlistCount})
                  </Link>

                  <div className="border-t border-mocha-200/60 my-1"></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-blush-700 hover:bg-blush-100/60 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-mocha-900 hover:bg-mocha-100 lg:hidden transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-mocha-200 bg-[#FAF7F2]/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-mocha-900 text-[#FAF7F2]"
          >
            <Shield className="w-4 h-4 text-blush-300" />
            <span>Admin Portal</span>
          </Link>
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-medium text-mocha-800 hover:bg-mocha-100 text-xs uppercase tracking-wider"
          >
            Collection
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-medium text-mocha-800 hover:bg-mocha-100 text-xs uppercase tracking-wider"
          >
            Explore Catalog
          </NavLink>
          <NavLink
            to="/assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-medium text-blush-700 bg-blush-100/70 font-bold text-xs uppercase tracking-wider"
          >
            ✨ AI Shopping Stylist
          </NavLink>
          <NavLink
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-medium text-mocha-800 hover:bg-mocha-100 text-xs uppercase tracking-wider"
          >
            Order Tracking
          </NavLink>
          <NavLink
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-medium text-mocha-800 hover:bg-mocha-100 text-xs uppercase tracking-wider"
          >
            Wishlist ({wishlistCount})
          </NavLink>
          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-blush-800 bg-white border border-mocha-200 text-xs uppercase tracking-wider text-center"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
