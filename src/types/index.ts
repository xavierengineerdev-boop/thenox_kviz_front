export interface QuizData {
  name: string;
  phone: string;
  phoneCode: string;
  email: string;
  readiness: string;
  motivation: string;
  capital: string;
}

export interface QuizContextType {
  data: QuizData;
  currentStep: number;
  totalSteps: number;
  updateData: (field: keyof QuizData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetQuiz: () => void;
}

export interface RadioOption {
  value: string;
  label: string;
}
