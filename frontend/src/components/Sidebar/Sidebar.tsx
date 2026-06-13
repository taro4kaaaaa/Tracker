import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useUser } from '../../shared/context/UserContext';

const Sidebar = () => {
  const { user } = useUser();

  return (
    <div className={styles.sidebar}>
      {user && user.name && (
        <div className={styles.userInfo}>
          <NavLink to="/onboarding" className={styles.userName}>
            {user.name}
          </NavLink>
        </div>
      )}
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => 
            `${styles.menuItem} ${isActive ? styles.active : ''}`
          }
          end
        >
          Главная
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) => 
            `${styles.menuItem} ${isActive ? styles.active : ''}`
          }
        >
          Календарь
        </NavLink>
        <NavLink
          to="/statistics"
          className={({ isActive }) => 
            `${styles.menuItem} ${isActive ? styles.active : ''}`
          }
        >
          Статистика показателей
        </NavLink>
        <NavLink
          to="/training"
          className={({ isActive }) => 
            `${styles.menuItem} ${isActive ? styles.active : ''}`
          }
        >
          Занятия
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;