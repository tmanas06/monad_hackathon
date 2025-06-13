import '../fonts.css';
import WalletConnect from './WalletConnect';
import { Wallet } from 'lucide-react'; // or use a Solana logo SVG if available

const Hero = () => {
  return (
    <section
      className="relative flex items-center justify-center min-h-screen w-full px-6 md:px-12 text-center"
      style={{
        background: `radial-gradient(ellipse at center, #1A1A2E 0%, #0F0F24 60%, #0A0A1A 100%)`,
      }}
    >
      {/* Optional animated particles or grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 pt-20">
        {/* Brand with Solana theme */}
        <div className="flex items-center gap-2 uppercase text-sm tracking-[0.15em] text-purple-300 mb-2">
          <span>MonadRent</span>
          <span className="text-xs bg-purple-900/50 px-2 py-1 rounded-full">Powered by Solana</span>
        </div>

        {/* Accent line in Solana color */}
        <div className="h-[2px] w-16 bg-gradient-to-r from-purple-600 to-teal-300 mb-4"></div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-wide text-white"
          style={{ fontFamily: '"Cyber"' }}
        >
          Trusted Rentals,
          <br />
          <span className="inline-block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
            Web3-Verified
          </span>
        </h1>

        {/* Subtext with Web3/Solana messaging */}
        <p
          className="text-lg md:text-xl text-neutral-300 max-w-xl mt-4"
          style={{ fontFamily: '"Outfit", sans-serif', lineHeight: '1.7' }}
        >
          Secure, fast, and transparent rental experiences powered by Monad blockchain.
          <br />
          Connect your wallet to get started.
        </p>

        {/* Web3 connect wallet button */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <WalletConnect />
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Wallet className="h-4 w-4" />
            <span>Supported wallets: Phantom, Solflare, Backpack</span>
          </div>
        </div>

        {/* Optional: Solana blockchain stats or animation */}
        <div className="mt-12 text-xs text-neutral-500">
          <span className="inline-block px-2 py-1 rounded bg-purple-900/20 text-purple-300">
            Fast. Secure. Decentralized.
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
