import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { HomePage } from './pages/HomePage';
import { QuizSlider } from './pages/QuizSlider';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <QuizProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizSlider />} />
          </Routes>
        </QuizProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
