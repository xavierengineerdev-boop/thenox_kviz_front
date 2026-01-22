import React, { createContext, ReactNode, useContext, useState } from 'react';
import { QuizContextType, QuizData } from '../types';

const initialData: QuizData = {
  name: '',
  phone: '',
  phoneCode: '',
  email: '',
  readiness: '',
  motivation: '',
  capital: '',
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<QuizData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const updateData = (field: keyof QuizData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetQuiz = () => {
    setData(initialData);
    setCurrentStep(0);
  };

  return (
    <QuizContext.Provider
      value={{
        data,
        currentStep,
        totalSteps,
        updateData,
        nextStep,
        prevStep,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
