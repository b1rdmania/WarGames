import Link from 'next/link';
import styles from './terminal.module.css';

interface TerminalHeaderProps {
  title: string;
  backHref?: string;
  backLabel?: string;
}

export function TerminalHeader({ title, backHref = '/labs', backLabel = 'BACK TO LABS' }: TerminalHeaderProps) {
  return (
    <div className={styles.header}>
      <div>{title}</div>
      {backHref && (
        <Link href={backHref} className={styles.back}>
          {backLabel}
        </Link>
      )}
    </div>
  );
}
