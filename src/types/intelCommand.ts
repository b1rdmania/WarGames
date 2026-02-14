export type IntelFreshness = 'realtime' | 'intraday' | 'eod' | 'stale' | 'unknown';

export interface IntelRegimeBlock {
  risk_score: number | null;
  bias: string;
  band: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  regime: string;
  confidence: number | null;
  as_of: string;
  freshness: IntelFreshness;
}

export interface IntelEventWindowBlock {
  next_event: string;
  event_date: string | null;
  hours_to_event: number | null;
  windows: Array<{
    event_name: string;
    window_start: string;
    expected_volatility: number;
  }>;
  as_of: string;
  freshness: IntelFreshness;
}

export interface IntelAlertItem {
  id: string;
  title: string;
  tag: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
}

export interface IntelTapeItem {
  id: string;
  label: string;
  value: number;
  change: number | null;
  unit?: string;
  category: string;
}

export interface IntelPostureBlock {
  action: 'REDUCE' | 'HOLD' | 'ADD' | 'UNKNOWN';
  recommendation: string;
  checks: string[];
  as_of: string;
  freshness: IntelFreshness;
}

export interface IntelHealthSource {
  name: string;
  status: 'ok' | 'degraded' | 'unavailable';
  freshness: IntelFreshness;
}

export interface IntelCommandPayload {
  timestamp: string;
  regime: IntelRegimeBlock;
  event_window: IntelEventWindowBlock;
  alerts: IntelAlertItem[];
  tape: IntelTapeItem[];
  drivers: string[];
  posture: IntelPostureBlock;
  metrics: {
    tps: number | null;
    validators: number | null;
    vix: number | null;
    credit_regime: string;
    systemic_stress: number | null;
  };
  health: {
    degraded_mode: boolean;
    sources: IntelHealthSource[];
  };
}
