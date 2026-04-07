import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Onboarding.module.css';
import { useUser } from '../../shared/context/UserContext';
import type { UserProfile } from '../../shared/types/user';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, saveUser } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '' as 'male' | 'female' | '',
    weight: '',
    height: '',
    restHeartRate: '',
    activityLevel: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        weight: user.weight ? user.weight.toString() : '',
        height: user.height ? user.height.toString() : '',
        restHeartRate: user.restHeartRate ? user.restHeartRate.toString() : '',
        activityLevel: user.activityLevel !== undefined ? user.activityLevel.toString() : '',
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Выберите дату рождения';
    }
    if (!formData.gender) {
      newErrors.gender = 'Выберите пол';
    }
    if (!formData.weight || Number(formData.weight) <= 0) {
      newErrors.weight = 'Введите вес';
    }
    if (!formData.height || Number(formData.height) <= 0) {
      newErrors.height = 'Введите рост';
    }
    if (!formData.restHeartRate || Number(formData.restHeartRate) <= 0) {
      newErrors.restHeartRate = 'Введите пульс в покое';
    }
    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Выберите уровень активности';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const userData: UserProfile = {
      name: formData.name.trim(),
      birthDate: formData.birthDate,
      gender: formData.gender as 'male' | 'female',
      weight: Number(formData.weight),
      height: Number(formData.height),
      restHeartRate: Number(formData.restHeartRate),
      activityLevel: Number(formData.activityLevel),
    };

    saveUser(userData);
    navigate('/');
  };

  const isEditing = !!user;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{isEditing ? 'Редактирование профиля' : 'Добро пожаловать'}</h1>
        <p className={styles.subtitle}>{isEditing ? 'Измените данные о себе' : 'Заполните данные о себе'}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Имя</label>
            <input
              type="text"
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ваше имя"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Дата рождения</label>
            <input
              type="date"
              className={`${styles.input} ${errors.birthDate ? styles.error : ''}`}
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
            />
            {errors.birthDate && <span className={styles.errorText}>{errors.birthDate}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Пол</label>
            <div className={styles.genderButtons}>
              <button
                type="button"
                className={`${styles.genderButton} ${formData.gender === 'male' ? styles.active : ''}`}
                onClick={() => handleChange('gender', 'male')}
              >
                Мужской
              </button>
              <button
                type="button"
                className={`${styles.genderButton} ${formData.gender === 'female' ? styles.active : ''}`}
                onClick={() => handleChange('gender', 'female')}
              >
                Женский
              </button>
            </div>
            {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Вес (кг)</label>
              <input
                type="number"
                className={`${styles.input} ${errors.weight ? styles.error : ''}`}
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="70"
                min="1"
              />
              {errors.weight && <span className={styles.errorText}>{errors.weight}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Рост (см)</label>
              <input
                type="number"
                className={`${styles.input} ${errors.height ? styles.error : ''}`}
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="175"
                min="1"
              />
              {errors.height && <span className={styles.errorText}>{errors.height}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Активность</label>
            <select
              className={`${styles.input} ${errors.activityLevel ? styles.error : ''}`}
              value={formData.activityLevel}
              onChange={(e) => handleChange('activityLevel', e.target.value)}
            >
              <option value="">Выберите уровень активности</option>
              <option value="0">Редко или никогда</option>
              <option value="1">1–2 раза в неделю</option>
              <option value="2">3–4 раза в неделю</option>
              <option value="3">5 и более раз в неделю</option>
            </select>
            {errors.activityLevel && <span className={styles.errorText}>{errors.activityLevel}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Пульс в покое (уд/мин)</label>
            <input
              type="number"
              className={`${styles.input} ${errors.restHeartRate ? styles.error : ''}`}
              value={formData.restHeartRate}
              onChange={(e) => handleChange('restHeartRate', e.target.value)}
              placeholder="60"
              min="1"
            />
            {errors.restHeartRate && <span className={styles.errorText}>{errors.restHeartRate}</span>}
          </div>

          <button type="submit" className={styles.submitButton}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;