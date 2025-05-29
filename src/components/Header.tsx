
import { Button } from '@/components/ui/button';
import { Shield, Home, Search, User } from 'lucide-react';
import WalletButton from './WalletButton';

const Header = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-rent-blue-600 to-rent-green-600 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rent-blue-600 to-rent-green-600 bg-clip-text text-transparent">
              RentRight
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#properties" className="text-gray-600 hover:text-rent-blue-600 transition-colors">
              Properties
            </a>
            <a href="#verification" className="text-gray-600 hover:text-rent-blue-600 transition-colors">
              Verification
            </a>
            <a href="#about" className="text-gray-600 hover:text-rent-blue-600 transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
