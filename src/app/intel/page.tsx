import { RiskShell } from '@/components/RiskShell';
import { TerminalTopNav } from '@/components/TerminalTopNav';
import IntelClient from './IntelClient';

export default function IntelPage() {
  return (
    <RiskShell nav={<TerminalTopNav />} showMusic>
      <IntelClient />
    </RiskShell>
  );
}
