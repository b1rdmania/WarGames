export class PearApiError extends Error {
  endpoint: string;
  status: number;
  body: unknown;

  constructor(args: { endpoint: string; status: number; message: string; body?: unknown }) {
    super(args.message);
    this.name = 'PearApiError';
    this.endpoint = args.endpoint;
    this.status = args.status;
    this.body = args.body;
  }
}

export async function toPearApiError(res: Response, endpoint: string): Promise<PearApiError> {
  const body = await res.json().catch(() => ({}));
  const message =
    (body as any)?.error ||
    (body as any)?.message ||
    `Request failed (${res.status})`;
  return new PearApiError({ endpoint, status: res.status, message, body });
}

