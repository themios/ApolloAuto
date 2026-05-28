import { ArrowRight, Fuel, Shield, ShieldCheck, Users } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const NEEDS = [
  {
    title: 'Family SUV',
    subtitle: 'Room for car seats & groceries',
    brands: 'Rogue · CR-V · RAV4',
    icon: Users,
    tint: 'bg-sun-light border-sun/35',
    iconBg: 'bg-sun text-white',
  },
  {
    title: 'Teen First Car',
    subtitle: 'Safety-first sedans & hatches',
    brands: 'Civic · Corolla · Elantra',
    icon: ShieldCheck,
    tint: 'bg-sky-light border-sky/35',
    iconBg: 'bg-sky text-white',
  },
  {
    title: 'Daily Commuter',
    subtitle: 'Low maintenance freeway miles',
    brands: 'Camry · Accord · Mazda3',
    icon: Fuel,
    tint: 'bg-green-50 border-success/35',
    iconBg: 'bg-success text-white',
  },
  {
    title: 'Rebuilding Credit',
    subtitle: 'Stable income approvals',
    brands: 'All credit tiers welcome',
    icon: Shield,
    tint: 'bg-amber-50 border-lemon/50',
    iconBg: 'bg-lemon text-navy',
  },
];

interface ShopByNeedCarouselProps {
  onGetMatched: () => void;
}

export default function ShopByNeedCarousel({ onGetMatched }: ShopByNeedCarouselProps) {
  return (
    <section id="shop-by-need" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <span className="eyebrow text-sun">Shop by your needs</span>
          <h2 className="heading-display text-3xl text-navy">Find the right fit for your household</h2>
          <p className="text-sm sm:text-base text-navy-muted max-w-xl leading-relaxed">
            We pick reliable models families actually depend on. We do not try to stock everything on the market.
          </p>
        </div>
        <button
          type="button"
          onClick={onGetMatched}
          className="btn-sun inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold touch-target shrink-0"
        >
          Get matched with Tim
          <ArrowRight className="w-4 h-4" />
        </button>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1}>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {NEEDS.map((need) => {
            const Icon = need.icon;
            return (
              <article
                key={need.title}
                className={`snap-start shrink-0 w-[min(85vw,280px)] sm:w-[300px] p-6 rounded-2xl border-2 ${need.tint} card-elevated pathway-tile`}
              >
                <div className={`pathway-icon w-11 h-11 rounded-xl ${need.iconBg} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="w-5 h-5" strokeWidth={2.25} />
                </div>
                <h3 className="font-display font-bold text-xl text-navy">{need.title}</h3>
                <p className="text-sm text-navy-muted mt-1">{need.subtitle}</p>
                <p className="text-sm font-bold text-sun mt-4">{need.brands}</p>
              </article>
            );
          })}
        </div>
      </RevealOnScroll>
    </section>
  );
}
