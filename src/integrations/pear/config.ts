export const PEAR_CONFIG = {
  apiUrl: 'https://hl-v2.pearprotocol.io',
  clientId: process.env.NEXT_PUBLIC_PEAR_CLIENT_ID || 'war-markets',
  network: process.env.NEXT_PUBLIC_NETWORK || 'mainnet',
} as const;
