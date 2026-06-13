import { useState } from 'react';
import styles from './GoalsPanel.module.css';
import GoalModal from './GoalModal';
import EditModal from './EditModal';
import { useGoals } from '../../../../shared/context/GoalsContext';
import type { Goal, Competition } from '../../../../shared/types/goals';

const GoalsPanel = () => {
  const { goals, competitions, addGoal, updateGoal, deleteGoal, addCompetition, updateCompetition, deleteCompetition } = useGoals();
  
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [competitionModalOpen, setCompetitionModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<'goal' | 'competition'>('goal');
  const [editingItem, setEditingItem] = useState<Goal | Competition | null>(null);

  const handleAddGoal = (data: { title: string; description: string }) => {
    addGoal({
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
    });
  };

  const handleAddCompetition = (data: { title: string; description: string }) => {
    addCompetition({
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
    });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingItem(goal);
    setEditType('goal');
    setEditModalOpen(true);
  };

  const handleEditCompetition = (comp: Competition) => {
    setEditingItem(comp);
    setEditType('competition');
    setEditModalOpen(true);
  };

  const handleSaveEdit = (id: string, data: { title: string; description: string }) => {
    if (editType === 'goal') {
      updateGoal(id, data);
    } else {
      updateCompetition(id, data);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (editType === 'goal') {
      deleteGoal(id);
    } else {
      deleteCompetition(id);
    }
  };

  return (
    <div className={styles.panel}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Цели:</h3>
        {goals.length === 0 ? (
          <p className={styles.empty}>Нет целей</p>
        ) : (
          <ul className={styles.list}>
            {goals.map((goal) => (
              <li 
                key={goal.id} 
                className={styles.item}
                onClick={() => handleEditGoal(goal)}
              >
                {goal.title}
              </li>
            ))}
          </ul>
        )}
      </section>
      
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Соревнования:</h3>
        {competitions.length === 0 ? (
          <p className={styles.empty}>Нет соревнований</p>
        ) : (
          <ul className={styles.list}>
            {competitions.map((comp) => (
              <li 
                key={comp.id} 
                className={styles.item}
                onClick={() => handleEditCompetition(comp)}
              >
                {comp.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.buttons}>
        <button 
          className={styles.button}
          onClick={() => setGoalModalOpen(true)}
        >
          Добавить цель
        </button>
        <button 
          className={styles.button}
          onClick={() => setCompetitionModalOpen(true)}
        >
          Добавить соревнование
        </button>
      </div>

      <GoalModal
        isOpen={goalModalOpen}
        type="goal"
        onClose={() => setGoalModalOpen(false)}
        onSave={handleAddGoal}
      />

      <GoalModal
        isOpen={competitionModalOpen}
        type="competition"
        onClose={() => setCompetitionModalOpen(false)}
        onSave={handleAddCompetition}
      />

      <EditModal
        isOpen={editModalOpen}
        type={editType}
        item={editingItem}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteItem}
      />
    </div>
  );
};

export default GoalsPanel;
