import '../fonts.css';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';
import CivicAuthButton from './CivicAuthButton';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-center pt-8 z-50">
      <div
        className="
          max-w-5xl w-full mx-6
          bg-black/80
          rounded-full
          shadow-2xl
          px-8 py-3
          flex items-center justify-between
          border border-neutral-700
          backdrop-blur-md
        "
        style={{
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-white rounded-full p-2 flex items-center justify-center transition group-hover:scale-105">
            <Home className="h-6 w-6 text-black" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight text-white"
            style={{ fontFamily: '"Cyber", sans-serif' }}
          >
            RentRight
          </span>
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
            className="hidden sm:flex items-center space-x-2 border-neutral-600 bg-transparent text-white hover:bg-white hover:text-black"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <CivicAuthButton
            className="bg-[#1ed760] hover:bg-[#19b955] text-white font-semibold rounded-full px-6 py-3"
            buttonText="Get Started"
            signedInText="Get Started"
            signingInText="Getting Started..."
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
