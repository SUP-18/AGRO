import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('agropredict-lang');
    return saved && translations[saved] ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('agropredict-lang', language);
    
    // Support right-to-left languages if any are added in the future
    const meta = translations[language]?._meta;
    if (meta) {
      document.documentElement.dir = meta.dir || 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const changeLanguage = (code) => {
    if (translations[code]) {
      setLanguage(code);
    }
  };

  // Nested translation retriever: t('common.appName') -> 'AgroPredict'
  const t = (path, defaultValue = null) => {
    const keys = path.split('.');
    let current = translations[language];
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English translation if key is missing in active language
        let englishFallback = translations['en'];
        for (const fallbackKey of keys) {
          if (englishFallback && englishFallback[fallbackKey] !== undefined) {
            englishFallback = englishFallback[fallbackKey];
          } else {
            englishFallback = null;
            break;
          }
        }
        return englishFallback !== null ? englishFallback : (defaultValue !== null ? defaultValue : path);
      }
    }
    
    return current;
  };

  // Compile list of available languages from metadata
  const languages = Object.keys(translations).map((code) => ({
    code,
    name: translations[code]._meta.name,
    nativeName: translations[code]._meta.nativeName,
    flag: translations[code]._meta.flag,
    dir: translations[code]._meta.dir || 'ltr',
  }));

  const currentLanguageMeta = translations[language]?._meta || translations['en']._meta;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languages, currentLanguageMeta }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
