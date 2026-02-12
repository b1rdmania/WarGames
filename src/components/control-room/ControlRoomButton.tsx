import { ButtonHTMLAttributes } from 'react';
import styles from './ControlRoomButton.module.css';

interface ControlRoomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export function ControlRoomButton({
  variant = 'secondary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ControlRoomButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
