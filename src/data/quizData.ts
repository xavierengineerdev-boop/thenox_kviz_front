import { RadioOption } from '../types';

export const question1Options: RadioOption[] = [
  { value: 'ready-now', label: 'Готов(а) сразу после общения' },
  { value: 'ready-week', label: 'Готов стартовать на неделе' },
  { value: 'need-details', label: 'Сначала хочу разобраться подробнее' },
  { value: 'not-sure', label: 'Не уверен(а), просто интересно' },
];

export const question2Options: RadioOption[] = [
  { value: 'extra-income', label: 'Хочу дополнительный доход' },
  { value: 'change-job', label: 'Хочу сменить основную работу' },
  { value: 'crypto', label: 'Хочу увеличить капитал и войти в крипторынок' },
  { value: 'scale', label: 'Уже зарабатываю, хочу масштабировать' },
];

export const question3Options: RadioOption[] = [
  { value: 'up-to-200', label: 'До $200' },
  { value: '300-1000', label: 'От 300 до $1000' },
  { value: 'over-1000', label: 'От $1000 и больше' },
];

export const quizQuestions = {
  capital: {
    title: 'Какой у вас капитал для начала работы в арбитраже?',
    options: question3Options,
  },
  motivation: {
    title: 'Что вас мотивирует зарабатывать на арбитраже?',
    options: question2Options,
  },
  readiness: {
    title: 'Насколько быстро вы готовы начать после консультации?',
    options: question1Options,
  },
  contact: {
    title: 'Оставьте контакт, и наш специалист свяжется с вами!',
  },
};
