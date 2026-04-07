import { useState, useEffect } from 'react';
import styles from './TrainingStatus.module.css';
import Modal from '../../../../components/Modal/Modal';
import AddTrainingForm from '../AddTrainingForm/AddTrainingForm';
import trainingIcon from '../../../../assets/image.png';
import { useCompletedTrainings } from '../../../../shared/context/CompletedTrainingsContext';
import { getDayOfWeek, getTodayISO } from '../../../../shared/utils/dateUtils';
import type { ActivityType } from '../../../../shared/types/completedTraining';

interface FormData {
  activityType: string;
  load: number;
  heartRate: number;
  time: string;
  distance: string;
}

interface SavedData extends FormData {
  date: string;
}

interface StatusConfig {
  text: string;
  color: string;
}

const STORAGE_KEY = 'today-training-data';

const getStatusConfig = (load: number): StatusConfig => {
  if (load >= 1 && load <= 2) {
    return { text: 'Непродуктивная', color: '#FC0000' };
  } else if (load >= 3 && load <= 4) {
    return { text: 'Восстановление', color: '#1D00FC' };
  } else if (load >= 5 && load <= 6) {
    return { text: 'Поддерживающий', color: '#00FC4C' };
  } else if (load >= 7 && load <= 8) {
    return { text: 'Продуктивная', color: '#E700FC' };
  } else if (load >= 9 && load <= 10) {
    return { text: 'Пиковая нагрузка', color: '#CB03D9' };
  }
  return { text: 'Статус недоступен', color: '#000000' };
};

const TrainingStatus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedData, setSavedData] = useState<SavedData | null>(null);
  const { addTraining } = useCompletedTrainings();

  useEffect(() => {
    const today = getTodayISO();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as SavedData;
      if (data.date === today) {
        setSavedData(data);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (savedData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
    }
  }, [savedData]);

  const calculatePace = (time: string, distance: string): string => {
    const timeParts = time.split(':').map(Number);
    const totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    const totalMinutes = totalSeconds / 60;
    
    const distanceKm = parseFloat(distance);
    if (distanceKm === 0) return '';
    
    const paceMinutes = totalMinutes / distanceKm;
    const paceMin = Math.floor(paceMinutes);
    const paceSec = Math.round((paceMinutes - paceMin) * 60);
    
    return `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
  };

  const handleAddTraining = (data: FormData) => {
    const dateStr = getTodayISO();
    
    setSavedData({ ...data, date: dateStr });
    
    addTraining({
      id: Date.now().toString(),
      date: dateStr,
      dayOfWeek: getDayOfWeek(dateStr),
      activityType: data.activityType as ActivityType,
      load: data.load,
      heartRate: data.heartRate,
      time: data.time,
      distance: data.distance,
    });
    
    setIsModalOpen(false);
  };

  const statusConfig = savedData 
    ? getStatusConfig(savedData.load) 
    : { text: 'Статус недоступен', color: '#000000' };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Статус тренировки</h3>
      
      <div className={styles.statusSection}>
        <div 
          className={styles.indicatorImage}
          style={{ 
            backgroundColor: statusConfig.color,
            maskImage: `url(${trainingIcon})`,
            WebkitMaskImage: `url(${trainingIcon})`
          }}
        />
        <div className={styles.statusText}>{statusConfig.text}</div>
      </div>
      
      <div className={styles.metrics}>
        <h4>Показатели:</h4>
        <div className={styles.metricItem}>
          Нагрузка: {savedData ? `${savedData.load}/10` : ''}
        </div>
        <div className={styles.metricItem}>
          Темп: {savedData ? `${calculatePace(savedData.time, savedData.distance)} мин/км` : ''}
        </div>
        <div className={styles.metricItem}>
          Пульс: {savedData?.heartRate ? `${savedData.heartRate} уд/мин` : ''}
        </div>
        <div className={styles.metricItem}>
          Время: {savedData?.time ? `${savedData.time} ч:мин:с` : ''}
        </div>
        <div className={styles.metricItem}>
          Дистанция: {savedData?.distance ? `${savedData.distance} км` : ''}
        </div>
      </div>
      
      <button 
        className={styles.button}
        onClick={() => setIsModalOpen(true)}
      >
        Добавить тренировку
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTrainingForm 
          onSubmit={handleAddTraining}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TrainingStatus;