import { LucideIcon } from 'lucide-react';
import HeroDecor from './HeroDecor';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function PageHero({ eyebrow, title, description, icon: Icon }: PageHeroProps) {
  return (
    <section className="hero-sunny text-white py-14 sm:py-16 px-4 relative overflow-hidden border-b-4 border-sun">
      <HeroDecor />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 relative z-10 reveal-entry">
        <div className="flex items-center gap-2">
          {Icon && (
            <span className="w-9 h-9 rounded-xl bg-white/15 border-2 border-white/25 flex items-center justify-center hover-wiggle">
              <Icon className="w-4 h-4 text-lemon" />
            </span>
          )}
          <span className="eyebrow text-lemon">{eyebrow}</span>
        </div>
        <h1 className="heading-display text-4xl sm:text-[2.75rem] text-white max-w-3xl text-balance">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-sky-light max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
