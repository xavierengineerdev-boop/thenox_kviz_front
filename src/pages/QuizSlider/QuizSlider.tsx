import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { PhoneInput } from '../../components/PhoneInput';
import { ProgressBar } from '../../components/ProgressBar';
import { RadioButton } from '../../components/RadioButton';
import { useQuiz } from '../../context/QuizContext';
import { question1Options, question2Options, question3Options } from '../../data/quizData';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  logEvent,
  logPageView,
  logQuizComplete,
  logQuizStart,
  logQuizStep,
} from '../../utils/analytics';
import './QuizSlider.css';

export const QuizSlider: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData, totalSteps, resetQuiz } = useQuiz();
  const { t } = useLanguage();
  const [errors, setErrors] = useState<string[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    logPageView();
    logQuizStart();
  }, []);

  useEffect(() => {
    if (slideIndex > 0 && slideIndex < 4) {
      logQuizStep(slideIndex, {
        capital: data.capital,
        motivation: data.motivation,
        readiness: data.readiness,
      });
    }
  }, [slideIndex]);

  const handleNext = () => {
    if (slideIndex === 0 && !data.capital) return;
    if (slideIndex === 1 && !data.motivation) return;
    if (slideIndex === 2 && !data.readiness) return;

    if (slideIndex === 3) {
      const newErrors: string[] = [];
      if (!data.name.trim()) newErrors.push(t.quiz.contact.errors.name);
      
      // Мягкая валидация телефона - только проверяем, что номер введен
      if (!data.phone.trim()) {
        newErrors.push(t.quiz.contact.errors.phone);
      } else if (data.phone.trim().length < 5) {
        // Минимальная проверка - хотя бы 5 цифр
        newErrors.push(t.quiz.contact.errors.phone || 'Некорректный номер телефона');
      }
      
      if (!data.email.trim() || !data.email.includes('@'))
        newErrors.push(t.quiz.contact.errors.email);

      if (newErrors.length > 0) {
        setErrors(newErrors);
        logEvent('quiz_validation_error', { errors: newErrors });
        return;
      }
      setErrors([]);

      // Форматируем телефон: убираем пробелы и лишние символы
      const fullPhone = `${data.phoneCode}${data.phone}`.replace(/\s/g, '');
      const formattedPhone = fullPhone.replace(/[^\d+]/g, '');
      
      console.log('Form data before sending:', {
        name: data.name,
        phone: formattedPhone,
        phoneCode: data.phoneCode,
        phoneNumber: data.phone,
        email: data.email,
        capital: data.capital,
        motivation: data.motivation,
        readiness: data.readiness,
      });
      
      // Отправляем данные асинхронно, но не блокируем UI
      logQuizComplete({
        name: data.name,
        phone: formattedPhone,
        email: data.email,
        capital: data.capital,
        motivation: data.motivation,
        readiness: data.readiness,
      }).catch((error) => {
        console.error('Error in logQuizComplete:', error);
      });

      setSlideIndex(4);

      setTimeout(() => {
        resetQuiz();
      }, 500);

      return;
    }

    if (slideIndex < 4) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const handleBack = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  return (
    <div className="page quiz-slider">
      <LanguageSwitcher />
      <BackButton onClick={handleBack} />
      <ProgressBar current={Math.min(slideIndex + 1, totalSteps)} total={totalSteps} />

      <div className="quiz-slider__container">
        <div
          className="quiz-slider__track"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          <div className="quiz-slider__slide">
            <div className="quiz-page__content">
              <h1 className="quiz-page__title">{t.quiz.capital.title}</h1>

              <div className="quiz-page__options">
                {question3Options.map((option) => (
                  <RadioButton
                    key={option.value}
                    option={option}
                    selected={data.capital === option.value}
                    onChange={(value) => updateData('capital', value)}
                  />
                ))}
              </div>

              <Button onClick={handleNext} disabled={!data.capital}>
                {t.quiz.next}
              </Button>
            </div>
          </div>

          <div className="quiz-slider__slide">
            <div className="quiz-page__content">
              <h1 className="quiz-page__title">{t.quiz.motivation.title}</h1>

              <div className="quiz-page__options">
                {question2Options.map((option) => (
                  <RadioButton
                    key={option.value}
                    option={option}
                    selected={data.motivation === option.value}
                    onChange={(value) => updateData('motivation', value)}
                  />
                ))}
              </div>

              <Button onClick={handleNext} disabled={!data.motivation}>
                {t.quiz.next}
              </Button>
            </div>
          </div>

          <div className="quiz-slider__slide">
            <div className="quiz-page__content">
              <h1 className="quiz-page__title">{t.quiz.readiness.title}</h1>

              <div className="quiz-page__options">
                {question1Options.map((option) => (
                  <RadioButton
                    key={option.value}
                    option={option}
                    selected={data.readiness === option.value}
                    onChange={(value) => updateData('readiness', value)}
                  />
                ))}
              </div>

              <Button onClick={handleNext} disabled={!data.readiness}>
                {t.quiz.next}
              </Button>
            </div>
          </div>

          <div className="quiz-slider__slide">
            <div className="quiz-page__content">
              <h1 className="quiz-page__title">{t.quiz.contact.title}</h1>

              <form className="quiz-page__form" onSubmit={handleSubmit}>
                <Input
                  placeholder={t.quiz.contact.namePlaceholder}
                  value={data.name}
                  onChange={(value) => updateData('name', value)}
                  required
                />

                <PhoneInput
                  phoneCode={data.phoneCode}
                  phoneNumber={data.phone}
                  onPhoneCodeChange={(value) => updateData('phoneCode', value)}
                  onPhoneNumberChange={(value) => updateData('phone', value)}
                />

                <Input
                  type="email"
                  placeholder={t.quiz.contact.emailPlaceholder}
                  value={data.email}
                  onChange={(value) => updateData('email', value)}
                  required
                />

                {errors.length > 0 && (
                  <div className="quiz-page__errors">
                    {errors.map((error, index) => (
                      <p key={index} className="quiz-page__error">
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <Button type="submit">{t.quiz.submit}</Button>
              </form>
            </div>
          </div>

          <div className="quiz-slider__slide">
            <div className="quiz-page__content quiz-page__final">
              <div className="quiz-page__final-icon">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="58" stroke="#b4ff00" strokeWidth="4" />
                  <path
                    d="M35 60L50 75L85 40"
                    stroke="#b4ff00"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="quiz-page__title quiz-page__final-title">{t.quiz.final.title}</h1>

              <p className="quiz-page__final-subtitle">{t.quiz.final.subtitle}</p>

              <p className="quiz-page__final-description">{t.quiz.final.description}</p>

              <Button onClick={() => navigate('/')}>{t.quiz.final.homeButton}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
