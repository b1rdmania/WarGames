import { API_BASE, sbApi } from '@shadowbroker/lib/api';
import type {
  UWCongressResponse,
  UWInsiderResponse,
  UWStatusResponse,
} from '@shadowbroker/types/unusualWhales';

async function postJson<T>(path: string): Promise<T> {
  const res = await fetch(sbApi(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(String((data as { detail?: string }).detail || 'Request failed'));
  }
  return data as T;
}

export async function fetchUWStatus(): Promise<UWStatusResponse> {
  const res = await fetch(`${API_BASE}/tools/uw/status`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(String((data as { detail?: string }).detail || 'Failed to load Finnhub status'));
  }
  return data as UWStatusResponse;
}

export function fetchCongressTrades() {
  return postJson<UWCongressResponse>('/api/tools/uw/congress');
}

export function fetchInsiderTransactions() {
  return postJson<UWInsiderResponse>('/api/tools/uw/darkpool');
}
