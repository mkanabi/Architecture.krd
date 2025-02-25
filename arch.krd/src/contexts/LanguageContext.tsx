import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Language } from '@/types';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {}
});

export const LanguageProvider = ({ children }) => {
  // Initialize with stored preference or default to English
  const [language, setLanguageState] = useState<Language>('en');
  const { data: session } = useSession();

  // Initialize language from localStorage or user session on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language;
    
    // Priority: 1. localStorage, 2. user profile from session, 3. default 'en'
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ku')) {
      setLanguageState(storedLanguage);
    } else if (session?.user?.language) {
      setLanguageState(session.user.language as Language);
    }
  }, [session]);

  // Function to update language and persist it
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // Optional: If you want to update the user's profile in the database
    // Make an API call here to update the user's language preference
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);