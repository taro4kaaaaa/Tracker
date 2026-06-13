import { useState, useMemo } from 'react';
import styles from './TrainingList.module.css';
import { useCompletedTrainings } from '../../../../shared/context/CompletedTrainingsContext';
import { formatDateFull } from '../../../../shared/utils/dateUtils';
import type { ActivityType } from '../../../../shared/types/completedTraining';

const ITEMS_PER_PAGE = 8;

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  run: 'Бег',
  bike: 'Велосипед',
  swim: 'Плавание',
};


type FilterType = 'all' | ActivityType;

const TrainingList = () => {
  const { trainings, deleteTraining } = useCompletedTrainings();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTrainings = useMemo(() => {
    let result = [...trainings];
    if (filter !== 'all') {
      result = result.filter(t => t.activityType === filter);
    }
    return result.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [trainings, filter]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTrainings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredTrainings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (filteredTrainings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Нет тренировок</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          Все
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'run' ? styles.active : ''}`}
          onClick={() => handleFilterChange('run')}
        >
          Бег
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'bike' ? styles.active : ''}`}
          onClick={() => handleFilterChange('bike')}
        >
          Велосипед
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'swim' ? styles.active : ''}`}
          onClick={() => handleFilterChange('swim')}
        >
          Плавание
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thNumber}>№</th>
              <th className={styles.th}>Дата</th>
              <th className={styles.th}>День недели</th>
              <th className={styles.th}>Тип активности</th>
              <th className={styles.th}>Нагрузка</th>
              <th className={styles.th}>Пульс</th>
              <th className={styles.th}>Время</th>
              <th className={styles.th}>Дистанция</th>
              <th className={styles.thActions}></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((training, index) => (
              <tr key={training.id} className={styles.row}>
                <td className={styles.tdNumber}>
                  {startIndex + index + 1}
                </td>
                <td className={styles.td}>
                  {formatDateFull(new Date(training.date))}
                </td>
                <td className={styles.td}>
                  {training.dayOfWeek}
                </td>
                <td className={styles.td}>
                  <span 
                    className={styles.activityBadge}
                  >
                    {ACTIVITY_LABELS[training.activityType]}
                  </span>
                </td>
                <td className={styles.td}>
                  {training.load}/10
                </td>
                <td className={styles.td}>
                  {training.heartRate} уд/мин
                </td>
                <td className={styles.td}>
                  {training.time}
                </td>
                <td className={styles.td}>
                  {training.distance} км
                </td>
                <td className={styles.tdActions}>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => deleteTraining(training.id)}
                    title="Удалить"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className={styles.ellipsis}>...</span>
            )
          ))}
          
          <button 
            className={styles.pageButton}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainingList;
