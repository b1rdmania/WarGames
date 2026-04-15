'use client';

import { useEffect } from 'react';
import { bootstrapDesktopControlBridge } from '@shadowbroker/lib/desktopBridge';

export default function DesktopBridgeBootstrap() {
  useEffect(() => {
    bootstrapDesktopControlBridge();
  }, []);

  return null;
}
