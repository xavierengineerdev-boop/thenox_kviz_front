import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { Logo } from '../../components/Logo';
import { useLanguage } from '../../i18n/LanguageContext';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="page home-page">
      <LanguageSwitcher />

      <div className="home-page__logo">
        <Logo />
      </div>

      <div className="home-page__content">
        <h1 className="home-page__title">
          {t.home.title} <br />
          <span className="home-page__highlight">{t.home.highlight1}</span>
          <br />
          <span className="home-page__highlight">{t.home.highlight2}</span>
        </h1>

        <p className="home-page__subtitle">
          {t.home.subtitle.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>

        <div className="home-page__arrow">
          <img src="/arrow.png" alt="arrow" className="home-page__arrow-img" />
        </div>

        <div className="home-page__button">
          <Button onClick={() => navigate('/quiz')}>{t.home.startButton}</Button>
          <div className="home-page__scroll-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" fill="white" />
              <path
                d="M16 11v10m0 0l-4-4m4 4l4-4"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
