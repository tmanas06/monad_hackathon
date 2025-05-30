
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    // Removed WalletConnect temporarily to fix loading issues
    // To re-enable, get a proper project ID from https://cloud.walletconnect.com/
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
