import { ReactNode } from 'react';
import styles from './ControlRoomStatusRail.module.css';

interface StatusItem {
  key: string;
  value: ReactNode;
}

interface ControlRoomStatusRailProps {
  leftItems?: StatusItem[];
  rightItems?: StatusItem[];
  className?: string;
}

export function ControlRoomStatusRail({ leftItems = [], rightItems = [], className = '' }: ControlRoomStatusRailProps) {
  return (
    <footer className={`${styles.rail} ${className}`}>
      <div className={styles.group}>
        {leftItems.map((item, i) => (
          <div key={i} className={styles.item}>
            <span>{item.key}:</span>
            <span className={styles.value}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.group}>
        {rightItems.map((item, i) => (
          <div key={i} className={styles.item}>
            <span>{item.key}:</span>
            <span className={styles.value}>{item.value}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}
