'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';
import { type Locale } from '@/i18n/routing';

interface Language {
  code: Locale;
  label: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

/**
 * LanguageSelector - Dropdown para trocar o idioma da aplicação
 * 
 * Exibe o idioma atual com bandeira e permite selecionar entre
 * os idiomas disponíveis (EN, PT, ES).
 */
export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];

  const handleLanguageChange = useCallback((newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  }, [router, pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        type="button"
        className="language-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${currentLanguage.label}`}
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
        <span className={`language-chevron ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <ul 
          className="language-selector-dropdown"
          role="listbox"
          aria-label="Select language"
        >
          {LANGUAGES.map((language) => (
            <li key={language.code}>
              <button
                type="button"
                className={`language-option ${locale === language.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(language.code)}
                role="option"
                aria-selected={locale === language.code}
              >
                <span className="language-flag">{language.flag}</span>
                <span className="language-label">{language.label}</span>
                {locale === language.code && (
                  <span className="language-check">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
