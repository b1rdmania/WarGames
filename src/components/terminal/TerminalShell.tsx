'use client';

import { ReactNode } from 'react';
import styles from './terminal.module.css';

interface TerminalShellProps {
  header?: ReactNode;
  menuBar?: ReactNode;
  leftPane?: ReactNode;
  centerPane?: ReactNode;
  rightPane?: ReactNode;
  commandBar?: ReactNode;
  statusBar?: ReactNode;
  children?: ReactNode;
}

export function TerminalShell({
  header,
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
      {header}
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
