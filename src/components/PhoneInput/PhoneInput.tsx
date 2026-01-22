import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const isInternalUpdate = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Формируем полный номер телефона для библиотеки
  const getFullPhoneValue = useCallback((): string => {
    if (phoneCode && phoneNumber) {
      return `${phoneCode}${phoneNumber}`;
    }
    if (phoneCode) {
      return phoneCode;
    }
    return '';
  }, [phoneCode, phoneNumber]);

  // Инициализируем значение с учетом текущих props
  const [value, setValue] = useState<string>(() => {
    if (phoneCode && phoneNumber) {
      return `${phoneCode}${phoneNumber}`;
    }
    if (phoneCode) {
      return phoneCode;
    }
    return '';
  });

  // Получаем input элемент
  const getInputElement = useCallback((): HTMLInputElement | null => {
    return wrapperRef.current?.querySelector('input.PhoneInputInput') as HTMLInputElement | null;
  }, []);

  // Синхронизируем value с phoneCode и phoneNumber только если изменения пришли извне
  useEffect(() => {
    if (!isInternalUpdate.current) {
      const newValue = getFullPhoneValue();
      setValue(newValue);
    }
    isInternalUpdate.current = false;
  }, [getFullPhoneValue]);

  // Обработка изменения номера телефона
  const handleChange = useCallback((phoneValue: string | undefined) => {
    isInternalUpdate.current = true;
    
    // Очистка поля
    if (!phoneValue || phoneValue.trim() === '') {
      setValue(phoneCode || '');
      onPhoneNumberChange('');
      return;
    }

    // Защита от удаления кода страны
    const codeMatch = phoneValue.match(/^(\+\d{1,4})/);
    let workingValue = phoneValue;
    
    if (phoneCode && !codeMatch) {
      // Восстанавливаем код страны, если он был удален
      const digitsOnly = phoneValue.replace(/\D/g, '');
      workingValue = `${phoneCode}${digitsOnly}`;
      setValue(workingValue);
    }

    try {
      // Парсим номер телефона
      const parsedPhone = parsePhoneNumber(workingValue);
      
      if (parsedPhone) {
        const countryCode = parsedPhone.countryCallingCode 
          ? `+${parsedPhone.countryCallingCode}` 
          : phoneCode;
        let nationalNumber = parsedPhone.nationalNumber || '';
        
        // Ограничиваем длину номера
        if (nationalNumber.length > MAX_PHONE_LENGTH) {
          nationalNumber = nationalNumber.substring(0, MAX_PHONE_LENGTH);
        }
        
        onPhoneCodeChange(countryCode);
        onPhoneNumberChange(nationalNumber);
        setValue(`${countryCode}${nationalNumber}`);
      } else {
        // Если не удалось распарсить, извлекаем код вручную
        const extractedCode = codeMatch ? codeMatch[1] : phoneCode || '';
        let restOfNumber = workingValue.substring(extractedCode.length).replace(/\D/g, '');
        
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
    } catch (error) {
      console.warn('Error parsing phone:', error);
      // При ошибке парсинга извлекаем код вручную
      const extractedCode = codeMatch ? codeMatch[1] : phoneCode || '';
      let restOfNumber = workingValue.substring(extractedCode.length).replace(/\D/g, '');
      
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
      if (input) {
        const currentCode = codeMatch ? codeMatch[1] : phoneCode;
        if (currentCode) {
          const codeLength = currentCode.length;
          const currentPosition = input.selectionStart || 0;
          if (currentPosition < codeLength) {
            input.setSelectionRange(codeLength, codeLength);
          }
        }
      }
    }, 0);
  }, [phoneCode, onPhoneCodeChange, onPhoneNumberChange, getInputElement]);

  // Защита от удаления кода страны через клавиатуру
  useEffect(() => {
    const input = getInputElement();
    if (!input || !phoneCode) return;

    const codeLength = phoneCode.length;
    
    const keyDownHandler = (e: KeyboardEvent) => {
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;
      
      // Предотвращаем удаление кода страны
      if (selectionStart < codeLength && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
        input.setSelectionRange(codeLength, codeLength);
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
  }, [phoneCode, getInputElement]);

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
