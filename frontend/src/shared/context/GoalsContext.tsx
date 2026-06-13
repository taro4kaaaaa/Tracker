import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { Goal, Competition } from "../types/goals";
import { goalsApi } from "../api/goalsApi";

interface GoalsContextType {
  goals: Goal[];
  competitions: Competition[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, data: { title: string; description: string }) => void;
  deleteGoal: (id: string) => void;
  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, data: { title: string; description: string }) => void;
  deleteCompetition: (id: string) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  // 🔥 загрузка с backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [goalsData, competitionsData] = await Promise.all([
          goalsApi.getAll(),
          goalsApi.getCompetitions(),
        ]);

        setGoals(goalsData);
        setCompetitions(competitionsData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
      console.log("loading from API...");
    };

    loadData();
  }, []);

  // 🟢 локальные изменения (пока без backend POST/PUT/DELETE)
  const addGoal = (goal: Goal) => {
    setGoals((prev) => [goal, ...prev]);
  };

  const updateGoal = (id: string, data: { title: string; description: string }) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...data } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addCompetition = (competition: Competition) => {
    setCompetitions((prev) => [competition, ...prev]);
  };

  const updateCompetition = (id: string, data: { title: string; description: string }) => {
    setCompetitions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteCompetition = (id: string) => {
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        competitions,
        addGoal,
        updateGoal,
        deleteGoal,
        addCompetition,
        updateCompetition,
        deleteCompetition,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error("useGoals must be used within GoalsProvider");
  }
  return context;
};

console.log("GoalsProvider mounted");