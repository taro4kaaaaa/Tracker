export type TrainingType = 'run' | 'bike' | 'swim';

export interface DayTraining {
  date: string;
  type: TrainingType;
  description: string;
}
