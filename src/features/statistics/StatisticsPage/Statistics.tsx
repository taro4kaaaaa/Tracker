import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import styles from './Statistics.module.css';
import { useUser } from '../../../shared/context/UserContext';
import { useCompletedTrainings } from '../../../shared/context/CompletedTrainingsContext';
import { getVO2maxLastWeeks } from '../../../shared/utils/vo2maxHistory';
import { getTrainingVolumeByWeeks } from '../../../shared/utils/trainingVolume';

const WEEKS = 8;

const Statistics = () => {
  const { user } = useUser();
  const { trainings } = useCompletedTrainings();

  const vo2maxData = useMemo(() => {
    const data = getVO2maxLastWeeks(WEEKS);
    return data.map(d => ({ ...d, value: d.value || null }));
  }, [user]);

  const volumeData = useMemo(() => {
    return getTrainingVolumeByWeeks(trainings, WEEKS);
  }, [trainings]);

  const vo2maxHasData = vo2maxData.some(d => d.value !== null);
  const volumeHasData = volumeData.some(d => d.totalKm > 0);

  const renderEmptyChart = (message: string) => (
    <div className={styles.emptyChart}>
      <p>{message}</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Статистика показателей</h1>

      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>VO2max</h2>
        {vo2maxHasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vo2maxData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="weekLabel" 
                stroke="#ffffff" 
                tick={{ fill: '#ffffff', fontSize: 12 }}
              />
              <YAxis 
                stroke="#ffffff" 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f3d61', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value) => [value ?? '-', 'VO2max']}
              />
              <Line 
                type="linear"
                dataKey="value" 
                stroke="#4ade80" 
                strokeWidth={2}
                dot={{ fill: '#ffffff', stroke: '#4ade80', strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          renderEmptyChart('Нет данных')
        )}
      </div>

      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Тренировочный объём (км/неделю)</h2>
        {volumeHasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="weekLabel" 
                stroke="#ffffff" 
                tick={{ fill: '#ffffff', fontSize: 12 }}
              />
              <YAxis 
                stroke="#ffffff" 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f3d61', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value) => [`${value ?? 0} км`, 'Объём']}
              />
              <Line 
                type="linear"
                dataKey="totalKm" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          renderEmptyChart('Нет данных')
        )}
      </div>
    </div>
  );
};

export default Statistics;