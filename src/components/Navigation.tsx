
import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';

const Navigation = () => {
  const { userRole, hasCompletedKYC, disconnect } = useWallet();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/help', label: 'Help' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-white hover:text-purple-200 transition-colors">
            MonadRent
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-white hover:text-purple-200 transition-colors ${
                  location.pathname === link.to ? 'border-b-2 border-purple-400' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {userRole && (
            <div className="flex items-center gap-2">
              <Badge variant={userRole === 'landlord' ? 'destructive' : 'default'}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
              {hasCompletedKYC && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  KYC Verified
                </Badge>
              )}
              {!hasCompletedKYC && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  KYC Pending
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <WalletConnect />
          {userRole && (
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-white hover:bg-white/10"
            >
              Switch Role
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;