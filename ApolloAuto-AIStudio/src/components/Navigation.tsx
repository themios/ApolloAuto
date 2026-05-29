import { useState, useEffect } from 'react';
import { Car, Phone, MapPin, Landmark, BookOpen, HelpCircle, Menu, X, FileText, ShieldCheck } from 'lucide-react';
import { LOCATIONS } from '../types';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topNavItems = [
    { id: 'home', label: 'Home', icon: Car },
    { id: 'resources', label: 'Buyer Guides', icon: BookOpen },
    { id: 'faq', label: 'Help & FAQ', icon: HelpCircle },
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Car },
    { id: 'simi-valley', label: 'Simi Valley Lot', icon: MapPin },
    { id: 'el-monte', label: 'El Monte Lot', icon: MapPin },
    { id: 'financing', label: 'Financing', icon: Landmark },
    { id: 'resources', label: 'Buyer Guides', icon: BookOpen },
    { id: 'faq', label: 'Help & FAQ', icon: HelpCircle },
  ];

  return (
    <header
      id="main-nav"
      className={`sticky top-0 z-50 transition-all duration-400 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,39,68,0.12)] border-b-2 border-sky-light py-2'
          : 'bg-white border-b-2 border-sky-light/80 py-3'
      }`}
    >
      {/* Trust ribbon */}
      <div className="hidden sm:block bg-sky-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-lemon" />
            Family-Owned · DMV Bonded
          </span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="hidden md:inline">Smog-Certified Inventory</span>
          <span className="hidden lg:inline text-white/40">|</span>
          <span className="hidden lg:inline text-lemon">Two SoCal Locations ☀️</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            id="brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="relative w-11 h-11 shrink-0">
              <div className="absolute inset-0 rounded-full bg-sun/25 scale-100 group-hover:scale-110 transition-transform duration-300" />
              <div className="relative w-full h-full bg-sun rounded-full flex items-center justify-center border-2 border-white shadow-lg group-hover:rotate-6 transition-transform duration-300">
                <span className="font-display font-extrabold text-xl text-white italic leading-none">A</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-navy text-lg tracking-tight">Apollo</span>
                <span className="font-sans font-bold text-sun text-sm tracking-wide">Auto</span>
              </div>
              <p className="text-xs sm:text-sm text-navy-muted font-semibold">Trusted by SoCal families</p>
            </div>
          </button>

          <nav id="desktop-menu" className="hidden lg:flex items-center gap-0.5">
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-sky-deep shadow-md'
                      : 'text-navy-muted hover:text-sky-deep hover:bg-sky-light/60'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center">
            <a
              href="https://secure.carsforsale.com/ssfinance.aspx?jesxel=725123"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sun flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
            >
              <FileText className="w-4 h-4" />
              <span>Apply Online</span>
            </a>
          </div>

          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl text-navy hover:text-sky-deep hover:bg-sky-light transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="hidden lg:block border-t border-sky-light/80 mt-2 pt-2 pb-1 bg-paper-warm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-xs text-navy-muted font-semibold">
            Simi Valley and El Monte. Honest used cars for everyday families.
          </p>
          <div className="flex items-center gap-2">
            <button
              id="sub-nav-financing"
              onClick={() => onNavigate('financing')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                currentView === 'financing'
                  ? 'bg-sun text-white shadow-md'
                  : 'text-sun hover:bg-sun-light border-2 border-sun/30'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>Financing</span>
            </button>
            <a
              href={`tel:${LOCATIONS['simi-valley'].phone}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-navy-muted hover:text-sky-deep hover:bg-sky-light transition-colors font-mono"
            >
              <Phone className="w-4 h-4 text-sky" />
              <span>{LOCATIONS['simi-valley'].phoneDisplay}</span>
            </a>
            <a
              href={`tel:${LOCATIONS['el-monte'].phone}`}
              className="btn-sun flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold font-mono"
            >
              <Phone className="w-4 h-4" />
              <span>{LOCATIONS['el-monte'].phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-drawer" className="lg:hidden border-t-2 border-sky-light bg-white px-4 pt-3 pb-5 space-y-1 reveal-entry shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-base transition-all ${
                  isActive
                    ? 'text-white bg-sky-deep font-bold border-l-4 border-sun'
                    : 'text-navy hover:text-sky-deep hover:bg-sky-light/50'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-sky-light grid gap-2.5">
            <a
              href="https://secure.carsforsale.com/ssfinance.aspx?jesxel=725123"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sun flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold"
            >
              <FileText className="w-5 h-5" />
              <span>Apply Online Securely</span>
            </a>
            <a
              href={`tel:${LOCATIONS['simi-valley'].phone}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-sky/40 text-sky-deep text-sm font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>Simi: {LOCATIONS['simi-valley'].phoneDisplay}</span>
            </a>
            <a
              href={`tel:${LOCATIONS['el-monte'].phone}`}
              className="btn-sun flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>El Monte: {LOCATIONS['el-monte'].phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
