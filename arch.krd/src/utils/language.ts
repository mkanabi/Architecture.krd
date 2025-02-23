import { Language } from '@/types';

export const toggleLanguage = (current: Language): Language => {
  return current === 'en' ? 'ku' : 'en';
};

export const getDirection = (language: Language): 'ltr' | 'rtl' => {
  return language === 'en' ? 'ltr' : 'rtl';
};