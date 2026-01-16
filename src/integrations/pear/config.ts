export const PEAR_CONFIG = {
  apiUrl: 'https://api.pearprotocol.io',
  clientId: process.env.NEXT_PUBLIC_PEAR_CLIENT_ID || 'HLHackathon1',
  network: process.env.NEXT_PUBLIC_NETWORK || 'mainnet',
} as const;

export const EIP712_DOMAIN = {
  name: 'Pear Protocol',
  version: '1',
  chainId: 999, // HyperEVM
} as const;

export const EIP712_TYPES = {
  Authentication: [
    { name: 'userAddress', type: 'address' },
    { name: 'timestamp', type: 'uint256' },
  ],
} as const;
