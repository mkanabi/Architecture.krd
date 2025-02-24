import React from 'react';
import { Globe, Menu, X, Map, Clock, GitCompare, LayoutDashboard } from 'lucide-react';
import { Language } from '@/types';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface MainLayoutProps {
  children: React.ReactNode;
  onLanguageChange?: (language: Language) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onLanguageChange }) => {
  const [language, setLanguage] = React.useState<Language>('ku');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const router = useRouter();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  const translations = {
    en: {
      title: "KURDISTAN ARCHITECTURAL HERITAGE",
      search: "SEARCH...",
      eras: "HISTORICAL ERAS",
      regions: "REGIONS",
      features: "FEATURES",
      map: "MAP VIEW",
      timeline: "TIMELINE",
      compare: "COMPARE BUILDINGS",
      admin: "ADMIN DASHBOARD",
      about: "ABOUT",
      contact: "CONTACT"
    },
    ku: {
      title: "میراتی تەلارسازیی کورستان",
      search: "گەڕان...",
      eras: "سەردەمە مێژووییەکان",
      regions: "ناوچەکان",
      features: "تایبەتمەندییەکان",
      map: "نەخشە",
      timeline: "هێڵی کات",
      compare: "بەراوردی بیناکان",
      admin: "داشبۆردی بەڕێوەبردن",
      about: "دەربارە",
      contact: "پەیوەندی"
    }
  };

  const architecturalEras = {
    en: [
      "ANCIENT MESOPOTAMIAN",
      "MEDIAN PERIOD",
      "ISLAMIC GOLDEN AGE",
      "OTTOMAN PERIOD",
      "MODERN KURDISH"
    ],
    ku: [
      "مێژووی کۆنی مێزۆپۆتامیا",
      "سەردەمی میدی",
      "سەردەمی زێڕینی ئیسلامی",
      "سەردەمی عوسمانی",
      "کوردی هاوچەرخ"
    ]
  };

  const regions = {
    en: [
      "HEWLÊR (ERBIL)",
      "SILÊMANÎ",
      "DUHOK",
      "KERMANSHAH",
      "SANANDAJ"
    ],
    ku: [
      "هەولێر",
      "سلێمانی",
      "دهۆک",
      "کرماشان",
      "سنە"
    ]
  };

  return (
    <div className="min-h-screen bg-white" dir={language === 'ku' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-black text-white p-4 border-b-4 border-white">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-white hover:text-black p-2 transition-colors"
            >
              {isSidebarOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
            <Link href="/">
              <h1 className="font-mono text-4xl uppercase tracking-tighter">
                {translations[language].title}
              </h1>
            </Link>
          </div>
          <button 
            onClick={() => handleLanguageChange(language === 'en' ? 'ku' : 'en')}
            className="hover:bg-white hover:text-black p-2 transition-colors"
          >
            <Globe size={32} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-72 bg-black text-white p-8 min-h-screen">
            <nav className="font-mono">
              {/* Features Section */}
              <h2 className="text-2xl mb-4 border-b-2 border-white pb-2">
                {translations[language].features}
              </h2>
              <ul className="space-y-4 text-lg mb-8">
                <li>
                  <Link 
                    href="/map"
                    className="flex items-center gap-2 hover:bg-white hover:text-black p-2 transition-colors"
                  >
                    <Map size={20} />
                    {translations[language].map}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/timeline"
                    className="flex items-center gap-2 hover:bg-white hover:text-black p-2 transition-colors"
                  >
                    <Clock size={20} />
                    {translations[language].timeline}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/compare"
                    className="flex items-center gap-2 hover:bg-white hover:text-black p-2 transition-colors"
                  >
                    <GitCompare size={20} />
                    {translations[language].compare}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/dashboard"
                    className="flex items-center gap-2 hover:bg-white hover:text-black p-2 transition-colors"
                  >
                    <LayoutDashboard size={20} />
                    {translations[language].admin}
                  </Link>
                </li>
              </ul>

              {/* Eras Section */}
              <h2 className="text-2xl mb-4 border-b-2 border-white pb-2">
                {translations[language].eras}
              </h2>
              <ul className="space-y-4 text-lg">
                {architecturalEras[language].map((era, index) => (
                  <li 
                    key={index} 
                    className="hover:bg-white hover:text-black p-2 cursor-pointer transition-colors"
                    onClick={() => router.push(`/era/${index}`)}
                  >
                    {era}
                  </li>
                ))}
              </ul>
              
              {/* Regions Section */}
              <h2 className="text-2xl mt-12 mb-4 border-b-2 border-white pb-2">
                {translations[language].regions}
              </h2>
              <ul className="space-y-4 text-lg">
                {regions[language].map((region, index) => (
                  <li 
                    key={index} 
                    className="hover:bg-white hover:text-black p-2 cursor-pointer transition-colors"
                    onClick={() => router.push(`/region/${index}`)}
                  >
                    {region}
                  </li>
                ))}
              </ul>

              {/* Footer Links */}
              <div className="mt-12 space-y-4">
                <Link 
                  href="/about"
                  className="block hover:bg-white hover:text-black p-2 transition-colors"
                >
                  {translations[language].about}
                </Link>
                <Link 
                  href="/contact"
                  className="block hover:bg-white hover:text-black p-2 transition-colors"
                >
                  {translations[language].contact}
                </Link>
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;