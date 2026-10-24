import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse flex flex-col h-full">
      <div className="w-full h-52 bg-slate-200 rounded-xl mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
      </div>
    </div>
  );
}
