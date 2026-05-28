import { ArrowRight, BookOpen, Car, Landmark, Phone } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import { LOCATIONS } from '../types';

interface PathwayTilesProps {
  onNavigate: (view: string) => void;
}

const TILES = [
  {
    id: 'inventory',
    eyebrow: 'Current stock',
    title: 'View Live Inventory',
    description: 'Browse smog-certified commuters, family SUVs, and budget-friendly options at both lots.',
    icon: Car,
    surface: 'bg-sun-light border-sun/50 hover:border-sun',
    iconBg: 'bg-sun text-white',
    action: 'external' as const,
    href: LOCATIONS['simi-valley'].inventoryUrl,
    cta: 'View Now',
  },
  {
    id: 'financing',
    eyebrow: 'Credit programs',
    title: 'Financing Options',
    description: 'Second-chance approvals, co-signers welcome. Tim explains the terms in plain English.',
    icon: Landmark,
    surface: 'bg-green-50 border-success/40 hover:border-success',
    iconBg: 'bg-success text-white',
    action: 'navigate' as const,
    view: 'financing',
    cta: 'Read More',
  },
  {
    id: 'guides',
    eyebrow: 'Protect your budget',
    title: 'Buyer Guides & Contracts',
    description: 'California smog rules, credit rebuild checklists, and real contract pages explained before you visit.',
    icon: BookOpen,
    surface: 'bg-sky-light border-sky/40 hover:border-sky',
    iconBg: 'bg-sky text-white',
    action: 'navigate' as const,
    view: 'resources',
    cta: 'Read More',
  },
  {
    id: 'contact',
    eyebrow: 'Talk to Tim',
    title: 'Get Pre-Approved Today',
    description: 'Same-day conversations with Tim. No pressure, no hidden prep fees.',
    icon: Phone,
    surface: 'bg-amber-50 border-lemon/60 hover:border-lemon',
    iconBg: 'bg-lemon text-navy',
    action: 'scroll' as const,
    cta: 'Contact Now',
  },
];

export default function PathwayTiles({ onNavigate }: PathwayTilesProps) {
  const handleClick = (tile: (typeof TILES)[number]) => {
    if (tile.action === 'navigate' && tile.view) {
      onNavigate(tile.view);
      return;
    }
    if (tile.action === 'scroll') {
      onNavigate('home');
      window.setTimeout(() => {
        document.getElementById('contact-lead-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return;
    }
    if (tile.action === 'external' && tile.href) {
      window.open(tile.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="pathway-tiles" className="section-sky py-14 sm:py-16 -mx-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <span className="eyebrow text-sky-deep">Start Here</span>
          <h2 className="heading-display text-3xl sm:text-4xl text-navy text-balance">
            Everything you need, right here
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TILES.map((tile, index) => {
            const Icon = tile.icon;
            const Tag = tile.action === 'external' ? 'a' : 'button';

            const sharedProps =
              tile.action === 'external'
                ? {
                    href: tile.href,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }
                : {
                    type: 'button' as const,
                    onClick: () => handleClick(tile),
                  };

            return (
              <div key={tile.id}>
              <RevealOnScroll delay={index * 0.07}>
                <Tag
                  {...sharedProps}
                  className={`pathway-tile group w-full text-left p-6 sm:p-7 rounded-2xl border-2 ${tile.surface} cursor-pointer min-h-[11rem] flex flex-col justify-between bg-white/80`}
                >
                  <div className="space-y-4">
                    <div className={`pathway-icon w-12 h-12 rounded-xl ${tile.iconBg} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" strokeWidth={2.25} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="eyebrow text-navy-muted">{tile.eyebrow}</p>
                      <h3 className="font-display font-bold text-xl text-navy leading-snug group-hover:text-sun transition-colors duration-300">
                        {tile.title}
                      </h3>
                      <p className="text-sm text-navy-muted leading-relaxed line-clamp-3">{tile.description}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sun mt-5 group-hover:gap-2.5 transition-all duration-300">
                    {tile.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Tag>
              </RevealOnScroll>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
