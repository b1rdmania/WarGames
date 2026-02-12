import styles from './ControlRoomEventLog.module.css';

export interface ControlRoomEvent {
  time: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface ControlRoomEventLogProps {
  events: ControlRoomEvent[];
  className?: string;
}

export function ControlRoomEventLog({ events, className = '' }: ControlRoomEventLogProps) {
  return (
    <div className={`${styles.log} ${className}`}>
      {events.map((event, i) => (
        <div key={i} className={styles.item}>
          <span className={styles.time}>{event.time}</span>
          <span className={`${styles.msg} ${event.type ? styles[event.type] : ''}`}>
            {event.message}
          </span>
        </div>
      ))}
    </div>
  );
}
