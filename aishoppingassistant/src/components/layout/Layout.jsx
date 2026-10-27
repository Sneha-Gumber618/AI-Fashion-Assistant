import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Ticker from './Ticker';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastContainer from '../common/ToastContainer';
import FloatingAiWidget from '../chat/FloatingAiWidget';
import EditorialSplash from '../common/EditorialSplash';
import PushBanner from '../common/PushBanner';

export default function Layout() {
  const [showSplash, setShowSplash] = useState(() => {
    // Brand intro is displayed ONLY once when opening the website for the first time
    try {
      return !localStorage.getItem('shopai_brand_intro_seen');
    } catch {
      return false;
    }
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    try {
      localStorage.setItem('shopai_brand_intro_seen', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-mocha-950 antialiased font-sans selection:bg-blush-300 selection:text-mocha-950">
      {/* Brand Opening Splash (Rendered only on the very first visit) */}
      {showSplash && <EditorialSplash onComplete={handleSplashComplete} />}

      {/* Smartphone Push Notification Banner */}
      <PushBanner />

      {/* Top Banner Ticker with pink & brown pastel palette */}
      <Ticker />

      {/* Sticky Main Navigation */}
      <Navbar />

      {/* Main Content Area via React Router Outlet */}
      <main className="flex-1 animate-fade-in">
        <Outlet />
      </main>

      {/* Global Interactive Elements */}
      <ToastContainer />
      <FloatingAiWidget />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
