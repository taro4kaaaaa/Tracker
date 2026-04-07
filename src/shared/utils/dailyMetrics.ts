import type { DailyMetrics } from '../types/dailyMetrics';
import type { UserProfile } from '../types/user';
import { formatDateISO } from './dateUtils';

const STORAGE_KEY_PREFIX = 'daily-metrics-';

const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateDailyMetrics = (user: UserProfile): DailyMetrics => {
  const { restHeartRate, activityLevel } = user;
  
  const baseSteps = 5000 + activityLevel * 3000;
  const steps = baseSteps + randomInRange(-2000, 3000);
  
  const heartRateVariation = randomInRange(-8, 12);
  const avgHeartRate = restHeartRate + heartRateVariation;
  
  const baseStress = randomInRange(25, 65);
  const stressLevel = Math.min(100, Math.max(0, baseStress + (activityLevel * 5)));
  
  const recovery = Math.min(100, Math.max(0, 85 - (stressLevel - 40) / 2 + randomInRange(-10, 10)));
  
  return {
    date: formatDateISO(new Date()),
    avgHeartRate,
    steps,
    stress: Math.round(stressLevel),
    recovery: Math.round(recovery),
  };
};

export const getTodayMetrics = (user: UserProfile | null): DailyMetrics | null => {
  if (!user) return null;
  
  const today = formatDateISO(new Date());
  const storageKey = `${STORAGE_KEY_PREFIX}${today}`;
  
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const newMetrics = generateDailyMetrics(user);
  localStorage.setItem(storageKey, JSON.stringify(newMetrics));
  
  return newMetrics;
};

export const refreshTodayMetrics = (user: UserProfile): DailyMetrics => {
  const today = formatDateISO(new Date());
  const storageKey = `${STORAGE_KEY_PREFIX}${today}`;
  
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const existing = JSON.parse(stored) as DailyMetrics;
    if (existing.date === today) {
      return existing;
    }
  }
  
  const newMetrics = generateDailyMetrics(user);
  localStorage.setItem(storageKey, JSON.stringify(newMetrics));
  return newMetrics;
};