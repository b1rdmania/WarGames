export const PEAR_CONFIG = {
  apiUrl: 'https://hl-v2.pearprotocol.io',
  // Hackathon: default to the provided Pear hackathon clientId unless overridden.
  clientId: process.env.NEXT_PUBLIC_PEAR_CLIENT_ID || 'HLHackathon1',
  network: process.env.NEXT_PUBLIC_NETWORK || 'mainnet',
} as const;
