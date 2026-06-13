import { useState, useEffect } from 'react';
import styles from './GoalModal.module.css';
import Modal from '../../../../components/Modal/Modal';
import type { Goal, Competition } from '../../../../shared/types/goals';

type ItemType = 'goal' | 'competition';

interface EditModalProps {
  isOpen: boolean;
  type: ItemType;
  item: Goal | Competition | null;
  onClose: () => void;
  onSave: (id: string, data: { title: string; description: string }) => void;
  onDelete: (id: string) => void;
}

const EditModal = ({ isOpen, type, item, onClose, onSave, onDelete }: EditModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
    }
  }, [item]);

  const handleSave = () => {
    if (title.trim() && item) {
      onSave(item.id, { title: title.trim(), description: description.trim() });
      onClose();
    }
  };

  const handleDelete = () => {
    if (item && confirm('Вы уверены, что хотите удалить?')) {
      onDelete(item.id);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const isGoal = type === 'goal';
  const titleText = isGoal ? 'Редактирование цели' : 'Редактирование соревнования';

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>{titleText}</h2>

        <div className={styles.field}>
          <label className={styles.label}>Цель</label>
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
          <button className={styles.deleteButton} onClick={handleDelete}>
            Удалить
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={!title.trim()}>
            Изменить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
