import { useState, useMemo, type ReactNode } from 'react';
import styles from './WeekCalendar.module.css';
import Modal from '../../../../components/Modal/Modal';
import { 
  getStartOfWeek, 
  addDays, 
  isSameDay,
  WEEKDAYS_SHORT 
} from '../../../../shared/utils/dateUtils';
import { useTrainings } from '../../../../shared/context/TrainingContext';
import type { TrainingType } from '../../../../shared/types/training';

const TRAINING_COLORS: Record<TrainingType, string> = {
  run: '#ef4444',
  bike: '#4ade80',
  swim: '#1D00FC',
};

const TRAINING_LABELS: Record<TrainingType, string> = {
  run: 'Бег',
  bike: 'Велосипед',
  swim: 'Плавание',
};

const formatDateFull = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateShort = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
};

const formatDateFullDisplay = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

const WeekCalendar = () => {
  const today = new Date();
  const { getTraining } = useTrainings();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const weekDays = useMemo(() => {
    const startOfWeek = getStartOfWeek(today);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startOfWeek, i);
      const dateStr = formatDateFull(date);
      const training = getTraining(dateStr);
      
      return {
        dayName: WEEKDAYS_SHORT[i],
        dateShort: formatDateShort(date),
        dateStr,
        isToday: isSameDay(date, today),
        training,
      };
    });
  }, [getTraining]);

  const selectedTraining = selectedDate ? getTraining(selectedDate) : null;

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const handleClose = () => {
    setSelectedDate(null);
  };

  const TrainingIndicator = ({ type }: { type: TrainingType }): ReactNode => (
    <div 
      className={styles.trainingIndicator}
      style={{ backgroundColor: TRAINING_COLORS[type] }}
    />
  );

  return (
    <div className={styles.calendar}>
      {weekDays.map((day, index) => (
        <div 
          key={index} 
          className={`${styles.day} ${day.isToday ? styles.today : ''}`}
          onClick={() => handleDayClick(day.dateStr)}
        >
          <div className={styles.dayHeader}>
            <span className={styles.dayName}>{day.dayName} {day.dateShort}</span>
          </div>
          <div className={styles.indicators}>
            {day.training && <TrainingIndicator type={day.training.type} />}
          </div>
        </div>
      ))}

      <Modal isOpen={selectedDate !== null} onClose={handleClose}>
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>
            {selectedDate ? formatDateFullDisplay(selectedDate) : ''}
          </h3>
          
          {selectedTraining ? (
            <>
              <div className={styles.activityBadge}>
                {TRAINING_LABELS[selectedTraining.type]}
              </div>
              {selectedTraining.description && (
                <p className={styles.description}>{selectedTraining.description}</p>
              )}
            </>
          ) : (
            <p className={styles.noTraining}>Тренировки нет</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default WeekCalendar;