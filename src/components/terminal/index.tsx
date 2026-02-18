import { ReactNode } from 'react';
import styles from './terminal.module.css';

export { TerminalShell } from './TerminalShell';
export { TerminalHeader } from './TerminalHeader';
export { TerminalNav } from './TerminalNav';
export { TerminalSessionBadge } from './TerminalSessionBadge';

// Menu Bar
export function TerminalMenuBar({ items, right }: { items: string[]; right?: ReactNode }) {
  const hasItems = items.length > 0;
  return (
    <div className={`${styles.menu} ${!hasItems ? styles.menuRightOnly : ''}`}>
      {hasItems ? <span className={styles.menuItems}>{items.join('  ')}</span> : null}
      {right ? <span className={styles.menuRight}>{right}</span> : null}
    </div>
  );
}

// Pane Title
export function TerminalPaneTitle({ children }: { children: ReactNode }) {
  return <div className={styles.paneTitle}>{children}</div>;
}

// Command Bar (F-keys)
interface CommandKey {
  key: string;
  label: string;
}

export function TerminalCommandBar({ commands }: { commands: CommandKey[] }) {
  return (
    <div className={styles.commandBar}>
      {commands.map((cmd) => (
        <span key={cmd.key}>
          {cmd.key} {cmd.label}
        </span>
      ))}
    </div>
  );
}

// Status Bar
interface StatusItem {
  label: string;
  value: string;
}

export function TerminalStatusBar({ items }: { items: StatusItem[] }) {
  return (
    <div className={styles.statusBar}>
      {items.map((item, i) => (
        <span key={i}>
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
}

// Buttons
interface TerminalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'active';
  fullWidth?: boolean;
}

export function TerminalButton({ variant = 'default', fullWidth, className = '', ...props }: TerminalButtonProps) {
  const classes = [
    variant === 'primary' ? styles.actionPrimary : variant === 'active' ? styles.segmentActive : styles.action,
    className,
  ].filter(Boolean).join(' ');

  return <button {...props} className={classes} style={{ width: fullWidth ? '100%' : undefined }} />;
}

// Segment Control (YES/NO toggle)
interface TerminalSegmentProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function TerminalSegment({ options, value, onChange }: TerminalSegmentProps) {
  return (
    <div className={styles.segment}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={value === opt.value ? styles.segmentActive : ''}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Size Row (preset amounts)
interface TerminalSizeRowProps {
  sizes: number[];
  value: number;
  onChange: (size: number) => void;
}

export function TerminalSizeRow({ sizes, value, onChange }: TerminalSizeRowProps) {
  return (
    <div className={styles.sizeRow}>
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={value === size ? styles.segmentActive : ''}
        >
          ${size}
        </button>
      ))}
    </div>
  );
}

// Note text
export function TerminalNote({ children }: { children: ReactNode }) {
  return <div className={styles.note}>{children}</div>;
}

// Title
export function TerminalTitle({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={styles.title} {...props}>{children}</div>;
}

// Thesis text
export function TerminalThesis({ children }: { children: ReactNode }) {
  return <div className={styles.thesis}>{children}</div>;
}

// Key-Value grid
export function TerminalKV({ children }: { children: ReactNode }) {
  return <div className={styles.kv}>{children}</div>;
}

export function TerminalKVRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// Market List
export function TerminalMarketList({ children }: { children: ReactNode }) {
  return <div className={styles.marketList}>{children}</div>;
}

interface TerminalMarketRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  code: string;
  status: string;
  active?: boolean;
}

export function TerminalMarketRow({ code, status, active, ...props }: TerminalMarketRowProps) {
  return (
    <button {...props} className={`${styles.marketRow} ${active ? styles.marketRowActive : ''}`}>
      <span>{code}</span>
      <span>{status}</span>
    </button>
  );
}
