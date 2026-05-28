import { Heart, ShieldCheck, Award, Users } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const PILLARS = [
  {
    icon: Heart,
    title: 'Built for Families',
    description: 'Safe commuters, teen-ready models, and SUVs that fit real Southern California life. Not fancy show cars. Just what your family actually needs.',
    accent: 'text-sun',
    iconBg: 'bg-sun-light border-sun/40',
    bar: 'bg-sun',
  },
  {
    icon: ShieldCheck,
    title: 'Reliability First',
    description: 'Smog-certified inventory, honest condition disclosures, and hand-picked Japanese models known for lasting value.',
    accent: 'text-success',
    iconBg: 'bg-green-50 border-success/40',
    bar: 'bg-success',
  },
  {
    icon: Award,
    title: 'Quality You Can Verify',
    description: 'Every price walked through with you. No hidden prep fees, no bait-and-switch. Tim explains the paperwork before you sign.',
    accent: 'text-sky-deep',
    iconBg: 'bg-sky-light border-sky/40',
    bar: 'bg-sky',
  },
  {
    icon: Users,
    title: 'Trust Earned Daily',
    description: 'Family-owned and run by Tim. You talk to the same person at Simi Valley and El Monte, not a new salesperson every visit.',
    accent: 'text-coral',
    iconBg: 'bg-rose-50 border-coral/40',
    bar: 'bg-coral',
  },
];

export default function TrustPillars() {
  return (
    <section id="trust-pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span className="eyebrow text-sun">Our Promise</span>
        <h2 className="heading-display text-3xl sm:text-4xl text-navy text-balance">
          A dealership your family can count on
        </h2>
        <p className="text-base sm:text-lg text-navy-muted leading-relaxed">
          Apollo Auto is built around one thing: keeping your household on the road safely, without the stress of a high-pressure lot.
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PILLARS.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title}>
            <RevealOnScroll delay={index * 0.08}>
              <article className="pillar-card card-elevated rounded-2xl overflow-hidden h-full">
                <div className={`h-1.5 ${pillar.bar}`} />
                <div className="p-6 space-y-4">
                  <div className={`pillar-icon w-12 h-12 rounded-2xl ${pillar.iconBg} border-2 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${pillar.accent}`} strokeWidth={2.25} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-navy leading-snug">{pillar.title}</h3>
                    <p className="text-sm sm:text-base text-navy-muted leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
            </div>
          );
        })}
      </div>
    </section>
  );
}
