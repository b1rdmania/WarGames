import { InputHTMLAttributes } from 'react';
import styles from './ControlRoomInput.module.css';

interface ControlRoomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function ControlRoomInput({ label, className = '', ...props }: ControlRoomInputProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${className}`} {...props} />
    </div>
  );
}
