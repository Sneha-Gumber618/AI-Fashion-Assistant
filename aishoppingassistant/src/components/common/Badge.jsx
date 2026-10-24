import React from 'react';

export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-blush-100/90 text-blush-800 border-blush-200/90 shadow-2xs',
    secondary: 'bg-mocha-100/90 text-mocha-800 border-mocha-200 shadow-2xs',
    accent: 'bg-[#F5DDD9] text-[#7F3E49] border-[#ECC0BB] shadow-2xs',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs',
    dark: 'bg-mocha-900 text-[#FAF7F2] border-mocha-800 shadow-2xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase border ${
        variants[variant] || variants.primary
      } ${className}`}
    >
      {children}
    </span>
  );
}
