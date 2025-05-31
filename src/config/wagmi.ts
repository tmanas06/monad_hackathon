
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';
import { walletConnect, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "RentRight",
        url: "https://rentright.com",
      },
    }),
    walletConnect({
projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
      metadata: {
        name: 'RentRight',
        description: 'Blockchain-based rental platform',
        url: 'https://rentright.com',
        icons: ['https://rentright.com/icon.png'],
      },
    }),
    // Note: Phantom is primarily for Solana, but we'll add support for it
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
