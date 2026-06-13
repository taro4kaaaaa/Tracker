import WeekCalendar from '../components/WeekCalendar/WeekCalendar';
import ActivityMetrics from '../components/ActivityMetrics/ActivityMetrics';
import TrainingStatus from '../../training/components/TrainingStatus/TrainingStatus';
import GoalsPanel from '../components/GoalsPanel/GoalsPanel';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <WeekCalendar />
        <div className={styles.metricsRow}>
          <ActivityMetrics />
          <TrainingStatus />
        </div>
      </div>
      <GoalsPanel />
    </div>
  );
};

export default Home;
