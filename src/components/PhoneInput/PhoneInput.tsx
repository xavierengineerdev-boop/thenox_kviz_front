import React, { useEffect, useState } from 'react';
import PhoneInputWithCountry, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneInput.css';

interface PhoneInputProps {
  phoneCode: string;
  phoneNumber: string;
  onPhoneCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  phoneCode,
  phoneNumber,
  onPhoneCodeChange,
  onPhoneNumberChange,
}) => {
  const [value, setValue] = useState<string>(
    phoneCode && phoneNumber ? `${phoneCode}${phoneNumber}` : ''
  );

  useEffect(() => {
    if (phoneCode && phoneNumber) {
      setValue(`${phoneCode}${phoneNumber}`);
    } else if (!phoneCode && !phoneNumber) {
      setValue('');
    }
  }, [phoneCode, phoneNumber]);

  const handleChange = (phoneValue: string | undefined) => {
    if (phoneValue) {
      setValue(phoneValue);
      try {
        const parsedPhone = parsePhoneNumber(phoneValue);
        if (parsedPhone && parsedPhone.isValid()) {
          const countryCode = parsedPhone.countryCallingCode ? `+${parsedPhone.countryCallingCode}` : '';
          const nationalNumber = parsedPhone.nationalNumber || '';
          onPhoneCodeChange(countryCode);
          onPhoneNumberChange(nationalNumber);
          console.log('Phone parsed:', { countryCode, nationalNumber, full: phoneValue });
        } else {
          // Если не удалось распарсить, пытаемся извлечь вручную
          const match = phoneValue.match(/^(\+\d{1,4})(.*)$/);
          if (match) {
            onPhoneCodeChange(match[1]);
            onPhoneNumberChange(match[2].replace(/\s/g, '').replace(/[^\d]/g, ''));
            console.log('Phone extracted manually:', { code: match[1], number: match[2] });
          }
        }
      } catch (error) {
        console.warn('Error parsing phone:', error);
        // Если ошибка парсинга, извлекаем вручную
        const match = phoneValue.match(/^(\+\d{1,4})(.*)$/);
        if (match) {
          onPhoneCodeChange(match[1]);
          onPhoneNumberChange(match[2].replace(/\s/g, '').replace(/[^\d]/g, ''));
        }
      }
    } else {
      setValue('');
      onPhoneCodeChange('+41');
      onPhoneNumberChange('');
    }
  };

  return (
    <div className="phone-input">
      <PhoneInputWithCountry
        international
        defaultCountry="CH"
        value={value}
        onChange={handleChange}
        className="phone-input__react-phone"
        placeholder="(000) 000 - 0000*"
      />
    </div>
  );
};
