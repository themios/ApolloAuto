import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star, Play, Pause } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  carModel: string;
  rating: number;
  date: string;
  quote: string;
  initials: string;
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(setTestimonials).catch(() => {});
  }, []);

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
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[activeIndex];

  // Schema Markup generation: Aggregate rating & separate reviews
  if (testimonials.length === 0) return null;

  return (
    <section id="trust-testimonials" className="py-12 bg-white rounded-3xl border border-gray-150 shadow-sm relative overflow-hidden">

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
            {testimonials.map((_, idx) => (
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
