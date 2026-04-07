import { useState, useEffect } from 'react';
import styles from './DayTrainingModal.module.css';
import Modal from '../../../components/Modal/Modal';
import type { DayTraining, TrainingType } from '../../../shared/types/training';

interface DayTrainingModalProps {
  isOpen: boolean;
  date: string;
  training?: DayTraining;
  onClose: () => void;
  onSave: (training: DayTraining) => void;
  onDelete: () => void;
}

const TRAINING_OPTIONS = [
  { value: 'run', label: 'Бег' },
  { value: 'bike', label: 'Велосипед' },
  { value: 'swim', label: 'Плавание' },
];

const DayTrainingModal = ({
  isOpen,
  date,
  training,
  onClose,
  onSave,
  onDelete,
}: DayTrainingModalProps) => {
  const [type, setType] = useState<TrainingType>('run');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (training) {
      setType(training.type);
      setDescription(training.description);
    } else {
      setType('run');
      setDescription('');
    }
  }, [training, isOpen]);

  const handleSave = () => {
    onSave({ date, type, description });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>Тренировка на {date}</h2>

        <div className={styles.field}>
          <label>Вид активности</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TrainingType)}
            className={styles.select}
          >
            {TRAINING_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишите тренировку..."
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          {training ? (
            <>
              <button className={styles.deleteButton} onClick={handleDelete}>
                Удалить
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                Изменить
              </button>
            </>
          ) : (
            <button className={styles.saveButton} onClick={handleSave}>
              Добавить
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DayTrainingModal;
