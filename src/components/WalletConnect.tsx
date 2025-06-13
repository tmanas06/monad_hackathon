import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2, Home, Building } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const WalletConnect = () => {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (connected && publicKey) {
      const savedRole = localStorage.getItem(`userRole_${publicKey}`);
      if (savedRole) {
        handleRedirection(savedRole as 'tenant' | 'landlord');
      } else {
        setShowRoleDialog(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  const handleRedirection = (role: 'tenant' | 'landlord') => {
    setIsRedirecting(true);
    setTimeout(() => {
      if (location.pathname === '/') {
        navigate(role === 'tenant' ? '/tenants' : '/landlords');
      }
    }, 1000);
  };

  const handleRoleSelection = (role: 'tenant' | 'landlord') => {
    setSelectedRole(role);
    if (publicKey) {
      localStorage.setItem(`userRole_${publicKey}`, role);
    }
    setShowRoleDialog(false);
    handleRedirection(role);
  };

  const handleDisconnect = () => {
    if (publicKey) {
      localStorage.removeItem(`userRole_${publicKey}`);
    }
    setSelectedRole(null);
    setIsRedirecting(false);
    disconnect();
    navigate('/');
  };

  if (isRedirecting && selectedRole) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="text-lg font-medium text-neutral-700">
            Redirecting to {selectedRole} dashboard...
          </span>
        </div>
        <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600" />
        </div>
      </div>
    );
  }

  if (connected && publicKey) {
    return (
      <>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <span className="text-sm text-muted-foreground">Connected:</span>
            <span className="ml-2 font-mono text-sm">
              {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
            </span>
          </div>
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>

        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent className="rounded-3xl border-[5px] border-black shadow-2xl bg-[#FAF6F2] max-w-lg p-0">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="hidden md:flex flex-col items-center justify-center p-8">
                <div className="rounded-full flex items-center justify-center bg-black w-24 h-24">
                  <Home className="h-11 w-11 text-white" />
                </div>
              </div>
              <div className="flex-1 p-8">
                <h2 className="text-3xl font-bold mb-2">Select Your Role</h2>
                <p className="text-base text-gray-600 mb-8">
                  Choose how you want to use this platform.
                </p>
                <div className="flex flex-col gap-6">
                  <button
                    onClick={() => handleRoleSelection('tenant')}
                    className="group flex items-center gap-4 rounded-2xl px-6 py-5 border-2 transition border-transparent bg-white hover:border-purple-600 hover:bg-purple-50 shadow"
                  >
                    <span className="rounded-full flex items-center justify-center bg-purple-600 w-11 h-11">
                      <Home className="h-6 w-6 text-white" />
                    </span>
                    <span>
                      <div className="text-lg font-bold text-gray-900 mb-1">I'm a Tenant</div>
                      <div className="text-sm text-gray-500">Looking for rental properties</div>
                    </span>
                  </button>
                  <button
                    onClick={() => handleRoleSelection('landlord')}
                    className="group flex items-center gap-4 rounded-2xl px-6 py-5 border-2 transition border-transparent bg-white hover:border-blue-600 hover:bg-blue-50 shadow"
                  >
                    <span className="rounded-full flex items-center justify-center bg-blue-600 w-11 h-11">
                      <Building className="h-6 w-6 text-white" />
                    </span>
                    <span>
                      <div className="text-lg font-bold text-gray-900 mb-1">I'm a Landlord</div>
                      <div className="text-sm text-gray-500">Managing rental properties</div>
                    </span>
                  </button>
                </div>
                {selectedRole && (
                  <div className="flex items-center mt-8 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing your {selectedRole} dashboard...
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={connecting}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
    >
      {connecting ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        'Connect Phantom Wallet'
      )}
    </Button>
  );
};

export default WalletConnect;
