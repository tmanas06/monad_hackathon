import '../fonts.css';
import { Button } from '@/components/ui/button';
import { Home, Search, Wallet, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';
import WalletConnect from './WalletConnect';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-center pt-8 z-50">
      <div
        className="
          max-w-5xl w-full mx-6
          bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-black/80
          rounded-full
          shadow-2xl
          px-8 py-3
          flex items-center justify-between
          border border-purple-600/30
          backdrop-blur-md
          relative
        "
        style={{
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        {/* Optional: Subtle grid overlay */}
        <div className="absolute inset-0 rounded-full opacity-10 pointer-events-none bg-[url('/grid-pattern.svg')] bg-repeat bg-center" />

        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-r from-purple-500 to-teal-400 rounded-full p-2 flex items-center justify-center transition group-hover:scale-105 group-hover:shadow-purple-400/20 group-hover:shadow-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: '"Cyber", sans-serif' }}
            >
              MonadRent
            </span>
            <span className="text-xs text-purple-300/80 font-medium flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Powered by Monad
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 ml-12">
          <a
            href="#about"
            className="text-lg text-neutral-200 hover:text-white transition font-medium"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="outline"
            className="hidden sm:flex items-center space-x-2 border-purple-400/30 bg-transparent text-white hover:bg-purple-400/20 hover:text-white hover:border-purple-400/50"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <div className="flex items-center gap-2 bg-purple-900/30 rounded-full px-2 py-1 border border-purple-400/20">
            <Wallet className="h-4 w-4 text-purple-300" />
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
