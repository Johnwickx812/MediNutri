/**
 * Language Context for MediNutri i18n Support
 * 
 * This context provides:
 * - Current language state
 * - Language switching function
 * - Translation function (t) for accessing translated strings
 * 
 * i18n Logic:
 * - Language preference is stored in localStorage for persistence across sessions
 * - When language changes, the entire UI updates instantly via React context
 * - No page reload required for language switch
 * - Falls back to English if a translation key is missing
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  SupportedLanguage, 
  translations, 
  languageNames 
} from "@/i18n/translations";

// Use a generic type for translations to avoid literal type conflicts
type TranslationObject = typeof translations.en;

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationObject;
  languageNames: typeof languageNames;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "medinutri_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage or default to English
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && (saved === "en" || saved === "ml" || saved === "ta" || saved === "hi")) {
      return saved;
    }
    return "en";
  });

  // Persist language preference to localStorage
  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  // Language setter that updates state
  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
  }, []);

  // Get translations for current language
  // Falls back to English if translation not found
  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languageNames,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to access language context
 * 
 * Usage:
 * const { t, language, setLanguage } = useLanguage();
 * 
 * Then use t.section.key to access translations:
 * t.nav.home -> "Home" (in English)
 * t.nav.home -> "ഹോം" (in Malayalam)
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
