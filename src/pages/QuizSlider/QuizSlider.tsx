import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parsePhoneNumber } from 'react-phone-number-input';
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
  const [phoneError, setPhoneError] = useState<string>('');

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

  // Валидация телефона в реальном времени
  useEffect(() => {
    // Валидируем только на слайде с контактами
    if (slideIndex !== 3) {
      setPhoneError('');
      return;
    }

    const phoneTrimmed = data.phone.trim();
    const hasCode = !!data.phoneCode;
    const hasNumber = !!phoneTrimmed;

    // Если нет ни кода, ни номера - не показываем ошибку (пользователь еще вводит)
    if (!hasCode && !hasNumber) {
      setPhoneError('');
      return;
    }

    // Если есть код, но нет номера - не показываем ошибку пока пользователь вводит
    if (hasCode && !hasNumber) {
      setPhoneError('');
      return;
    }

    // Если есть номер, но нет кода страны - показываем ошибку
    if (hasNumber && !hasCode) {
      setPhoneError(t.quiz.contact.errors.phone || 'Некорректный номер телефона');
      return;
    }

    // Если есть и код, и номер - валидируем полный номер
    if (hasCode && hasNumber) {
      try {
        const fullPhone = `${data.phoneCode}${phoneTrimmed}`.replace(/\s/g, '').replace(/[^\d+]/g, '');
        const parsedPhone = parsePhoneNumber(fullPhone);
        
        if (parsedPhone && parsedPhone.isValid()) {
          setPhoneError('');
        } else {
          setPhoneError(t.quiz.contact.errors.phone || 'Некорректный номер телефона');
        }
      } catch (error) {
        setPhoneError(t.quiz.contact.errors.phone || 'Некорректный номер телефона');
      }
    }
  }, [data.phone, data.phoneCode, slideIndex, t]);

  const handleNext = () => {
    if (slideIndex === 0 && !data.capital) return;
    if (slideIndex === 1 && !data.motivation) return;
    if (slideIndex === 2 && !data.readiness) return;

    if (slideIndex === 3) {
      const newErrors: string[] = [];
      
      // Валидация имени
      if (!data.name.trim()) {
        newErrors.push(t.quiz.contact.errors.name);
      }
      
      // Валидация телефона
      const phoneTrimmed = data.phone.trim();
      if (!data.phoneCode || !phoneTrimmed) {
        newErrors.push(t.quiz.contact.errors.phone);
      } else {
        try {
          const fullPhone = `${data.phoneCode}${phoneTrimmed}`.replace(/\s/g, '').replace(/[^\d+]/g, '');
          const parsedPhone = parsePhoneNumber(fullPhone);
          
          if (!parsedPhone || !parsedPhone.isValid()) {
            newErrors.push(t.quiz.contact.errors.phone || 'Некорректный номер телефона');
          }
        } catch (error) {
          newErrors.push(t.quiz.contact.errors.phone || 'Некорректный номер телефона');
        }
      }

      // Добавляем ошибку из валидации в реальном времени, если она есть
      if (phoneError && !newErrors.includes(phoneError)) {
        newErrors.push(phoneError);
      }
      
      // Валидация email
      const emailTrimmed = data.email.trim();
      if (!emailTrimmed || !emailTrimmed.includes('@')) {
        newErrors.push(t.quiz.contact.errors.email);
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        logEvent('quiz_validation_error', { errors: newErrors });
        return;
      }
      setErrors([]);
      setPhoneError('');

      // Форматируем телефон для отправки в формате E.164
      let formattedPhone = '';
      try {
        const fullPhone = `${data.phoneCode}${data.phone.trim()}`.replace(/\s/g, '').replace(/[^\d+]/g, '');
        const parsedPhone = parsePhoneNumber(fullPhone);
        
        if (parsedPhone && parsedPhone.isValid()) {
          formattedPhone = parsedPhone.format('E.164');
        } else {
          formattedPhone = fullPhone;
        }
      } catch (error) {
        formattedPhone = `${data.phoneCode}${data.phone.trim()}`.replace(/\s/g, '').replace(/[^\d+]/g, '');
      }
      
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
                  error={phoneError}
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
