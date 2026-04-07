import { Routes, Route } from 'react-router-dom';
import { TrainingProvider } from './shared/context/TrainingContext';
import { CompletedTrainingsProvider } from './shared/context/CompletedTrainingsContext';
import { GoalsProvider } from './shared/context/GoalsContext';
import { UserProvider } from './shared/context/UserContext';
import Layout from './widgets/Layout/Layout';
import Home from './features/home/HomePage/Home';
import Calendar from './features/calendar/CalendarPage/Calendar';
import Statistics from './features/statistics/StatisticsPage/Statistics';
import Training from './features/training/TrainingPage/Training';
import Onboarding from './features/onboarding/Onboarding';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="training" element={<Training />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <CompletedTrainingsProvider>
        <TrainingProvider>
          <GoalsProvider>
            <AppContent />
          </GoalsProvider>
        </TrainingProvider>
      </CompletedTrainingsProvider>
    </UserProvider>
  );
}

export default App;