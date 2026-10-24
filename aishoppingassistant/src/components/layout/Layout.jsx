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
    // Show splash on new session
    return !sessionStorage.getItem('shopai_splash_seen');
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('shopai_splash_seen', 'true');
  };

  const handleReplayIntro = () => {
    setShowSplash(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-mocha-950 antialiased font-sans selection:bg-blush-300 selection:text-mocha-950">
      {/* Zara / H&M Style Editorial Opening Splash */}
      {showSplash && <EditorialSplash onComplete={handleSplashComplete} />}

      {/* Zomato / Swiggy / iOS Smartphone Push Notification Banner */}
      <PushBanner />

      {/* Top Banner Ticker with pink & brown pastel palette */}
      <Ticker onReplayIntro={handleReplayIntro} />

      {/* Sticky Main Navigation */}
      <Navbar onReplayIntro={handleReplayIntro} />

      {/* Main Content Area via React Router Outlet */}
      <main className="flex-1 animate-fade-in">
        <Outlet />
      </main>

      {/* Global Interactive Elements */}
      <ToastContainer />
      <FloatingAiWidget />

      {/* Site Footer */}
      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
}
