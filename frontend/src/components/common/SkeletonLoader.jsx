import React from 'react';

export const SkeletonBox = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-surface-50/70 rounded-md ${className}`} />
  );
};

export const SkeletonRow = () => {
  return (
    <div className="flex items-center gap-4 py-3.5 px-4 border-b border-surface-border">
      <SkeletonBox className="w-16 h-5" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="w-3/5 h-4" />
        <SkeletonBox className="w-2/5 h-3" />
      </div>
      <SkeletonBox className="w-20 h-6 rounded-full" />
      <SkeletonBox className="w-16 h-6 rounded-full" />
      <SkeletonBox className="w-28 h-4" />
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-surface-card border border-surface-border rounded-xl overflow-hidden divide-y divide-surface-border">
      <div className="p-4 bg-surface-100 flex items-center justify-between">
        <SkeletonBox className="w-36 h-4" />
        <SkeletonBox className="w-24 h-4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-surface-card border border-surface-border rounded-xl p-6 space-y-4">
          <SkeletonBox className="w-24 h-6 rounded-full" />
          <SkeletonBox className="w-3/4 h-8" />
          <SkeletonBox className="w-full h-24" />
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-6 space-y-4">
          <SkeletonBox className="w-32 h-5" />
          <SkeletonBox className="w-full h-20" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-surface-card border border-surface-border rounded-xl p-6 space-y-4">
          <SkeletonBox className="w-28 h-5" />
          <SkeletonBox className="w-full h-10" />
          <SkeletonBox className="w-full h-10" />
          <SkeletonBox className="w-full h-10" />
        </div>
      </div>
    </div>
  );
};
