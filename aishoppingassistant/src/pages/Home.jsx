import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, TrendingUp, Clock, Compass, Layers } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';

export default function Home() {
  const { products, loading } = useProducts();

  // Flash Sale Countdown Timer using useState and useEffect
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.filter(p => p.badge === 'Trending' || p.badge === 'Bestseller' || p.rating >= 4.7).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* Zara & H&M Runway Editorial Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#F4ECE1] to-[#FAF0EE] pt-10 pb-20 border-b border-mocha-200/70">
        
        {/* Subtle Watermark Branding */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-light text-mocha-900/[0.03] select-none pointer-events-none tracking-[0.25em] uppercase">
          ATELIER
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content: High-Fashion Headline & Editorial Actions */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-mocha-300 text-mocha-800 text-[11px] font-mono uppercase tracking-[0.2em] shadow-2xs">
                <span>✦ AUTUMN / WINTER 2026 EDITION</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-light text-mocha-950 tracking-tight leading-[1.05]">
                ALL YOUR <br />
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blush-600 via-mocha-700 to-mocha-950">
                  STYLE HERE
                </span>
              </h1>

              <p className="text-mocha-700 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-sans">
                Experience high-fashion clarity. Describe your mood, wardrobe requirements, or skin needs, and let our conversational AI stylist curate your perfect selection without endless scrolling.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/assistant"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-mocha-900 hover:bg-blush-600 text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase shadow-lg shadow-mocha-900/15 hover:scale-[1.02] active:scale-98 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-blush-200" />
                  Consult AI Stylist
                </Link>

                <Link
                  to="/products"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-mocha-300 text-mocha-900 font-semibold text-xs tracking-wider uppercase hover:border-blush-400 hover:text-blush-700 shadow-2xs hover:scale-[1.02] transition-all"
                >
                  Explore Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-xs font-semibold text-mocha-600 tracking-wider uppercase font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  100% Curated Quality
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blush-600" />
                  Instant AI Advice
                </div>
              </div>
            </div>

            {/* Center Editorial Fashion Model Cutout Frame */}
            <div className="lg:col-span-4 relative flex justify-center">
              <div className="relative w-72 sm:w-84 h-[420px] sm:h-[490px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/90 bg-[#F4ECE1] group">
                <img
                  src="/images/hero_model.jpg"
                  alt="Aesthetic Editorial Model"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-1000 ease-out"
                />

                {/* Floating Campaign Badge (Zara/H&M editorial ribbon) */}
                <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-blush-200/80 flex flex-col items-center animate-float">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold">
                    Special Atelier Offer
                  </span>
                  <span className="font-serif text-2xl font-light text-mocha-950 leading-tight mt-0.5">
                    20% OFF
                  </span>
                  <span className="text-[9px] text-mocha-500 font-mono tracking-widest uppercase mt-0.5">
                    CODE: STYLE20
                  </span>
                </div>
              </div>
            </div>

            {/* Right Showcase & Flash Sale Box in Mocha & Blush */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Mini AI Match Live Box */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-mocha-200/70 shadow-lg space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-mocha-100">
                  <div className="w-8 h-8 rounded-xl bg-mocha-900 text-blush-200 flex items-center justify-center font-bold text-xs shadow-xs">
                    ✦
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-mocha-900">AI Match Live</h4>
                    <p className="text-[10px] text-mocha-500">Real-time wardrobe synergy</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-mocha-200/60 text-xs">
                    <p className="text-mocha-400 text-[9px] uppercase font-mono tracking-wider">Customer Brief</p>
                    <p className="text-mocha-800 font-serif italic text-sm mt-0.5">"Sunscreen under ₹500 with zero white cast"</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blush-50 border border-blush-200 text-xs flex items-center gap-3">
                    <img
                      src="/images/sunshield.jpg"
                      alt="Sunshield"
                      className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-mocha-950 truncate">SunShield SPF 50</p>
                      <p className="text-blush-700 font-mono text-[11px] font-bold">₹449 • Daily Shield</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/assistant"
                  className="block text-center text-xs font-bold uppercase tracking-wider text-blush-700 hover:text-mocha-950 py-1.5 transition-colors"
                >
                  Consult Stylist →
                </Link>
              </div>

              {/* Flash Deal Timer Box in Mocha Palette */}
              <div className="bg-mocha-900 text-[#FAF7F2] rounded-3xl p-5 shadow-xl border border-mocha-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono tracking-wider uppercase text-blush-300 text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Private Drop Ending
                  </span>
                  <span className="text-[10px] bg-blush-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest font-mono">
                    Save 40%
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono font-bold text-center pt-1">
                  <div className="bg-mocha-800/80 rounded-xl px-2.5 py-1.5 flex-1 mx-1 border border-mocha-700/60">
                    <span className="text-xl text-[#FAF7F2]">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="block text-[8px] text-mocha-300 uppercase tracking-widest mt-0.5">HRS</span>
                  </div>
                  <span className="text-blush-400 font-bold">:</span>
                  <div className="bg-mocha-800/80 rounded-xl px-2.5 py-1.5 flex-1 mx-1 border border-mocha-700/60">
                    <span className="text-xl text-[#FAF7F2]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="block text-[8px] text-mocha-300 uppercase tracking-widest mt-0.5">MIN</span>
                  </div>
                  <span className="text-blush-400 font-bold">:</span>
                  <div className="bg-mocha-800/80 rounded-xl px-2.5 py-1.5 flex-1 mx-1 border border-mocha-700/60">
                    <span className="text-xl text-blush-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="block text-[8px] text-mocha-300 uppercase tracking-widest mt-0.5">SEC</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Editorial Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-mocha-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block mb-1">
              Curated Capsules
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
              Explore Atelier Collections
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-mocha-700 hover:text-blush-600 flex items-center gap-1.5 transition-colors"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group p-6 bg-white rounded-3xl border border-mocha-200/80 hover:border-blush-300 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FAF0EE] group-hover:bg-blush-100 text-3xl flex items-center justify-center mb-4 transition-colors">
                {cat.icon}
              </div>
              <h3 className="font-serif text-lg font-normal text-mocha-950 group-hover:text-blush-700 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-mocha-400 mt-1">
                View Pieces →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Runway Picks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-mocha-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blush-100 text-blush-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block">
                Trending This Season
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
                Most Desired Pieces
              </h2>
            </div>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-mocha-700 hover:text-blush-600 flex items-center gap-1.5 transition-colors"
          >
            View Complete Lookbook <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Zara/H&M Style Minimalist Campaign Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2C1E14] text-[#FAF7F2] rounded-[2.5rem] p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-mocha-800">
          {/* Subtle Pink/Brown light halo */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-blush-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-blush-200 text-[10px] font-mono uppercase tracking-[0.25em] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blush-300" />
              INTELLIGENT FASHION ATELIER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight leading-tight">
              Tired of Endless Scrolling? Let AI Style Your Palette.
            </h2>
            <p className="text-mocha-200 text-sm sm:text-base leading-relaxed font-sans">
              From zero-white-cast skincare to tactile mechanical desks and minimalist streetwear, our algorithmic stylist curates only what harmonizes with your lifestyle.
            </p>
            <div className="pt-2">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FAF7F2] text-mocha-950 hover:bg-blush-100 font-semibold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all"
              >
                Launch AI Shopping Stylist
                <ArrowRight className="w-3.5 h-3.5 text-mocha-900" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pieces Catalog Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-mocha-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blush-700 font-bold block mb-1">
              Curator's Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-mocha-950 tracking-tight">
              Featured Selections
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-wider text-mocha-700 hover:text-blush-600 flex items-center gap-1.5 transition-colors"
          >
            All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
