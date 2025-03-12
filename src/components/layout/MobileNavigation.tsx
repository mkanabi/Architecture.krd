import React from 'react';
import { Menu, X, Home, Map, Clock, Compare, Info, Phone, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Language } from '@/types';

interface MobileNavigationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  language,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const translations = {
    en: {
      home: "Home",
      map: "Map View",
      timeline: "Timeline",
      compare: "Compare Buildings",
      about: "About",
      contact: "Contact"
    },
    ku: {
      home: "سەرەکی",
      map: "نەخشە",
      timeline: "هێڵی کات",
      compare: "بەراوردی بیناکان",
      about: "دەربارە",
      contact: "پەیوەندی"
    }
  };

  const menuItems = [
    { href: '/', icon: Home, label: translations[language].home },
    { href: '/map', icon: Map, label: translations[language].map },
    { href: '/timeline', icon: Clock, label: translations[language].timeline },
    { href: '/compare', icon: Compare, label: translations[language].compare },
    { href: '/about', icon: Info, label: translations[language].about },
    { href: '/contact', icon: Phone, label: translations[language].contact },
  ];

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 hover:bg-white hover:text-black transition-colors"
      >
        <Menu size={32} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="flex flex-col h-full text-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white">
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'ku' : 'en')}
                className="p-2 hover:bg-white hover:text-black transition-colors"
              >
                <Globe size={24} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white hover:text-black transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-4">
                {menuItems.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-4 p-4 text-xl font-mono ${
                          isActive ? 'bg-white text-black' : 'hover:bg-white hover:text-black'
                        } transition-colors`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon size={24} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;