import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function EditorialSplash({ onComplete }) {
  const [phase, setPhase] = useState('intro'); // 'intro' -> 'exit' -> 'done'

  useEffect(() => {
    // Phase 1: Reveal logo & subtitle for 2.2 seconds
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 2200);

    // Phase 2: Complete curtain fade out at 2.9 seconds
    const doneTimer = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 2900);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase('exit');
    setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 400);
  };

  if (phase === 'done') return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 sm:p-14 select-none cursor-pointer transition-all duration-700 ${
        phase === 'exit'
          ? 'opacity-0 -translate-y-8 pointer-events-none'
          : 'opacity-100 translate-y-0'
      } bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE1] to-[#FAF0EE] text-mocha-900`}
    >
      {/* Top Editorial Bar */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-[0.25em] uppercase text-mocha-600/80 animate-fade-in">
        <span>COLLECTION 2026</span>
        <span className="hidden sm:inline">AI-CURATED CAPSULE ATELIER</span>
        <span>AUTUMN / WINTER</span>
      </div>

      {/* Center Cinematic Fashion Brand Reveal (Zara & H&M style) */}
      <div className="text-center space-y-6 max-w-xl mx-auto my-auto">
        {/* Subtle Luxury Sparkle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blush-200/60 border border-blush-300 text-mocha-800 text-[10px] uppercase font-bold tracking-[0.25em] animate-pulse">
          <Sparkles className="w-3 h-3 text-blush-500" />
          <span>ShopAI Studio</span>
        </div>

        {/* Grand Typography Logo with letter tracking animation */}
        <div className="overflow-hidden">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light tracking-[0.35em] sm:tracking-[0.5em] uppercase text-mocha-950 animate-letter-track">
            SHOPAI
          </h1>
        </div>

        {/* Minimalist Divider Line */}
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-mocha-400 to-transparent mx-auto"></div>

        {/* Refined Subtitle */}
        <p className="font-serif italic text-base sm:text-xl text-mocha-700/90 tracking-wide font-normal animate-fade-in [animation-delay:0.4s]">
          Where intelligent discovery meets timeless aesthetic luxury.
        </p>

        {/* Progress bar line */}
        <div className="w-32 h-[2px] bg-mocha-200/80 rounded-full mx-auto overflow-hidden mt-6">
          <div className="h-full bg-mocha-800 rounded-full animate-marquee [animation-duration:2.2s]"></div>
        </div>
      </div>

      {/* Bottom Action / Skip Button */}
      <div className="w-full flex items-center justify-between text-xs text-mocha-500 animate-fade-in [animation-delay:0.6s]">
        <span className="text-[10px] tracking-widest uppercase font-mono hidden sm:inline">
          TAP ANYWHERE TO ENTER
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-mocha-900 text-[#FAF7F2] hover:bg-blush-600 transition-all text-xs font-semibold tracking-wider uppercase ml-auto"
        >
          <span>Enter Atelier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
