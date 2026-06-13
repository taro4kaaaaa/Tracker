import styles from './Training.module.css';
import TrainingList from '../components/TrainingList/TrainingList';

const Training = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Занятия</h1>
      <TrainingList />
    </div>
  );
};

export default Training;
