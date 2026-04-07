import { useState, type ReactNode } from 'react';
import styles from './Calendar.module.css';
import { useTrainings } from '../../../shared/context/TrainingContext';
import DayTrainingModal from '../components/DayTrainingModal';
import type { DayTraining, TrainingType } from '../../../shared/types/training';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const TRAINING_COLORS: Record<TrainingType, string> = {
  run: '#ef4444',
  bike: '#4ade80',
  swim: '#1D00FC',
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { getTraining, addTraining, updateTraining, deleteTraining } = useTrainings();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formatDateString = (day: number): string => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getDaysInMonth = (y: number, m: number): number => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y: number, m: number): number => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = formatDateString(day);
    setSelectedDate(dateStr);
  };

  const handleSave = (training: DayTraining) => {
    const existing = getTraining(training.date);
    if (existing) {
      updateTraining(training.date, training);
    } else {
      addTraining(training);
    }
  };

  const handleDelete = () => {
    if (selectedDate) {
      deleteTraining(selectedDate);
    }
  };

  const TrainingIndicator = ({ type }: { type: TrainingType }): ReactNode => (
    <div 
      className={styles.trainingIndicator}
      style={{ backgroundColor: TRAINING_COLORS[type] }}
    />
  );

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const days: ReactNode[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div key={`prev-${day}`} className={`${styles.day} ${styles.otherMonth}`}>
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(day);
      const training = getTraining(dateStr);
      const isToday = 
        day === new Date().getDate() && 
        month === new Date().getMonth() && 
        year === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          className={`${styles.day} ${isToday ? styles.today : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
          {training && <TrainingIndicator type={training.type} />}
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div key={`next-${day}`} className={`${styles.day} ${styles.otherMonth}`}>
          {day}
        </div>
      );
    }

    return days;
  };

  const selectedTraining = selectedDate ? getTraining(selectedDate) : undefined;

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button className={styles.navButton} onClick={goToPrevMonth}>
          ←
        </button>
        <h2 className={styles.monthTitle}>
          {MONTHS[month]} {year}
        </h2>
        <button className={styles.navButton} onClick={goToNextMonth}>
          →
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {renderCalendarDays()}
      </div>

      <DayTrainingModal
        isOpen={selectedDate !== null}
        date={selectedDate || ''}
        training={selectedTraining}
        onClose={() => setSelectedDate(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Calendar;
