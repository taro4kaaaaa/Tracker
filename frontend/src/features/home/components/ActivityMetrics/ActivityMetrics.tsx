import React, { useState, useEffect } from 'react';
import styles from './ActivityMetrics.module.css';
import { useUser } from '../../../../shared/context/UserContext';
import { calculateVO2max } from '../../../../shared/utils/calculations';
import { refreshTodayMetrics } from '../../../../shared/utils/dailyMetrics';
import type { DailyMetrics } from '../../../../shared/types/dailyMetrics';

const ActivityMetrics: React.FC = () => {
  const { user } = useUser();
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics | null>(null);
  
  useEffect(() => {
    if (user) {
      const metrics = refreshTodayMetrics(user);
      setDailyMetrics(metrics);
    }
  }, [user]);
  
  const vo2max = user ? calculateVO2max(user) : null;
  
  const metrics = [
    { label: 'Ср. пульс', value: dailyMetrics?.avgHeartRate ?? '-', size: 'large' },
    { label: 'Шаги', value: dailyMetrics?.steps ?? '-', size: 'large' },
    { label: 'Стресс', value: dailyMetrics?.stress ?? '-', size: 'large' },
    { label: 'VO2 max', value: vo2max !== null ? vo2max : '-', size: 'small' },
    { label: 'Recovery', value: dailyMetrics?.recovery ?? '-', size: 'small' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Активность за день</h2>
      <div className={styles.metrics}>
        {metrics.slice(0, 3).map((metric, index) => (
          <div key={index} className={styles.metric}>
            <div className={`${styles.circle} ${styles[metric.size]}`}>
              {metric.value}
            </div>
            <div className={styles.label}>{metric.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.metrics1}>
        {metrics.slice(3).map((metric, index) => (
          <div key={index} className={styles.metric}>
            <div className={`${styles.circle} ${styles[metric.size]}`}>
              {metric.value}
            </div>
            <div className={styles.label}>{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityMetrics;