/**
 * Simple Avalanche C-Chain wallet connect via injected provider (MetaMask, Core, etc.).
 * Chain ID: 43114 (0xa86a)
 */

const AVALANCHE_C_CHAIN_ID = '0xa86a'; // 43114

export interface WalletState {
  address: string | null;
  chainId: string | null;
  isAvalanche: boolean;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export async function connectAvalancheWallet(): Promise<WalletState> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found. Install MetaMask, Core, or another Web3 wallet.');
  }

  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
    params: [],
  })) as string[];

  if (!accounts?.length) {
    throw new Error('No account connected.');
  }

  let chainId = (await window.ethereum.request({
    method: 'eth_chainId',
    params: [],
  })) as string;

  if (chainId !== AVALANCHE_C_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_C_CHAIN_ID }],
      });
      chainId = AVALANCHE_C_CHAIN_ID;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('wallet_addEthereumChain') || msg.includes('Unrecognized chain')) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: AVALANCHE_C_CHAIN_ID,
              chainName: 'Avalanche C-Chain',
              nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
              rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://snowtrace.io'],
            },
          ],
        });
        const newChainId = (await window.ethereum.request({
          method: 'eth_chainId',
          params: [],
        })) as string;
        return {
          address: accounts[0],
          chainId: newChainId,
          isAvalanche: newChainId === AVALANCHE_C_CHAIN_ID,
        };
      }
      throw new Error('Please switch your wallet to Avalanche C-Chain.');
    }
  }

  return {
    address: accounts[0],
    chainId,
    isAvalanche: chainId === AVALANCHE_C_CHAIN_ID,
  };
}

export function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
