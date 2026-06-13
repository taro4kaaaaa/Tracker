export type ActivityType = 'run' | 'bike' | 'swim';

export interface CompletedTraining {
  id: string;
  date: string;
  dayOfWeek: string;
  activityType: ActivityType;
  load: number;
  heartRate: number;
  time: string;
  distance: string;
}
