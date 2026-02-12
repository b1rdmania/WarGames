import { ReactNode } from 'react';
import styles from './ControlRoomSectionHeader.module.css';

interface ControlRoomSectionHeaderProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function ControlRoomSectionHeader({ label, children, className = '' }: ControlRoomSectionHeaderProps) {
  return (
    <div className={`${styles.section} ${className}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{children}</div>
    </div>
  );
}
