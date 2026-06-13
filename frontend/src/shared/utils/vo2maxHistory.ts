import type { VO2maxRecord } from '../types/statistics';
import { calculateVO2max } from './calculations';
import type { UserProfile } from '../types/user';
import { formatDateISO, formatDateShortWithYear, getWeekStartDate } from './dateUtils';

const VO2MAX_STORAGE_KEY = 'vo2max-history';

export const getVO2maxHistory = (): VO2maxRecord[] => {
  const stored = localStorage.getItem(VO2MAX_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const saveVO2maxRecord = (user: UserProfile): void => {
  const vo2max = calculateVO2max(user);
  if (vo2max === null) return;

  const dateStr = formatDateISO(new Date());

  const history = getVO2maxHistory();
  
  const lastRecord = history[0];
  if (lastRecord && lastRecord.date === dateStr) {
    return;
  }

  const newRecord: VO2maxRecord = {
    date: dateStr,
    value: vo2max,
  };

  const updatedHistory = [newRecord, ...history].slice(0, 56);
  localStorage.setItem(VO2MAX_STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getVO2maxLastWeeks = (weeks: number): { weekLabel: string; value: number }[] => {
  const history = getVO2maxHistory();
  
  const now = new Date();
  const result: { weekLabel: string; value: number }[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = getWeekStartDate(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const weekRecords = history.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= weekStart && recordDate < weekEnd;
    });

    const avgValue = weekRecords.length > 0
      ? Math.round(weekRecords.reduce((sum, r) => sum + r.value, 0) / weekRecords.length)
      : null;

    const weekLabel = formatDateShortWithYear(weekStart);
    
    result.push({ weekLabel, value: avgValue ?? 0 });
  }

  return result;
};