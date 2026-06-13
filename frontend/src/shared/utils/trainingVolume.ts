import type { CompletedTraining } from '../types/completedTraining';
import { formatDateShortWithYear, getWeekStartDate } from './dateUtils';

export interface WeekVolume {
  weekLabel: string;
  totalKm: number;
}

export const getTrainingVolumeByWeeks = (trainings: CompletedTraining[], weeks: number): WeekVolume[] => {
  const now = new Date();
  
  if (trainings.length === 0) {
    return Array.from({ length: weeks }, (_, i) => {
      const weekStart = getWeekStartDate(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
      return { weekLabel: formatDateShortWithYear(weekStart), totalKm: 0 };
    });
  }

  const result: WeekVolume[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = getWeekStartDate(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const weekTrainings = trainings.filter(t => {
      const trainingDate = new Date(t.date);
      return trainingDate >= weekStart && trainingDate < weekEnd;
    });

    const totalKm = weekTrainings.reduce((sum, t) => {
      const distance = parseFloat(t.distance) || 0;
      return sum + distance;
    }, 0);

    result.push({
      weekLabel: formatDateShortWithYear(weekStart),
      totalKm: Math.round(totalKm * 10) / 10,
    });
  }

  return result;
};