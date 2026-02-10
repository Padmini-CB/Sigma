interface YouTubeBadgeProps {
  subscribers?: string;
  className?: string;
}

export function YouTubeBadge({ subscribers = "1 Million+ Subscribers", className }: YouTubeBadgeProps) {
  return (
    <div className={`flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md ${className}`}>
      <div className="w-3 h-3 bg-green-500 rounded-full" />
      <span className="text-sm font-medium text-gray-800">{subscribers}</span>
    </div>
  );
}
