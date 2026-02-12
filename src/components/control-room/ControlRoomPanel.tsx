import { ReactNode } from 'react';
import styles from './ControlRoomPanel.module.css';

interface ControlRoomPanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ControlRoomPanel({ title, subtitle, children, className = '' }: ControlRoomPanelProps) {
  return (
    <div className={`${styles.panel} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
