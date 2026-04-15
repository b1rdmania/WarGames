import type { Metadata } from 'next';
import '@shadowbroker/shadowbroker.css';
import { ThemeProvider } from '@shadowbroker/lib/ThemeContext';
import DesktopBridgeBootstrap from '@shadowbroker/components/DesktopBridgeBootstrap';
import { TerminalMenuBar, TerminalSessionBadge, TerminalShell } from '@/components/terminal';
import styles from './shadowbroker-frame.module.css';

export const metadata: Metadata = {
  title: 'Monitor The Situation',
  description: 'Live monitor surface powered by the Shadowbroker backend.',
};

export default function ShadowbrokerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <DesktopBridgeBootstrap />
      <TerminalShell
        menuBar={
          <TerminalMenuBar
            items={['WAR.MARKET', 'MONITOR THE SITUATION']}
            right={<TerminalSessionBadge />}
          />
        }
      >
        <div className={styles.frame} data-hud="matrix" data-theme="dark">
          <div className={styles.viewportWrap}>
            {children}
          </div>
        </div>
      </TerminalShell>
    </ThemeProvider>
  );
}
