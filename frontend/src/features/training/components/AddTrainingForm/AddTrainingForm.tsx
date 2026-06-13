import React, { useState } from 'react';
import styles from './AddTrainingForm.module.css';

interface TrainingData {
  activityType: string;
  load: number;
  heartRate: number;
  time: string;
  distance: string;
}

interface AddTrainingFormProps {
  onSubmit: (data: TrainingData) => void;
  onCancel: () => void;
}

const ACTIVITY_OPTIONS = [
  { value: '', label: 'Выберите вид активности' },
  { value: 'run', label: 'Бег' },
  { value: 'bike', label: 'Велосипед' },
  { value: 'swim', label: 'Плавание' },
];

const AddTrainingForm: React.FC<AddTrainingFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TrainingData>({
    activityType: '',
    load: 5,
    heartRate: 0,
    time: '',
    distance: '',
  });

  const handleChange = (field: keyof TrainingData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatTimeInput = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 6);
    
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i === 2 || i === 4) {
        formatted += ':';
      }
      formatted += limited[i];
    }
    
    return formatted;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTimeInput(e.target.value);
    setFormData(prev => ({ ...prev, time: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activityType || !formData.heartRate || 
        !formData.time || !formData.distance) {
      alert('Заполните все поля');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Добавить тренировку</h2>
      
      <div className={styles.field}>
        <label>Вид активности *</label>
        <select
          value={formData.activityType}
          onChange={(e) => handleChange('activityType', e.target.value)}
          required
        >
          {ACTIVITY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label>Нагрузка (1-10) *</label>
        <input
          type="number"
          className={styles.noSpinButtons}
          min="1"
          max="10"
          value={formData.load}
          onChange={(e) => handleChange('load', Number(e.target.value))}
          placeholder="5"
          required
        />
      </div>

      <div className={styles.field}>
        <label>Пульс (уд/мин) *</label>
        <input
          type="number"
          className={styles.noSpinButtons}
          value={formData.heartRate || ''}
          onChange={(e) => handleChange('heartRate', Number(e.target.value))}
          placeholder="150"
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Время *</label>
          <input
            type="text"
            value={formData.time}
            onChange={handleTimeChange}
            placeholder="01:30:00"
            maxLength={8}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Дистанция (км) *</label>
          <input
            type="text"
            value={formData.distance}
            onChange={(e) => handleChange('distance', e.target.value)}
            placeholder="10.5"
            required
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className={styles.submitButton}>
          Добавить
        </button>
      </div>
    </form>
  );
};

export default AddTrainingForm;
