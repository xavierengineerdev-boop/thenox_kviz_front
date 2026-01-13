import React from 'react';
import './Logo.css';

export const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img src="/logo.png" alt="THE NOX" className="logo__image" />
    </div>
  );
};
