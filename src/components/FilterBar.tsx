'use client';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface FilterBarProps {
  categories: Category[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  templateCount: number;
}

export default function FilterBar({ categories, activeFilter, onFilterChange, templateCount }: FilterBarProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <circle cx="12" cy="12" r="6" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" strokeWidth="2" />
          </svg>
        );
      case 'share':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3" strokeWidth="2" />
            <circle cx="6" cy="12" r="3" strokeWidth="2" />
            <circle cx="18" cy="19" r="3" strokeWidth="2" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth="2" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth="2" />
          </svg>
        );
      case 'play':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        );
      case 'mail':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" />
            <polyline points="22,6 12,13 2,6" strokeWidth="2" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
            <polyline points="14 2 14 8 20 8" strokeWidth="2" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div className="mb-8">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* All filter */}
        <button
          onClick={() => onFilterChange('All')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium transition-all duration-200 ${
            activeFilter === 'All'
              ? 'bg-brand-navy text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue hover:text-brand-blue'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
          </svg>
          All Templates
        </button>

        {/* Category filters */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium transition-all duration-200 ${
              activeFilter === category.id
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue hover:text-brand-blue'
            }`}
          >
            {getIcon(category.icon)}
            {category.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-gray-500">
          Showing <span className="font-semibold text-brand-navy">{templateCount}</span> template{templateCount !== 1 ? 's' : ''}
          {activeFilter !== 'All' && (
            <span> in <span className="text-brand-blue">{activeFilter}</span></span>
          )}
        </p>
      </div>
    </div>
  );
}
