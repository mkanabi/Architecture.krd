import React from 'react';
import { Search, MapPin, Building } from 'lucide-react';
import { Language } from '@/types';
import { useRouter } from 'next/router';

interface SearchResult {
  type: 'building' | 'location';
  id?: string;
  title: {
    en: string;
    ku: string;
  };
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  language: Language;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, language }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const router = useRouter();

  const translations = {
    en: {
      placeholder: "Search buildings, locations...",
      building: "Building",
      location: "Location",
      noResults: "No results found"
    },
    ku: {
      placeholder: "گەڕان بۆ بیناکان، شوێنەکان...",
      building: "بینا",
      location: "شوێن",
      noResults: "هیچ ئەنجامێک نەدۆزرایەوە"
    }
  };

  const searchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchResults(query);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'building' && result.id) {
      router.push(`/building/${result.id}`);
    } else if (result.type === 'location') {
      onSearch(result.title[language]);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={translations[language].placeholder}
          className="w-full border-4 border-black p-4 font-mono"
          dir={language === 'ku' ? 'rtl' : 'ltr'}
        />
        <button
          className="absolute top-0 bottom-0 right-0 px-6 bg-black text-white hover:bg-white hover:text-black transition-colors border-l-4 border-black"
          style={{ [language === 'ku' ? 'left' : 'right']: 0 }}
        >
          <Search size={24} />
        </button>
      </div>

      {/* Dropdown Results */}
      {showDropdown && query.length > 0 && (
        <div 
          className="absolute w-full mt-2 border-4 border-black bg-white z-50"
          dir={language === 'ku' ? 'rtl' : 'ltr'}
        >
          {isLoading ? (
            <div className="p-4 font-mono text-center">
              {language === 'en' ? 'Searching...' : 'گەڕان...'}
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li 
                  key={index}
                  className="border-b-2 border-black last:border-b-0 cursor-pointer hover:bg-black hover:text-white transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="p-4 flex items-center gap-3">
                    {result.type === 'building' ? (
                      <Building size={20} />
                    ) : (
                      <MapPin size={20} />
                    )}
                    <span className="font-mono">
                      {result.title[language]}
                    </span>
                    <span className="text-sm opacity-70 font-mono">
                      ({translations[language][result.type]})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 font-mono text-center">
              {translations[language].noResults}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;