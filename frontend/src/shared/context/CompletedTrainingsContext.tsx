import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CompletedTraining } from '../types/completedTraining';

interface CompletedTrainingsContextType {
  trainings: CompletedTraining[];
  addTraining: (training: CompletedTraining) => void;
  deleteTraining: (id: string) => void;
  getTraining: (id: string) => CompletedTraining | undefined;
}

const CompletedTrainingsContext = createContext<CompletedTrainingsContextType | undefined>(undefined);

const STORAGE_KEY = 'completed-trainings';

export const CompletedTrainingsProvider = ({ children }: { children: ReactNode }) => {
  const [trainings, setTrainings] = useState<CompletedTraining[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trainings));
  }, [trainings]);

  const addTraining = (training: CompletedTraining) => {
    setTrainings(prev => [training, ...prev]);
  };

  const deleteTraining = (id: string) => {
    setTrainings(prev => prev.filter(t => t.id !== id));
  };

  const getTraining = (id: string) => {
    return trainings.find(t => t.id === id);
  };

  return (
    <CompletedTrainingsContext.Provider 
      value={{ trainings, addTraining, deleteTraining, getTraining }}
    >
      {children}
    </CompletedTrainingsContext.Provider>
  );
};

export const useCompletedTrainings = () => {
  const context = useContext(CompletedTrainingsContext);
  if (!context) {
    throw new Error('useCompletedTrainings must be used within CompletedTrainingsProvider');
  }
  return context;
};
