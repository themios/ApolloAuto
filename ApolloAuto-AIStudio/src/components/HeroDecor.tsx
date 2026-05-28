/** Floating solid shapes — no mesh gradients */
export default function HeroDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="hero-blob hero-blob-a bg-sun/20 w-48 h-48 sm:w-64 sm:h-64 top-[8%] -right-12" />
      <div className="hero-blob hero-blob-b bg-lemon/15 w-32 h-32 sm:w-44 sm:h-44 top-[55%] left-[4%]" />
      <div className="hero-blob hero-blob-c bg-white/8 w-24 h-24 sm:w-36 sm:h-36 bottom-[18%] right-[22%]" />
      <div className="hero-blob hero-blob-d bg-coral/12 w-20 h-20 sm:w-28 sm:h-28 top-[28%] left-[38%]" />
    </div>
  );
}
