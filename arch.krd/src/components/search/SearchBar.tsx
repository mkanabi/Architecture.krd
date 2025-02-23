import React from 'react';
import { Search } from 'lucide-react';
import { Language } from '@/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  language: Language;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, language }) => {
  const [query, setQuery] = React.useState('');

  const translations = {
    en: {
      placeholder: "Search buildings, locations, periods...",
      search: "Search"
    },
    ku: {
      placeholder: "گەڕان بۆ بیناکان، شوێنەکان، سەردەمەکان...",
      search: "گەڕان"
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={translations[language].placeholder}
          className="w-full border-4 border-black p-4 pr-12 font-mono"
          dir={language === 'ku' ? 'rtl' : 'ltr'}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 hover:bg-black hover:text-white transition-colors"
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;