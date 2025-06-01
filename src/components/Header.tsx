import '../fonts.css';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';

const Header = () => {
  return (
    <header className="bg-[#FAF6F2]/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-black dark:bg-white rounded-full p-2 flex items-center justify-center transition group-hover:scale-105">
            <Home className="h-6 w-6 text-white dark:text-black" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight dark:text-white"
            style={{ fontFamily: '"Cyber", sans-serif' }}
          >
            RentRight
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 ml-12">
          <a
            href="#properties"
            className="text-lg text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition font-medium"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Properties
          </a>
          <a
            href="#about"
            className="text-lg text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition font-medium"
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
            className="hidden sm:flex items-center space-x-2 border-neutral-300 dark:border-neutral-700 dark:text-white"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button className="bg-rent-green-600 hover:bg-rent-green-700 text-white">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
