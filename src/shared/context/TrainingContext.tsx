import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DayTraining } from '../types/training';

interface TrainingContextType {
  trainings: Map<string, DayTraining>;
  addTraining: (training: DayTraining) => void;
  updateTraining: (date: string, training: DayTraining) => void;
  deleteTraining: (date: string) => void;
  getTraining: (date: string) => DayTraining | undefined;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

const STORAGE_KEY = 'calendar-trainings';

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [trainings, setTrainings] = useState<Map<string, DayTraining>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
    return new Map();
  });

  useEffect(() => {
    const obj = Object.fromEntries(trainings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }, [trainings]);

  const addTraining = (training: DayTraining) => {
    setTrainings(prev => {
      const next = new Map(prev);
      next.set(training.date, training);
      return next;
    });
  };

  const updateTraining = (date: string, training: DayTraining) => {
    setTrainings(prev => {
      const next = new Map(prev);
      next.set(date, training);
      return next;
    });
  };

  const deleteTraining = (date: string) => {
    setTrainings(prev => {
      const next = new Map(prev);
      next.delete(date);
      return next;
    });
  };

  const getTraining = (date: string) => {
    return trainings.get(date);
  };

  return (
    <TrainingContext.Provider 
      value={{ trainings, addTraining, updateTraining, deleteTraining, getTraining }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export const useTrainings = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTrainings must be used within TrainingProvider');
  }
  return context;
};
