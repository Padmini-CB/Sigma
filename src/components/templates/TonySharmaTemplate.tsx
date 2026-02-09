import { getCharacterImage } from "@/data/characters";
import { PriceTag } from "@/components/elements/PriceTag";

interface TonySharmaTemplateProps {
  headline?: string;
  subheadline?: string;
  hook?: string;
  cta?: string;
  price?: string;
  bootcamp?: string;
}

export function TonySharmaTemplate({
  headline = "Certificates don't write code.",
  subheadline = "You do.",
  hook = "Tony bought a certificate. You're building a career.",
  cta = "Learn the Fundamentals",
  price = "₹12,900",
  bootcamp = "Data Analytics Bootcamp 5.0",
}: TonySharmaTemplateProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#181830] to-[#2D1B4E] overflow-hidden">
      {/* Sigma Tagline Badge - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/20">
          <span className="text-[#D6EF3F]">&#10024;</span>
          <span className="text-sm font-medium text-white">Intent-First Design</span>
        </div>
      </div>

      {/* Bootcamp Name - Top Right below badge */}
      <div className="absolute top-16 right-4 text-white/80 text-sm font-medium uppercase tracking-wider">
        {bootcamp}
      </div>

      {/* Character - Left Side */}
      <div className="absolute bottom-0 left-0 w-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getCharacterImage("tony", "presenting")}
          alt="Tony Sharma - Presenting"
          className="w-full h-auto opacity-90 object-contain"
        />
      </div>

      {/* Content - Right Side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 max-w-[50%] text-right">
        {/* Headline */}
        <h1 className="text-4xl font-bold text-white leading-tight font-['Saira_Condensed']">
          {headline}
        </h1>
        <h2 className="text-4xl font-bold text-[#D6EF3F] leading-tight font-['Saira_Condensed'] mt-1">
          {subheadline}
        </h2>

        {/* Hook */}
        <p className="text-lg text-white/80 mt-6 font-['Kanit']">
          {hook}
        </p>
      </div>

      {/* CTA and Price - Bottom */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4">
        <button className="px-6 py-3 bg-white text-[#181830] font-bold rounded-lg hover:bg-gray-100 transition">
          {cta}
        </button>
        <PriceTag price={price} prefix="Enroll for" variant="lime" />
      </div>
    </div>
  );
}
