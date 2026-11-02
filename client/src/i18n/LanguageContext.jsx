// Arabic / English switch.  Use in any component:
//   const { t, lang, toggleLang } = useLang();
//   <h1>{t('hero.title')}</h1>
import { createContext, useContext, useEffect, useState } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('tuana_lang') || 'ar');

  useEffect(() => {
    localStorage.setItem('tuana_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => translations[lang][key] ?? key;
  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
