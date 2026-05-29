import { Car, Phone, MapPin, FileText } from 'lucide-react';
import { LOCATIONS } from '../types';

interface MobileTabBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function MobileTabBar({ currentView, onNavigate }: MobileTabBarProps) {
  const isElMonte = currentView === 'el-monte';
  const isSimiValley = currentView === 'simi-valley';

  const activeInventoryUrl = isElMonte
    ? LOCATIONS['el-monte'].inventoryUrl
    : LOCATIONS['simi-valley'].inventoryUrl;

  const phone = isElMonte ? LOCATIONS['el-monte'].phone : LOCATIONS['simi-valley'].phone;

  // "Our Lots": if on a specific lot page go to the other lot; otherwise go home to the locations grid
  const handleLotsNav = () => {
    if (isElMonte) onNavigate('simi-valley');
    else if (isSimiValley) onNavigate('el-monte');
    else onNavigate('home');
  };

  const tabs = [
    {
      label: 'Stock',
      icon: Car,
      onClick: () => window.open(activeInventoryUrl, '_blank', 'noopener,noreferrer'),
    },
    {
      label: 'Call Tim',
      icon: Phone,
      onClick: () => { window.location.href = `tel:${phone}`; },
    },
    {
      label: 'Our Lots',
      icon: MapPin,
      onClick: handleLotsNav,
    },
    {
      label: 'Apply',
      icon: FileText,
      onClick: () =>
        window.open('https://secure.carsforsale.com/ssfinance.aspx?jesxel=725123', '_blank', 'noopener,noreferrer'),
    },
  ];

  return (
    <nav
      id="mobile-tab-bar"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t-2 border-sky-light safe-area-pb shadow-[0_-4px_20px_rgba(15,39,68,0.1)]"
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={tab.onClick}
              className="flex flex-col items-center justify-center gap-1 py-3 px-1 text-navy hover:text-sun active:bg-sun-light transition-colors touch-target min-h-[3.5rem]"
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
