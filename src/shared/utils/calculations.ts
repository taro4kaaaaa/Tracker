import type { UserProfile } from '../types/user';

export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const calculateVO2max = (user: UserProfile): number | null => {
  if (!user) return null;
  
  const { birthDate, gender, weight, height, restHeartRate, activityLevel } = user;
  
  if (activityLevel === undefined || activityLevel >= 2) {
    if (!birthDate || restHeartRate === undefined) {
      return null;
    }
    const age = calculateAge(birthDate);
    const hrMax = 208 - (0.7 * age);
    const vo2max = 15.3 * (hrMax / restHeartRate);
    return Math.ceil(vo2max);
  }
  
  if (activityLevel <= 1) {
    if (!birthDate || gender === undefined || !weight || !height || restHeartRate === undefined) {
      return null;
    }
    const age = calculateAge(birthDate);
    const bmi = calculateBMI(weight, height);
    const genderValue = gender === 'male' ? 1 : 0;
    const vo2max = 50.513 
      + (1.589 * activityLevel) 
      - (0.289 * age) 
      - (0.552 * bmi) 
      + (5.863 * genderValue) 
      - (0.183 * restHeartRate);
    return Math.ceil(vo2max);
  }
  
  return null;
};