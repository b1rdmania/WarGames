import { RiskShell } from '@/components/RiskShell';
import { ControlRoomTopNav } from '@/components/ControlRoomTopNav';
import IntelClient from './IntelClient';

export default function IntelPage() {
  return (
    <RiskShell nav={<ControlRoomTopNav />} showMusic>
      <IntelClient />
    </RiskShell>
  );
}
