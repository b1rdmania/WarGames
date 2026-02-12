import { ReactNode } from 'react';
import styles from './ControlRoomTable.module.css';

interface ControlRoomTableProps {
  children: ReactNode;
  className?: string;
}

export function ControlRoomTable({ children, className = '' }: ControlRoomTableProps) {
  return (
    <table className={`${styles.table} ${className}`}>
      {children}
    </table>
  );
}

interface ControlRoomTableHeaderProps {
  children: ReactNode;
}

export function ControlRoomTableHeader({ children }: ControlRoomTableHeaderProps) {
  return <thead className={styles.thead}>{children}</thead>;
}

interface ControlRoomTableBodyProps {
  children: ReactNode;
}

export function ControlRoomTableBody({ children }: ControlRoomTableBodyProps) {
  return <tbody className={styles.tbody}>{children}</tbody>;
}

interface ControlRoomTableRowProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function ControlRoomTableRow({ children, onClick, active = false, className = '' }: ControlRoomTableRowProps) {
  return (
    <tr
      className={`${styles.row} ${active ? styles.rowActive : ''} ${onClick ? styles.rowClickable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface ControlRoomTableCellProps {
  children: ReactNode;
  header?: boolean;
  mono?: boolean;
  className?: string;
}

export function ControlRoomTableCell({ children, header = false, mono = false, className = '' }: ControlRoomTableCellProps) {
  const cellClass = `${header ? styles.th : styles.td} ${mono ? styles.mono : ''} ${className}`;

  if (header) {
    return <th className={cellClass}>{children}</th>;
  }

  return <td className={cellClass}>{children}</td>;
}
