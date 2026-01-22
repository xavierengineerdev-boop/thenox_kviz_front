import React, { useEffect, useState, useRef } from 'react';
import PhoneInputWithCountry, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneInput.css';

interface PhoneInputProps {
  phoneCode: string;
  phoneNumber: string;
  onPhoneCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  error?: string;
}

// Максимальная длина национального номера (без кода страны)
const MAX_PHONE_LENGTH = 15;

export const PhoneInput: React.FC<PhoneInputProps> = ({
  phoneCode,
  phoneNumber,
  onPhoneCodeChange,
  onPhoneNumberChange,
  error,
}) => {
  // Используем полный номер телефона для библиотеки (она сама форматирует)
  const getFullPhoneValue = (): string => {
    if (phoneCode && phoneNumber) {
      return `${phoneCode}${phoneNumber}`;
    }
    if (phoneCode) {
      return phoneCode;
    }
    return '';
  };

  const [value, setValue] = useState<string>(getFullPhoneValue());
  const isInternalUpdate = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Функция для получения input элемента
  const getInputElement = (): HTMLInputElement | null => {
    if (wrapperRef.current) {
      return wrapperRef.current.querySelector('input.PhoneInputInput') as HTMLInputElement | null;
    }
    return null;
  };

  // Синхронизируем value с phoneCode и phoneNumber только если изменения пришли извне
  useEffect(() => {
    if (!isInternalUpdate.current) {
      const newValue = getFullPhoneValue();
      setValue(newValue);
    }
    isInternalUpdate.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneCode, phoneNumber]);

  const handleChange = (phoneValue: string | undefined) => {
    isInternalUpdate.current = true;
    
    if (!phoneValue || phoneValue.trim() === '') {
      // При полной очистке сохраняем код страны, очищаем только номер
      setValue(phoneCode || '');
      onPhoneNumberChange('');
      return;
    }

    // Защита от удаления кода страны - если код был удален, восстанавливаем его
    const codeMatch = phoneValue.match(/^(\+\d{1,4})/);
    if (phoneCode && !codeMatch) {
      // Если код страны был удален, восстанавливаем его
      const restoredValue = `${phoneCode}${phoneValue.replace(/\D/g, '')}`;
      setValue(restoredValue);
      phoneValue = restoredValue;
    }

    try {
      // Пытаемся распарсить номер
      const parsedPhone = parsePhoneNumber(phoneValue);
      
      if (parsedPhone) {
        // Если номер распарсился, извлекаем код страны и национальный номер
        const countryCode = parsedPhone.countryCallingCode ? `+${parsedPhone.countryCallingCode}` : phoneCode;
        let nationalNumber = parsedPhone.nationalNumber || '';
        
        // Ограничиваем длину номера
        if (nationalNumber.length > MAX_PHONE_LENGTH) {
          nationalNumber = nationalNumber.substring(0, MAX_PHONE_LENGTH);
        }
        
        onPhoneCodeChange(countryCode);
        onPhoneNumberChange(nationalNumber);
        setValue(`${countryCode}${nationalNumber}`);
      } else {
        // Если не удалось распарсить, пытаемся извлечь код вручную
        const extractedCode = codeMatch ? codeMatch[1] : phoneCode;
        let restOfNumber = phoneValue.substring(extractedCode.length).replace(/\D/g, '');
        
        // Ограничиваем длину номера
        if (restOfNumber.length > MAX_PHONE_LENGTH) {
          restOfNumber = restOfNumber.substring(0, MAX_PHONE_LENGTH);
        }
        
        onPhoneCodeChange(extractedCode);
        onPhoneNumberChange(restOfNumber);
        setValue(`${extractedCode}${restOfNumber}`);
      }
    } catch (error) {
      console.warn('Error parsing phone:', error);
      // При ошибке парсинга пытаемся извлечь вручную
      const extractedCode = codeMatch ? codeMatch[1] : phoneCode;
      let restOfNumber = phoneValue.substring(extractedCode ? extractedCode.length : 0).replace(/\D/g, '');
      
      // Ограничиваем длину номера
      if (restOfNumber.length > MAX_PHONE_LENGTH) {
        restOfNumber = restOfNumber.substring(0, MAX_PHONE_LENGTH);
      }
      
      if (extractedCode) {
        onPhoneCodeChange(extractedCode);
        onPhoneNumberChange(restOfNumber);
        setValue(`${extractedCode}${restOfNumber}`);
      }
    }

    // Устанавливаем курсор после кода страны
    setTimeout(() => {
      const input = getInputElement();
      if (input && phoneCode) {
        const codeLength = phoneCode.length;
        input.setSelectionRange(codeLength, codeLength);
      }
    }, 0);
  };

  // Добавляем обработчики событий через useEffect
  useEffect(() => {
    const input = wrapperRef.current?.querySelector('input.PhoneInputInput') as HTMLInputElement | null;
    if (input && phoneCode) {
      const codeLength = phoneCode.length;
      
      const keyDownHandler = (e: KeyboardEvent) => {
        const selectionStart = input.selectionStart || 0;
        
        // Если курсор находится в области кода страны и нажата Backspace или Delete
        if (selectionStart < codeLength) {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            input.setSelectionRange(codeLength, codeLength);
          }
        }
        
        // Если пытаются выделить и удалить код страны
        const selectionEnd = input.selectionEnd || 0;
        if (selectionStart < codeLength && selectionEnd <= codeLength) {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            input.setSelectionRange(codeLength, codeLength);
          }
        }
      };

      const focusHandler = () => {
        setTimeout(() => {
          const currentPosition = input.selectionStart || 0;
          if (currentPosition < codeLength) {
            input.setSelectionRange(codeLength, codeLength);
          }
        }, 0);
      };

      input.addEventListener('keydown', keyDownHandler);
      input.addEventListener('focus', focusHandler);

      return () => {
        input.removeEventListener('keydown', keyDownHandler);
        input.removeEventListener('focus', focusHandler);
      };
    }
  }, [phoneCode, value]);

  return (
    <div className="phone-input">
      <div 
        ref={wrapperRef}
        className={`phone-input__wrapper ${error ? 'phone-input__wrapper--error' : ''}`}
      >
        <PhoneInputWithCountry
          international
          value={value}
          onChange={handleChange}
          className={`phone-input__react-phone ${error ? 'phone-input__react-phone--error' : ''}`}
          placeholder="+1 (000) 000-0000"
          smartCaret={true}
          numberInputProps={{
            maxLength: phoneCode ? phoneCode.length + MAX_PHONE_LENGTH : undefined,
          }}
        />
      </div>
      {error && <span className="phone-input__error">{error}</span>}
    </div>
  );
};
