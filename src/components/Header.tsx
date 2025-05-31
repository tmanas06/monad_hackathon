import '../fonts.css';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#FAF6F2]/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-black rounded-full p-2 flex items-center justify-center transition group-hover:scale-105">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
          >
            RentRight
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 ml-12">
          <a
            href="#properties"
            className="text-lg text-neutral-800 hover:text-black transition font-medium"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Properties
          </a>
          {/* <a
            href="#verification"
            className="text-lg text-neutral-800 hover:text-black transition font-medium"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Verification
          </a> */}
          <a
            href="#about"
            className="text-lg text-neutral-800 hover:text-black transition font-medium"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-neutral-300 text-neutral-800 hover:bg-neutral-100 px-5 py-2 font-medium hidden md:flex"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
