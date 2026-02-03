'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function TemplateCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Thumbnail Preview */}
      <div className="h-44 bg-gray-100 flex items-center justify-center p-4 relative">
        <Skeleton className="w-32 h-24 rounded-lg" />
        <Skeleton className="absolute top-3 right-3 w-12 h-6 rounded-md" />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function TemplateGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TemplateCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-5 w-48" />
    </div>
  );
}

export function EditorSidebarSkeleton() {
  return (
    <aside className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Design Selector */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
            {i % 2 === 0 && <Skeleton className="h-3 w-36" />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Skeleton className="h-3 w-24 mb-2" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-12 h-5 rounded" />
          ))}
        </div>
      </div>
    </aside>
  );
}

export function PreviewSkeleton() {
  return (
    <main className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-7 w-24 rounded" />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Skeleton className="w-96 h-64 rounded-lg shadow-lg" />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>
    </main>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-brand-gray/30 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mx-auto mb-4" />
        <p className="font-ui text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
