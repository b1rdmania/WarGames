'use client';

import { ReactNode } from 'react';
import { TerminalNav } from './TerminalNav';
import styles from './terminal.module.css';

interface TerminalShellProps {
  menuBar?: ReactNode;
  leftPane?: ReactNode;
  centerPane?: ReactNode;
  rightPane?: ReactNode;
  commandBar?: ReactNode;
  statusBar?: ReactNode;
  children?: ReactNode;
}

export function TerminalShell({
  menuBar,
  leftPane,
  centerPane,
  rightPane,
  commandBar,
  statusBar,
  children,
}: TerminalShellProps) {
  return (
    <main className={styles.page}>
      <TerminalNav />
      {menuBar}
      {children || (
        <div className={styles.shell}>
          {leftPane && <section className={styles.pane}>{leftPane}</section>}
          {centerPane && <section className={styles.pane}>{centerPane}</section>}
          {rightPane && <section className={styles.pane}>{rightPane}</section>}
        </div>
      )}
      {commandBar}
      {statusBar}
    </main>
  );
}
