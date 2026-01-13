import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './LanguageSwitcher.css';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`language-switcher__button ${
          language === 'ru' ? 'language-switcher__button--active' : ''
        }`}
        onClick={() => setLanguage('ru')}
      >
        RU
      </button>
      <button
        className={`language-switcher__button ${
          language === 'en' ? 'language-switcher__button--active' : ''
        }`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};
