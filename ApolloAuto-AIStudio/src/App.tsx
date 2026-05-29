import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Car, Phone, MapPin, Landmark, BookOpen, HelpCircle, FileText,
  ShieldCheck, ArrowRight, Check, ExternalLink, Calendar, AlertCircle, Sparkles, Mail
} from 'lucide-react';
import Navigation from './components/Navigation';
import ContactForm from './components/ContactForm';
import AIAssistant from './components/AIAssistant';
import ContractViewer from './components/ContractViewer';
import AdminPanel from './components/AdminPanel';
import TestimonialCarousel from './components/TestimonialCarousel';
import FinancingCalculator from './components/FinancingCalculator';
import TrustPillars from './components/TrustPillars';
import PathwayTiles from './components/PathwayTiles';
import ShopByNeedCarousel from './components/ShopByNeedCarousel';
import RevealOnScroll from './components/RevealOnScroll';
import MobileTabBar from './components/MobileTabBar';
import HeroDecor from './components/HeroDecor';
import { LOCATIONS, FAQItem, BlogArticle } from './types';

// Map URL paths to view identifiers
function pathToView(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.startsWith('/resources/guides/')) return 'blog-post';
  return pathname.replace(/^\//, '');
}

function viewToPath(view: string): string {
  return view === 'home' ? '/' : `/${view}`;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = pathToView(location.pathname);
  const blogSlug = currentView === 'blog-post'
    ? location.pathname.split('/').pop() ?? null
    : null;

  const [feed, setFeed] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);

  const selectedArticle: BlogArticle | null = blogSlug
    ? articles.find(a => a.slug === blogSlug) ?? null
    : null;

  // Fetch content once on mount
  useEffect(() => {
    fetchFeed();
    fetch('/api/faqs').then(r => r.json()).then(setFaqItems).catch(() => {});
    fetch('/api/articles').then(r => r.json()).then(setArticles).catch(() => {});
  }, []);

  // Scroll to top instantly on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch leads only when admin panel is open
  useEffect(() => {
    if (currentView === 'admin') {
      fetchLeads();
    }
  }, [currentView]);

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/feed');
      if (res.ok) {
        const data = await res.json();
        setFeed(data);
      }
    } catch (e) {
      console.error("Could not fetch feed:", e);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error("Could not fetch leads:", e);
    }
  };

  const navigateTo = (view: string) => navigate(viewToPath(view));

  return (
    <div className="min-h-screen bg-grain flex flex-col font-sans text-base text-navy antialiased">
      {/* Dynamic Header */}
      <Navigation currentView={currentView} onNavigate={navigateTo} />

      {/* Primary Area */}
      <main className="flex-grow pb-20 sm:pb-0">
        {/* Render Views based on routing state */}
        
        {/* VIEW 1: HOMEPAGE */}
        {currentView === 'home' && (
          <div id="view-homepage" className="space-y-20 pb-20">
            {/* HERO — bright SoCal welcome */}
            <section className="hero-sunny text-white pt-6 pb-20 sm:pt-8 sm:pb-24 relative overflow-hidden border-b-4 border-sun">
              <HeroDecor />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-paper pointer-events-none" aria-hidden="true" />

              {/* Scrolling welcome ticker */}
              <div className="relative z-10 overflow-hidden border-b border-white/15 bg-white/10 mb-8">
                <div className="ticker-track flex whitespace-nowrap py-2.5 text-sm font-bold text-white/95">
                  {[...Array(2)].map((_, loop) => (
                    <span key={loop} className="inline-flex items-center gap-8 px-8">
                      <span>☀️ Open Mon–Sat 9–6</span>
                      <span>🚗 Smog-certified inventory</span>
                      <span>✅ All credit welcome</span>
                      <span>📍 Simi Valley & El Monte</span>
                      <span>📞 Talk to Tim directly</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="lg:col-span-7 space-y-7 reveal-entry">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border-2 border-white/25 text-sm font-bold text-lemon">
                    <span className="w-2 h-2 rounded-full bg-success animate-gentle-pulse" />
                    Family-owned · Simi Valley & El Monte
                  </div>

                  {/* H1 and subhead FIRST — establish who we are before showing locations */}
                  <div className="space-y-4">
                    <h1 className="heading-display text-[2rem] sm:text-5xl lg:text-[3.25rem] text-white text-balance">
                      Reliable cars for families who depend on them
                    </h1>
                    <p className="text-lg sm:text-xl text-sky-light max-w-xl leading-relaxed">
                      Honest used cars, clear pricing, and help getting approved. You talk to real people you can call, not a different salesperson every time.
                    </p>
                  </div>

                  {/* Location quick-select → live CFS inventory */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={LOCATIONS['simi-valley'].inventoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-left card-glass p-4 sm:p-5 rounded-2xl cursor-pointer"
                    >
                      <span className="eyebrow text-lemon flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-lemon" />
                        Ventura County
                      </span>
                      <h4 className="font-display font-bold text-white text-lg group-hover:text-lemon transition-colors">Simi Valley Lot</h4>
                      <p className="text-sm text-sky-light mt-1">1555 Simi Town Center Way</p>
                      <p className="text-sm text-white/80 mt-0.5">(805) 404-3873</p>
                      <span className="inline-flex items-center gap-1.5 text-sm text-sun-bright font-bold mt-3 group-hover:gap-2 transition-all">
                        Browse live inventory <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </a>

                    <a
                      href={LOCATIONS['el-monte'].inventoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-left card-glass p-4 sm:p-5 rounded-2xl cursor-pointer"
                    >
                      <span className="eyebrow text-sun-bright flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sun-bright" />
                        Los Angeles County
                      </span>
                      <h4 className="font-display font-bold text-white text-lg group-hover:text-sun-bright transition-colors">El Monte Lot</h4>
                      <p className="text-sm text-sky-light mt-1">10915 Garvey Ave</p>
                      <p className="text-sm text-white/80 mt-0.5">(626) 215-0440</p>
                      <span className="inline-flex items-center gap-1.5 text-sm text-sun-bright font-bold mt-3 group-hover:gap-2 transition-all">
                        Browse live inventory <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {['No Hidden Fees', 'Smog Certified', 'All Credit Welcome', 'Trade-Ins Accepted'].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 border-2 border-white/20 text-sm sm:text-base font-bold text-white"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-lemon shrink-0" />
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-sun/20 border-2 border-sun/40 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-lemon shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-white leading-relaxed">
                      <strong className="text-lemon">Heads up:</strong> We share inventory between both lots. Call or text Tim before you drive over if you want a specific car waiting at your location.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 reveal-entry reveal-delay-2 lg:sticky lg:top-28">
                  <ContactForm onLeadSubmitted={fetchLeads} />
                </div>
              </div>
            </section>

            {/* TRUST PILLARS */}
            <TrustPillars />

            {/* PATHWAY TILES — Priddy-style quick routes */}
            <PathwayTiles onNavigate={navigateTo} />

            {/* SHOP BY NEED — featured-style horizontal carousel */}
            <ShopByNeedCarousel
              onGetMatched={() => {
                document.getElementById('contact-lead-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />

            {/* LIVE FEED COMMUNITY BULLETIN */}
            <RevealOnScroll>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-sky-light shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 space-y-1">
                  <div className="inline-flex items-center space-x-1 px-3 py-1 bg-sun-light text-sun rounded-full text-sm font-bold uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    <span>From the lot</span>
                  </div>
                  <h3 className="font-display font-extrabold text-navy text-lg sm:text-xl">Lot updates</h3>
                  <p className="text-sm text-navy-muted">Specials and news from Tim's desk.</p>
                </div>
                
                <div className="md:col-span-8 overflow-x-auto select-none flex space-x-4">
                  {feed.slice(0, 2).map((item) => (
                    <div key={item.id} className="min-w-[280px] bg-sun-light/50 p-5 rounded-2xl border-2 border-sun/25 space-y-2 flex-1 pathway-tile">
                      <div className="flex items-center justify-between text-sm font-mono text-gray-400">
                        <span>Update</span>
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-navy leading-snug">{item.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed truncate">{item.content}</p>
                    </div>
                  ))}
                  {feed.length === 0 && (
                    <p className="text-sm text-slate-500 italic">Nothing posted today. Check back soon.</p>
                  )}
                </div>
              </div>
            </section>
            </RevealOnScroll>

            {/* SIMI VALLEY LOT VS EL MONTE LOT PREVIEWS */}
            <RevealOnScroll>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="font-display font-extrabold text-3xl text-navy tracking-tight">Our two locations</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Simi Valley and El Monte. Pick your city for directions, hours, and who to call.
                </p>
              </div>

              <div id="lot-locations-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Simi lot card */}
                <div className="bg-white rounded-3xl border-2 border-sky-light shadow-md overflow-hidden flex flex-col justify-between pathway-tile">
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm uppercase font-mono font-bold text-gold bg-gold/10 px-2.5 py-1 rounded">Ventura County</span>
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-2xl text-navy">Simi Valley Branch</h3>
                      <p className="text-sm text-gray-600 leading-normal">
                        Inside Simi Town Center. Good daily drivers and easy-to-maintain cars for commuters and first-time buyers.
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-50 pt-4 space-y-2.5 text-sm text-navy-soft">
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 text-gold mr-2.5" />
                        <span>1555 Simi Town Center Way, Suite 420, Simi Valley, CA 93065</span>
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 text-gold mr-2.5" />
                        <span className="font-semibold">Call/Text Tim: (805) 404-3873</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-paper/50 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => navigateTo('simi-valley')}
                      className="text-sm font-bold text-navy hover:text-gold flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Explore Simi Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={LOCATIONS['simi-valley'].inventoryUrl}
                      target="_blank"
                      rel="noopener"
                      className="px-4 py-2 btn-sun font-bold text-sm rounded-xl flex items-center space-x-1"
                    >
                      <span>View Stock</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* El monte lot card */}
                <div className="bg-white rounded-3xl border-2 border-sky-light shadow-md overflow-hidden flex flex-col justify-between pathway-tile">
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm uppercase font-mono font-bold text-gold-light bg-gold/10 px-2.5 py-1 rounded">Los Angeles County</span>
                      <Phone className="w-5 h-5 text-gold-light" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-2xl text-navy">El Monte Branch</h3>
                      <p className="text-sm text-gray-600 leading-normal">
                        On Garvey Ave in the San Gabriel Valley. Strong on second-chance financing and bilingual help for families.
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-50 pt-4 space-y-2.5 text-sm text-navy-soft">
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 text-gold mr-2.5" />
                        <span>10915 Garvey Ave, El Monte, CA 91733</span>
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 text-gold mr-2.5" />
                        <span className="font-semibold">Call/Text Tim: (626) 215-0440</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-paper/50 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => navigateTo('el-monte')}
                      className="text-sm font-bold text-navy hover:text-gold flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Explore El Monte Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={LOCATIONS['el-monte'].inventoryUrl}
                      target="_blank"
                      rel="noopener"
                      className="px-4 py-2 btn-sun font-bold text-sm rounded-xl flex items-center space-x-1"
                    >
                      <span>View Stock</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
            </RevealOnScroll>

            {/* THE AI CAR-ADVISOR ROW FOR PARENTS, TEENS & REBUILDING CREDITORS */}
            <section className="section-sun py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Text pitch */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-light text-sky-deep rounded-full text-sm font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Tim's advisor</span>
                  </div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-navy tracking-tight leading-tight">
                    Budget and car finder
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Not sure if a past foreclosure affects you? Wondering which Honda or Toyota fits a long Ventura commute? Chat here for straight answers, trained on how Tim actually runs the lot.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-sun text-white rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                      <p className="text-gray-600"><span className="font-bold text-navy">No signup required.</span> Ask questions without giving your email or phone first.</p>
                    </div>
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-sky text-white rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                      <p className="text-gray-600"><span className="font-bold text-navy">Document help:</span> Ask what to bring if you are rebuilding credit after a repo or foreclosure.</p>
                    </div>
                  </div>
                </div>

                {/* AI advisor chat container */}
                <div className="lg:col-span-7">
                  <AIAssistant />
                </div>
              </div>
            </section>

            {/* SEVEN CHECKMARKS FINANCING EXPLAINER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left text */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="font-display font-bold text-gold uppercase text-sm tracking-wider font-mono">How it works</h3>
                <h2 className="font-display font-extrabold text-3xl text-navy tracking-tight">Our credit programs</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We do not run your credit and send you home. Tim looks at your situation personally. Here is what lenders usually want to see:
                </p>
                <div className="bg-white p-5 rounded-2xl border border-gray-150 text-sm">
                  <p className="font-bold text-navy">From Tim</p>
                  <p className="text-gray-500 mt-1 leading-normal">
                    "Lenders want to see that you can pay. Pay stubs, bank deposits, SSI, pension paperwork, it all counts. Stable families get approved here."
                  </p>
                </div>
              </div>

              {/* Checkmarks list */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-150 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Valid California driver\'s license or state ID.',
                  'Proof of work: recent W2 pay stubs or bank deposit records.',
                  'Proof of where you live: utility, phone, or gas bill.',
                  'Five local references (friends, employer, or family).',
                  'Trade-in value applied toward your down payment.',
                  'No prepayment penalty in California. Pay off early and save on interest.',
                  'Co-signers welcome to help with rate and approval.',
                  'Bilingual staff to walk through everything in Spanish.'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-paper/20 rounded-xl">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5 bg-success/10 rounded-full p-1 border border-success/25" />
                    <span className="text-sm text-navy leading-normal font-sans">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* DYNAMIC CALCULATOR SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FinancingCalculator />
            </section>

            {/* QUOTE BLOCK */}
            <section className="hero-sunny py-12 text-white text-center relative overflow-hidden">
              <HeroDecor />
              <div className="max-w-3xl mx-auto px-4 space-y-4 relative z-10 reveal-entry">
                <p className="text-lg sm:text-xl italic font-sans text-white">
                  "I built Apollo Auto so my neighbors in Simi Valley and El Monte could shop without their guard up. We sell sensible cars, explain every line on the contract in plain English, and you talk to me directly. That is my family's promise."
                </p>
                <div>
                  <h4 className="text-sm font-bold text-lemon">Tim Harmantzis</h4>
                  <p className="text-sm text-sky-light font-mono">Owner & Operator, Apollo Auto</p>
                </div>
              </div>
            </section>

            {/* CUSTOMER TESTIMONIALS CAROUSEL */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <TestimonialCarousel />
            </section>

            {/* BLOG SELECTION BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-3xl text-navy tracking-tight">Buying tips</h2>
                  <p className="text-sm text-gray-500 mt-1">Guides to help protect your family's budget.</p>
                </div>
                <button
                  onClick={() => navigateTo('resources')}
                  className="text-sm font-bold text-gold hover:text-navy hover:underline cursor-pointer"
                >
                  View all buyer guides & forms
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 3).map((art) => (
                  <div
                    key={art.slug}
                    onClick={() => navigate(`/resources/guides/${art.slug}`)}
                    className="bg-white rounded-2xl border-2 border-sky-light p-5 space-y-4 cursor-pointer pathway-tile flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-sm font-mono font-semibold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">
                        {art.category}
                      </span>
                      <h3 className="text-sm font-bold text-navy leading-snug hover:text-gold transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-normal line-clamp-3">
                        {art.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-sm text-gray-400">
                      <span>{art.date}</span>
                      <span className="font-semibold text-navy flex items-center space-x-1">
                        <span>Read guide</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SIMI VALLEY LOT PAGE */}
        {currentView === 'simi-valley' && (
          <div id="view-simi-valley" className="space-y-16 pb-20 reveal-entry">
            {/* Splash Header */}
            <section className="hero-sunny text-white py-12 px-4 shadow-sm border-b-4 border-sun relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <span className="text-sm font-bold tracking-widest uppercase text-gold">Simi Valley lot</span>
                <h1 className="font-display font-extrabold text-4xl text-white tracking-tight leading-tight">
                  Used Cars in Simi Valley, CA
                </h1>
                <p className="text-sm text-gray-300 max-w-xl">
                  Serving Thousand Oaks, Moorpark, Camarillo, Oxnard, Ventura, Chatsworth, and the Conejo and San Fernando Valleys. Honest pricing and clear paperwork.
                </p>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Lot details & checklist */}
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
                  <h2 className="font-display font-extrabold text-2xl text-navy">About this location</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our Simi Valley lot focuses on clean commuters (Honda, Toyota, Nissan, Ford) for daily driving, family errands, and teen drivers.
                  </p>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Opening Hours</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono text-gray-600">
                      <div>
                        <p className="font-semibold text-navy">Lot operations</p>
                        <p className="mt-1">Mon - Sat: 9:00 AM - 6:00 PM</p>
                        <p className="mt-0.5">Sunday: Closed</p>
                      </div>
                      <div>
                        <p className="font-semibold text-navy">Phone Support (Tim)</p>
                        <p className="mt-1">Daily: 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Areas Served</h3>
                    <div className="flex flex-wrap gap-2">
                      {LOCATIONS['simi-valley'].areasServed.map((area, index) => (
                        <span key={index} className="px-2.5 py-1 bg-paper text-navy font-semibold rounded text-sm border border-gray-100 uppercase">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Local FAQ */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-lg text-navy">Simi Valley Lot FAQ</h3>
                  <div className="space-y-4">
                    {faqItems.filter(f => f.category === 'visiting').slice(0, 3).map((faq) => (
                      <div key={faq.id} className="space-y-1">
                        <h4 className="text-sm font-bold text-navy flex items-start">
                          <span className="text-gold mr-1 border border-gold/30 rounded px-1 text-[8px] uppercase select-none mt-0.5 shrink-0">Q</span>
                          <span>{faq.question}</span>
                        </h4>
                        <p className="text-sm text-gray-600 pl-4">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction Lead Frame */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 bg-navy text-white rounded-3xl border border-navy-soft/30 space-y-4 shadow-sm">
                  <h3 className="font-display font-bold text-lg text-white">Call the Simi lot</h3>
                  <p className="text-sm text-gray-300 leading-normal">
                    Tim is on the lot most days, or a text away. This form helps him pull your file before you arrive.
                  </p>
                  <div className="space-y-2 text-sm font-mono">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 text-gold mr-2" />
                      <span>Phone: (805) 404-3873</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 text-gold mr-2" />
                      <span>Email: apolloautous@gmail.com</span>
                    </p>
                  </div>
                  <a
                    href={LOCATIONS['simi-valley'].inventoryUrl}
                    target="_blank"
                    rel="noopener"
                    className="block text-center py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm transition-colors"
                  >
                    View inventory
                  </a>
                  <p className="text-sm text-gray-300 text-center leading-normal mt-2">
                    We share cars between both lots. Text Tim first if you want a specific vehicle ready at Simi Valley.
                  </p>
                </div>

                <ContactForm initialLocation="simi-valley" onLeadSubmitted={fetchLeads} />
              </div>
            </section>

            {/* Google Map Embedded Frame */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <h3 className="font-display font-bold text-navy text-lg">Map and directions</h3>
              <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-sm h-80 sm:h-96">
                <iframe
                  title="Simi Valley Coordinates Map"
                  src={LOCATIONS['simi-valley'].mapEmbedUrl}
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 3: EL MONTE LOT PAGE */}
        {currentView === 'el-monte' && (
          <div id="view-el-monte" className="space-y-16 pb-20 reveal-entry">
            {/* Splash Header */}
            <section className="hero-sunny text-white py-12 px-4 shadow-sm border-b-4 border-sun relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <span className="text-sm font-bold tracking-widest uppercase text-gold">El Monte lot</span>
                <h1 className="font-display font-extrabold text-4xl text-white tracking-tight leading-tight">
                  Used Cars for Sale in El Monte, CA
                </h1>
                <p className="text-sm text-gray-300 max-w-xl">
                  Serving El Monte, West Covina, Baldwin Park, Temple City, Monterey Park, Arcadia, Alhambra, and the San Gabriel Valley. Strong on credit rebuilding, flexible down payments, and bilingual family support.
                </p>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Lot details & checklist */}
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
                  <h2 className="font-display font-extrabold text-2xl text-navy">About this location</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our El Monte lot on Garvey Ave has fuel-efficient sedans and family-sized crossovers. We work with lenders who understand repos, thin credit, and cash-based income.
                  </p>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Opening Hours</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono text-gray-600">
                      <div>
                        <p className="font-semibold text-navy">Lot operations</p>
                        <p className="mt-1">Mon - Sat: 9:00 AM - 6:00 PM</p>
                        <p className="mt-0.5">Sunday: Closed</p>
                      </div>
                      <div>
                        <p className="font-semibold text-navy">Phone Support (Tim)</p>
                        <p className="mt-1">Daily: 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Areas Served</h3>
                    <div className="flex flex-wrap gap-2">
                      {LOCATIONS['el-monte'].areasServed.map((area, index) => (
                        <span key={index} className="px-2.5 py-1 bg-paper text-navy font-semibold rounded text-sm border border-gray-100 uppercase">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Local FAQ */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-lg text-navy">El Monte Lot FAQ</h3>
                  <div className="space-y-4">
                    {faqItems.filter(f => f.category === 'financing').slice(0, 3).map((faq) => (
                      <div key={faq.id} className="space-y-1">
                        <h4 className="text-sm font-bold text-navy flex items-start">
                          <span className="text-gold mr-1 border border-gold/30 rounded px-1 text-[8px] uppercase select-none mt-0.5 shrink-0">Q</span>
                          <span>{faq.question}</span>
                        </h4>
                        <p className="text-sm text-gray-600 pl-4">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction Lead Frame */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 bg-navy text-white rounded-3xl border border-navy-soft/30 space-y-4 shadow-sm">
                  <h3 className="font-display font-bold text-lg text-white">Call the El Monte lot</h3>
                  <p className="text-sm text-gray-300 leading-normal">
                    Tim and the team help with trade-ins and tough-credit approvals. Spanish-speaking staff on site.
                  </p>
                  <div className="space-y-2 text-sm font-mono">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 text-gold mr-2" />
                      <span>Phone: (626) 215-0440</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 text-gold mr-2" />
                      <span>Email: apolloautous@gmail.com</span>
                    </p>
                  </div>
                  <a
                    href={LOCATIONS['el-monte'].inventoryUrl}
                    target="_blank"
                    rel="noopener"
                    className="block text-center py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm transition-colors"
                  >
                    View inventory
                  </a>
                  <p className="text-sm text-gray-300 text-center leading-normal mt-2">
                    We share cars between both lots. Text Tim first if you want a specific vehicle ready at El Monte.
                  </p>
                </div>

                <ContactForm initialLocation="el-monte" onLeadSubmitted={fetchLeads} />
              </div>
            </section>

            {/* Google Map Embedded Frame */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <h3 className="font-display font-bold text-navy text-lg">Map and directions</h3>
              <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-sm h-80 sm:h-96">
                <iframe
                  title="El Monte Coordinates Map"
                  src={LOCATIONS['el-monte'].mapEmbedUrl}
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 4: FINANCING DETAILED LAYOUT */}
        {currentView === 'financing' && (
          <div id="view-financing" className="space-y-16 pb-20 reveal-entry">
            {/* Splash Header */}
            <section className="hero-sunny text-white py-12 px-4 shadow-sm border-b-4 border-sun relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <span className="text-sm font-bold tracking-widest uppercase text-gold">Financing</span>
                <h1 className="font-display font-extrabold text-4xl text-white tracking-tight leading-tight">
                  Credit programs that make sense
                </h1>
                <p className="text-sm text-gray-300 max-w-xl">
                  Buying a car can help rebuild credit when the terms are fair. Here is how Tim walks you through documents, down payments, and co-signers.
                </p>
              </div>
            </section>

            {/* Main explain section */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-sm uppercase font-bold text-gold tracking-widest font-mono">More than a credit score</h3>
                <h2 className="font-display font-extrabold text-3xl text-navy">Approved based on stability</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Big dealerships often run your credit and turn you away for old repos, medical debt, or a recent foreclosure.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Apollo works with lenders who care more about whether you can pay today. Pay stubs, bank deposits, and steady income matter more than a number on a screen.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-lg text-navy">What to bring</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Bring these to your visit and Tim can often get an answer the same day:</p>

                <div className="space-y-4">
                  {[
                    { title: 'California driver\'s license', desc: 'Valid ID, permit, or passport.' },
                    { title: 'Pay stubs or deposits', desc: 'Two recent W2 stubs or three months of bank statements.' },
                    { title: 'Proof of address', desc: 'Utility, water, trash, internet, or cell phone bill.' },
                    { title: 'References', desc: 'Five people who know you, with working phone numbers.' }
                  ].map((d, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gold/15 text-gold font-bold text-sm rounded flex items-center justify-center mt-0.5 select-none shrink-0 border border-gold/10">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy leading-none">{d.title}</h4>
                        <p className="text-sm text-gray-500 mt-1 leading-normal">{d.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* AI Advisor Panel nested inside financing for fast help */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-navy">Questions about financing?</h3>
                <p className="text-sm text-slate-500 max-w-xl mx-auto">Ask about documents, co-signers, or down payments before you visit.</p>
              </div>
              <AIAssistant initialCtx={{ credit: 'Consulted credit guide' }} />
            </section>
          </div>
        )}

        {/* VIEW 5: RESOURCES AND CONTRACT CLAUSE EXPLORER */}
        {currentView === 'resources' && (
          <div id="view-resources" className="space-y-20 pb-20 reveal-entry">
            {/* Splash Header */}
            <section className="hero-sunny text-white py-12 px-4 shadow-sm border-b-4 border-sun relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <span className="text-sm font-bold tracking-widest uppercase text-gold">Before you visit</span>
                <h1 className="font-display font-extrabold text-4xl text-white tracking-tight leading-tight">
                  Guides and contracts
                </h1>
                <p className="text-sm text-gray-300 max-w-xl">
                  Read real California purchase paperwork, look up terms, and use our checklists so nothing catches you off guard at the lot.
                </p>
              </div>
            </section>

            {/* Contract Viewer */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ContractViewer />
            </section>

            {/* Detailed Articles Index */}
            <section id="guides-hub-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="border-b border-gray-100 pb-4 max-w-xl">
                <h2 className="font-display font-extrabold text-2xl text-navy">California used car guides</h2>
                <p className="text-sm text-gray-500 mt-1">Titles, smog, inspections, and credit tips for local buyers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <div
                    key={art.slug}
                    onClick={() => navigate(`/resources/guides/${art.slug}`)}
                    className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 cursor-pointer hover:border-gold/30 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-sm font-mono font-bold uppercase text-gold bg-gold/10 px-2.5 py-0.5 rounded">
                        {art.category}
                      </span>
                      <h3 className="text-sm font-semibold text-navy leading-snug hover:text-gold transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 pt-3 border-t border-gray-50">
                      <span>{art.date}</span>
                      <span className="font-bold text-navy flex items-center space-x-1.5 hover:text-gold transition-colors">
                        <span>Read Chapter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 6: HELP & FAQ HUB */}
        {currentView === 'faq' && (
          <div id="view-faq" className="space-y-16 pb-20 reveal-entry">
            {/* Splash Header */}
            <section className="hero-sunny text-white py-12 px-4 shadow-sm border-b-4 border-sun relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <span className="text-sm font-bold tracking-widest uppercase text-gold">Common questions</span>
                <h1 className="font-display font-extrabold text-4xl text-white tracking-tight leading-tight">
                  Buying and financing FAQ
                </h1>
                <p className="text-sm text-gray-300 max-w-xl">
                  Straight answers on California used car buying, taxes, down payments, and co-signers.
                </p>
              </div>
            </section>

            {/* Interactive category filters */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Segment 1: Catalog & buying */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <Car className="w-5 h-5 text-gold shrink-0" />
                    <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider">Buying & Inventory</h3>
                  </div>
                  <div className="space-y-4">
                    {faqItems.filter(f => f.category === 'buying').map((faq) => (
                      <details key={faq.id} className="group text-sm select-none border-b border-gray-50 pb-2.5">
                        <summary className="font-bold text-navy hover:text-gold cursor-pointer flex justify-between items-center list-none pr-3">
                          <span>{faq.question}</span>
                          <span className="transition-transform group-open:rotate-180">↓</span>
                        </summary>
                        <p className="text-gray-600 mt-1 pl-2 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>

                {/* Segment 2: Finance & Trade */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <Landmark className="w-5 h-5 text-gold shrink-0" />
                    <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider">Credit & trade-Ins</h3>
                  </div>
                  <div className="space-y-4">
                    {faqItems.filter(f => f.category === 'financing').map((faq) => (
                      <details key={faq.id} className="group text-sm select-none border-b border-gray-50 pb-2.5">
                        <summary className="font-bold text-navy hover:text-gold cursor-pointer flex justify-between items-center list-none pr-3">
                          <span>{faq.question}</span>
                          <span className="transition-transform group-open:rotate-180">↓</span>
                        </summary>
                        <p className="text-gray-600 mt-1 pl-2 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>

                {/* Segment 3: Lot Logistics */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <MapPin className="w-5 h-5 text-gold shrink-0" />
                    <h3 className="font-display font-bold text-sm text-navy uppercase tracking-wider">Visiting Details</h3>
                  </div>
                  <div className="space-y-4">
                    {faqItems.filter(f => f.category === 'visiting').map((faq) => (
                      <details key={faq.id} className="group text-sm select-none border-b border-gray-50 pb-2.5">
                        <summary className="font-bold text-navy hover:text-gold cursor-pointer flex justify-between items-center list-none pr-3">
                          <span>{faq.question}</span>
                          <span className="transition-transform group-open:rotate-180">↓</span>
                        </summary>
                        <p className="text-gray-600 mt-1 pl-2 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 7: INDIVIDUAL SEO BLOG READING LAYOUT */}
        {currentView === 'blog-post' && selectedArticle && (
          <article id="view-blog-reading-pane" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 reveal-entry">
            <button
              onClick={() => navigateTo('resources')}
              className="text-sm font-bold text-navy hover:text-gold flex items-center space-x-2 cursor-pointer pb-2 border-b border-gray-100 select-none"
            >
              <span>← Back to all Buyer Guides & Resources</span>
            </button>

            {/* Article Meta Head */}
            <header className="space-y-4">
              <span className="text-sm font-mono uppercase bg-gold/15 text-gold px-2.5 py-1 rounded font-bold">
                {selectedArticle.category}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-navy leading-tight">
                {selectedArticle.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 font-mono">
                <span>By Tim Harmantzis</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </header>

            {/* Main parsed markdown block inside custom visual canvas */}
            <div
              id="article-read-content"
              className="prose prose-sm prose-navy max-w-none text-gray-700 leading-relaxed space-y-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            >
            </div>

            {/* Informative Footer Box inside reading panel */}
            <div className="p-6 bg-navy text-white rounded-3xl border border-navy-soft/35 space-y-4">
              <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Want help with your situation?</span>
              </h3>
              <p className="text-sm text-gray-300 max-w-xl">
                Bring your pay stubs and bills when you visit. Tim can usually tell you where you stand in one conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigateTo('home')}
                  className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold rounded-xl transition-all"
                >
                  Get pre-approved
                </button>
                <a
                  href={`tel:${LOCATIONS['simi-valley'].phone}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl text-center"
                >
                  Call Simi Valley: (805) 404-3873
                </a>
              </div>
            </div>
          </article>
        )}

        {/* VIEW 8: SECURE ADMIN STATION ROUTED PORT */}
        {currentView === 'admin' && (
          <section id="view-admin-cms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AdminPanel
              onAnnouncementAdded={fetchFeed}
              leadsList={leads}
              onRefreshLeads={fetchLeads}
            />
          </section>
        )}
      </main>

      {/* FOOTER BLOCK WITH INTERACTIVE DETAILS AND NAP CONFIRMATIONS */}
      <footer id="brand-footer" className="bg-sky-deep text-white border-t-4 border-sun py-12 px-4 pb-24 sm:pb-12 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-white/15 px-3 py-1.5 rounded-xl border-2 border-lemon/50 w-max">
                <Car className="text-lemon w-4 h-4" />
                <span className="font-display font-extrabold text-white text-sm tracking-wide">APOLLO AUTO</span>
              </div>
              <p className="text-sm text-white/90 leading-normal">
                A family-owned used car dealer in Simi Valley and El Monte. Safe daily drivers, honest pricing, and paperwork you can actually understand.
              </p>
              <p className="text-sm text-white/75 font-mono">
                Mailing: apolloautous@gmail.com
              </p>
            </div>

            {/* Column 2: Directions / Simi Valley */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-lemon uppercase tracking-wider">Simi Valley Facility</h4>
              <p className="text-sm text-white/85">Ventura County Lot • Thousand Oaks & Moorpark commutes</p>
              <p className="text-sm text-white leading-normal font-semibold">
                1555 Simi Town Center Way, Suite 420<br />
                Simi Valley, CA 93065
              </p>
              <a
                href={`tel:${LOCATIONS['simi-valley'].phone}`}
                className="block text-sm text-lemon hover:text-white font-mono font-bold"
              >
                Call: {LOCATIONS['simi-valley'].phoneDisplay}
              </a>
            </div>

            {/* Column 3: Directions / El Monte */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-lemon uppercase tracking-wider">El Monte Facility</h4>
              <p className="text-sm text-white/85">Los Angeles Lot • San Gabriel Valley & West Covina</p>
              <p className="text-sm text-white leading-normal font-semibold">
                10915 Garvey Ave<br />
                El Monte, CA 91733
              </p>
              <a
                href={`tel:${LOCATIONS['el-monte'].phone}`}
                className="block text-sm text-lemon hover:text-white font-mono font-bold"
              >
                Call: {LOCATIONS['el-monte'].phoneDisplay}
              </a>
            </div>

            {/* Column 4: Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Useful Channels</h4>
              <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                <button onClick={() => navigateTo('home')} className="text-left text-white/90 hover:text-lemon cursor-pointer">Homepage</button>
                <button onClick={() => navigateTo('financing')} className="text-left text-white/90 hover:text-lemon cursor-pointer">Financing</button>
                <button onClick={() => navigateTo('resources')} className="text-left text-white/90 hover:text-lemon cursor-pointer">Guides Hub</button>
                <button onClick={() => navigateTo('faq')} className="text-left text-white/90 hover:text-lemon cursor-pointer">Q&A FAQ</button>
              </div>
              <div className="pt-2">
                <span className="text-sm text-white/80 font-mono leading-relaxed">
                  Standard Smog test certifications registered. Licenses bonded by CA DMV.
                </span>
              </div>
            </div>
          </div>

          {/* Local SEO Details Collapse Block */}
          <div className="pt-6 border-t border-white/20 text-sm">
            <details className="group cursor-pointer select-none">
              <summary className="list-none flex items-center space-x-1 hover:text-lemon text-sm font-bold uppercase tracking-widest text-white/90">
                <span>View local Google SEO Coordinates Schema</span>
                <span className="transition-transform group-open:rotate-180">↓</span>
              </summary>
              <div className="p-4 bg-white/12 rounded-xl border border-white/20 mt-3 space-y-4 font-sans text-sm leading-relaxed text-white/90">
                <div>
                  <h5 className="font-bold text-lemon mb-1">Local Business NAP Identifiers (Local Schema)</h5>
                  <p>
                    <strong className="text-white">Business:</strong> Apollo Auto (Family-Owned Licensee Database) <br />
                    <strong className="text-white">Coordinates Simi:</strong> 1555 Simi Town Center Way, Suite 420, Simi Valley, Ventura County, CA 93065 | Phone: (805) 404-3873 <br />
                    <strong className="text-white">Coordinates El Monte:</strong> 10915 Garvey Ave, El Monte, Los Angeles County, CA 91733 | Phone: (626) 215-0440
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-lemon mb-1">Primary Keywords Targeted</h5>
                  <p>
                    Used Cars Simi Valley, Used Car Dealer Simi Valley, Reliable Commuter Cars Thousand Oaks Moorpark, Used Cars El Monte, Used Cars for Sale El Monte, Bad Credit used car financing Los Angeles Ventura, Second-chance auto loans Southern California, California trade-ins.
                  </p>
                </div>
              </div>
            </details>
          </div>

          {/* Legal credit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-white/80 border-t border-white/20 pt-6">
            <span>© 2026 Apollo Auto. All legal rights reserved. Family-Owned and operated with care.</span>
            <span className="font-mono text-white/75">DMV Bonded License • Designed in Simi Valley & El Monte</span>
          </div>
        </div>
      </footer>

      <MobileTabBar currentView={currentView} onNavigate={navigateTo} />
    </div>
  );
}
