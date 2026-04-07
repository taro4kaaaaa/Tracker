import { useState } from 'react';
import styles from './GoalModal.module.css';
import Modal from '../../../../components/Modal/Modal';

type ModalType = 'goal' | 'competition';

interface GoalModalProps {
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
}

const GoalModal = ({ isOpen, type, onClose, onSave }: GoalModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const isGoal = type === 'goal';
  const titleText = isGoal ? 'Новая цель' : 'Новое соревнование';

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>{titleText}</h2>

        <div className={styles.field}>
          <label className={styles.label}>Название</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isGoal ? 'Марафон за 2:30:00' : 'Марафон Токио 2026'}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Описание</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isGoal ? 'Опишите вашу цель...' : 'Опишите соревнование...'}
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Отмена
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={!title.trim()}>
            Сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GoalModal;
