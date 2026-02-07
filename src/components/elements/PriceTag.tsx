interface PriceTagProps {
  price: string;
  prefix?: string;
  className?: string;
  variant?: "lime" | "white" | "blue";
}

export function PriceTag({ price, prefix = "Enroll for", variant = "lime", className }: PriceTagProps) {
  const variants = {
    lime: "bg-[#D6EF3F] text-[#181830]",
    white: "bg-white text-[#181830]",
    blue: "bg-[#3B82F6] text-white",
  };

  return (
    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold ${variants[variant]} ${className}`}>
      <span className="text-lg">{prefix}</span>
      <span className="text-2xl font-extrabold">{price}</span>
    </div>
  );
}
