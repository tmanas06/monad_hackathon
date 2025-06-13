/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  userRole: 'landlord' | 'tenant' | null;
  setUserRole: (role: 'landlord' | 'tenant') => void;
  hasCompletedKYC: boolean;
  setHasCompletedKYC: (completed: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'landlord' | 'tenant' | null>(null);
  const [hasCompletedKYC, setHasCompletedKYC] = useState(false);

  const connect = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      // Check if Phantom wallet is available
      const { phantom } = window as any;
      
      if (phantom?.ethereum) {
        const provider = phantom.ethereum;
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          setPublicKey(accounts[0]);
          setConnected(true);
          console.log('Connected to Phantom wallet:', accounts[0]);
        }
      } else {
        alert('Phantom wallet not found! Please install Phantom wallet.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setPublicKey(null);
    setUserRole(null);
    setHasCompletedKYC(false);
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { phantom } = window as any;
        if (phantom?.ethereum) {
          const accounts = await phantom.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setPublicKey(accounts[0]);
            setConnected(true);
          }
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  const value = {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
    userRole,
    setUserRole,
    hasCompletedKYC,
    setHasCompletedKYC,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};