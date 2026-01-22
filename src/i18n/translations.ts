export const translations = {
  ru: {
    home: {
      title: 'КАК СДЕЛАТЬ',
      highlight1: '$800 ЗА',
      highlight2: '11 ДНЕЙ?',
      subtitle: 'Пройдти опрос и получи\nперсональную стратегию',
      startButton: 'Начать',
    },
    quiz: {
      back: 'Назад',
      next: 'Далее',
      submit: 'Отправить',
      capital: {
        title: 'Какой у вас капитал для начала работы в арбитраже?',
        options: {
          upTo200: 'До $200',
          from300to1000: 'От 300 до $1000',
          over1000: 'От $1000 и больше',
        },
      },
      motivation: {
        title: 'Что вас мотивирует зарабатывать на арбитраже?',
        options: {
          extraIncome: 'Хочу дополнительный доход',
          changeJob: 'Хочу сменить основную работу',
          crypto: 'Хочу увеличить капитал и войти в крипторынок',
          scale: 'Уже зарабатываю, хочу масштабировать',
        },
      },
      readiness: {
        title: 'Насколько быстро вы готовы начать после консультации?',
        options: {
          readyNow: 'Готов(а) сразу после общения',
          readyWeek: 'Готов стартовать на неделе',
          needDetails: 'Сначала хочу разобраться подробнее',
          notSure: 'Не уверен(а), просто интересно',
        },
      },
      contact: {
        title: 'Оставьте контакт, и наш специалист свяжется с вами!',
        namePlaceholder: 'Имя*',
        phonePlaceholder: '(000) 000 - 0000*',
        emailPlaceholder: 'Почта',
        errors: {
          name: 'Введите имя',
          phone: 'Введите корректный номер телефона',
          email: 'Введите корректный email',
        },
      },
      final: {
        title: 'Спасибо за вашу заявку!',
        subtitle: 'Наш специалист свяжется с вами в ближайшее время',
        description:
          'Мы получили ваши данные и скоро начнем работу над вашей персональной стратегией',
        homeButton: 'На главную',
      },
    },
  },
  en: {
    home: {
      title: 'HOW TO MAKE',
      highlight1: '$800 IN',
      highlight2: '11 DAYS?',
      subtitle: 'Take the quiz and get\na personalized strategy',
      startButton: 'Start',
    },
    quiz: {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      capital: {
        title: 'What capital do you have to start working in arbitrage?',
        options: {
          upTo200: 'Up to $200',
          from300to1000: 'From $300 to $1000',
          over1000: 'From $1000 and more',
        },
      },
      motivation: {
        title: 'What motivates you to earn money on arbitrage?',
        options: {
          extraIncome: 'I want additional income',
          changeJob: 'I want to change my main job',
          crypto: 'I want to increase capital and enter the crypto market',
          scale: 'Already earning, want to scale',
        },
      },
      readiness: {
        title: 'How soon are you ready to start after the consultation?',
        options: {
          readyNow: 'Ready right after the consultation',
          readyWeek: 'Ready to start within a week',
          needDetails: 'Want to learn more first',
          notSure: 'Not sure, just curious',
        },
      },
      contact: {
        title: 'Leave your contact and our specialist will contact you!',
        namePlaceholder: 'Name*',
        phonePlaceholder: '(000) 000 - 0000*',
        emailPlaceholder: 'Email',
        errors: {
          name: 'Enter your name',
          phone: 'Enter a valid phone number',
          email: 'Enter a valid email',
        },
      },
      final: {
        title: 'Thank you for your application!',
        subtitle: 'Our specialist will contact you soon',
        description:
          'We have received your information and will start working on your personalized strategy soon',
        homeButton: 'Home',
      },
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.ru;
