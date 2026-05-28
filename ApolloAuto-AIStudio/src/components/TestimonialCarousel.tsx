import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star, User, Play, Pause } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  carModel: string;
  rating: number;
  date: string;
  quote: string;
  avatarUrl?: string; // Optional avatar placeholder
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Carlos Mendoza',
    location: 'El Monte Lot Visitor',
    carModel: '2019 Toyota Corolla SE',
    rating: 5,
    date: '2026-04-18',
    quote: 'Tim made everything simple. No complex dealership games, no hidden prep fees. We got a reliable commuter for our daughter and rebuild our family credit score step-by-step.',
    initials: 'CM'
  },
  {
    id: 'test-2',
    name: 'Evelyn Ramirez',
    location: 'Simi Valley Lot Customer',
    carModel: '2018 Honda Civic LX',
    rating: 5,
    date: '2026-05-02',
    quote: 'After our bankruptcy, we were turned away at three big high-pressure lots. Tim sat down with us, verified our paycheck paystubs directly, and got our bank approval in 20 minutes.',
    initials: 'ER'
  },
  {
    id: 'test-3',
    name: 'David K.',
    location: 'Simi Valley Lot Customer',
    carModel: '2020 Nissan Rogue Sport',
    rating: 5,
    date: '2026-05-14',
    quote: 'Bought a clean daily commuter Rogue here. Smog check was already completed, plates came in our mail 2 weeks later. Extremely honest and professional Ventura County group.',
    initials: 'DK'
  },
  {
    id: 'test-4',
    name: 'Maria S. & Family',
    location: 'El Monte Lot Customer',
    carModel: '2017 Honda Accord Hybrid',
    rating: 5,
    date: '2026-03-29',
    quote: 'Bilingual staff is incredible. Tim translated every contract page clearly into Spanish for my mother. We knew exactly what our APR, down payments, and signatures meant.',
    initials: 'MS'
  }
];

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Autoplay cycle
  useEffect(() => {
    if (isAutoplay && !prefersReduced) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeIndex, isAutoplay, prefersReduced]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[activeIndex];

  // Schema Markup generation: Aggregate rating & separate reviews
  const jsonLdMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Apollo Auto',
    'image': 'https://apolloauto-to.com/logo.png',
    'telephone': '805-404-3873',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '1555 Simi Town Center Way, Suite 420',
      'addressLocality': 'Simi Valley',
      'addressRegion': 'CA',
      'postalCode': '93065',
      'addressCountry': 'US'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '524',
      'bestRating': '5',
      'worstRating': '1'
    },
    'review': TESTIMONIALS.map(t => ({
      '@type': 'Review',
      'author': {
        '@type': 'Person',
        'name': t.name
      },
      'datePublished': t.date,
      'reviewBody': t.quote,
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': t.rating.toString(),
        'bestRating': '5'
      }
    }))
  };

  return (
    <section id="trust-testimonials" className="py-12 bg-white rounded-3xl border border-gray-150 shadow-sm relative overflow-hidden">
      {/* Dynamic SEO Injector inside element */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMarkup) }}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-success/10 text-success rounded-full text-sm font-bold uppercase tracking-wider">
            <Star className="w-3 h-3 fill-current" />
            <span>5-Star SoCal Reputation</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-navy tracking-tight">
            Loved By Southern California Families
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
            Read true stories from Ventura County and San Gabriel Valley families who bought here on terms they could live with.
          </p>
        </div>

        {/* Carousel Slide Container */}
        <div 
          className="relative min-h-[220px] md:min-h-[180px] bg-paper/35 p-6 sm:p-8 rounded-2xl border border-gray-100 transition-all duration-300"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          {/* Quote bubble visual helper */}
          <div className="absolute top-4 right-6 text-gold/15 pointer-events-none">
            <Quote className="w-16 h-16 transform rotate-180" />
          </div>

          <div className="space-y-4">
            {/* Stars rating */}
            <div className="flex space-x-1 text-gold">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            {/* Quote content */}
            <blockquote className="text-base sm:text-lg text-navy font-medium italic leading-relaxed">
              “{current.quote}”
            </blockquote>

            {/* Author details */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                {/* Optional Customer Photo or Initials indicator */}
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-sm font-extrabold text-gold tracking-tight shrink-0">
                  {current.initials}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-navy uppercase tracking-wide">{current.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center space-x-1.5 mt-0.5">
                    <span className="font-semibold text-[#164456]">{current.location}</span>
                    <span>•</span>
                    <span className="text-navy-muted">{current.carModel}</span>
                  </p>
                </div>
              </div>

              {/* Date tag */}
              <div className="hidden sm:block text-sm text-navy-muted font-mono">
                Verified: {new Date(current.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controller */}
        <div className="flex items-center justify-between pt-2">
          {/* Autoplay Pause / Play button */}
          {!prefersReduced ? (
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="p-1.5 bg-paper hover:bg-gray-100 text-navy-soft rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              title={isAutoplay ? "Pause Slides" : "Play Slides"}
            >
              {isAutoplay ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="text-sm uppercase tracking-wider pr-1">Pause Autoplay</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="text-sm uppercase tracking-wider pr-1">Autoplay</span>
                </>
              )}
            </button>
          ) : (
            <div />
          )}

          {/* Dots Indicator list */}
          <div className="flex space-x-1.5">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsAutoplay(false); // Stop autoplay on manual choice
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? 'w-6 bg-gold' : 'w-2 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Show testimonial slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Step Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                handlePrev();
                setIsAutoplay(false);
              }}
              className="p-2 bg-paper hover:bg-gray-100 border border-gray-100 text-navy rounded-xl transition-all cursor-pointer"
              aria-label="Previous review"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                handleNext();
                setIsAutoplay(false);
              }}
              className="p-2 bg-paper hover:bg-gray-100 border border-gray-100 text-navy rounded-xl transition-all cursor-pointer"
              aria-label="Next review"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
