interface USPPillsProps {
  items: string[];
  separator?: string;
  className?: string;
}

export function USPPills({ items, separator = "|", className }: USPPillsProps) {
  return (
    <div className={`flex items-center justify-center gap-3 text-white text-sm font-medium ${className}`}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-3">
          {item}
          {index < items.length - 1 && <span className="opacity-50">{separator}</span>}
        </span>
      ))}
    </div>
  );
}
