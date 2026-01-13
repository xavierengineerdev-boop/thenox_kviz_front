import React from 'react';
import { RadioOption } from '../types';
import './RadioButton.css';

interface RadioButtonProps {
  option: RadioOption;
  selected: boolean;
  onChange: (value: string) => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ option, selected, onChange }) => {
  return (
    <label className={`radio-button ${selected ? 'radio-button--selected' : ''}`}>
      <input
        type="radio"
        value={option.value}
        checked={selected}
        onChange={() => onChange(option.value)}
        className="radio-button__input"
      />
      <span className="radio-button__circle">
        {selected && <span className="radio-button__check">✓</span>}
      </span>
      <span className="radio-button__label">{option.label}</span>
    </label>
  );
};
