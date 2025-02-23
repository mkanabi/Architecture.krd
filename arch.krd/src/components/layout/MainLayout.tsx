import React from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { Language } from '@/types';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [language, setLanguage] = React.useState<Language>('ku');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const router = useRouter();

  const translations = {
    en: {
      title: "KURDISH ARCHITECTURAL HERITAGE",
      search: "SEARCH...",
      eras: "HISTORICAL ERAS",
      regions: "REGIONS",
      about: "ABOUT",
      contact: "CONTACT"
    },
    ku: {
      title: "میراتی تەلارسازیی کوردی",
      search: "گەڕان...",
      eras: "سەردەمە مێژووییەکان",
      regions: "ناوچەکان",
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
            onClick={() => setLanguage(language === 'en' ? 'ku' : 'en')}
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