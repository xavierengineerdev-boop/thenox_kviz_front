export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

export const countries: Country[] = [
  { code: 'RU', name: 'Россия', flag: '🇷🇺', phoneCode: '+7' },
  { code: 'UA', name: 'Украина', flag: '🇺🇦', phoneCode: '+380' },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿', phoneCode: '+7' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾', phoneCode: '+375' },
  { code: 'UZ', name: 'Узбекистан', flag: '🇺🇿', phoneCode: '+998' },
  { code: 'AZ', name: 'Азербайджан', flag: '🇦🇿', phoneCode: '+994' },
  { code: 'AM', name: 'Армения', flag: '🇦🇲', phoneCode: '+374' },
  { code: 'GE', name: 'Грузия', flag: '🇬🇪', phoneCode: '+995' },
  { code: 'KG', name: 'Киргизия', flag: '🇰🇬', phoneCode: '+996' },
  { code: 'TJ', name: 'Таджикистан', flag: '🇹🇯', phoneCode: '+992' },
  { code: 'TM', name: 'Туркменистан', flag: '🇹🇲', phoneCode: '+993' },
  { code: 'MD', name: 'Молдова', flag: '🇲🇩', phoneCode: '+373' },
  { code: 'US', name: 'США', flag: '🇺🇸', phoneCode: '+1' },
  { code: 'GB', name: 'Великобритания', flag: '🇬🇧', phoneCode: '+44' },
  { code: 'DE', name: 'Германия', flag: '🇩🇪', phoneCode: '+49' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷', phoneCode: '+33' },
  { code: 'IT', name: 'Италия', flag: '🇮🇹', phoneCode: '+39' },
  { code: 'ES', name: 'Испания', flag: '🇪🇸', phoneCode: '+34' },
  { code: 'PL', name: 'Польша', flag: '🇵🇱', phoneCode: '+48' },
  { code: 'TR', name: 'Турция', flag: '🇹🇷', phoneCode: '+90' },
];
