
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: 'your-project-id', // Replace with your actual WalletConnect project ID
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
