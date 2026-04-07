export interface UserProfile {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  restHeartRate: number;
  activityLevel: number;
}