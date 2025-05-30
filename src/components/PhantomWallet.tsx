
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PhantomWallet {
  isPhantom: boolean;
  publicKey: { toString(): string } | null;
  isConnected: boolean;
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomWallet;
    };
  }
}

const PhantomWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const { toast } = useToast();

  const connectPhantom = useCallback(async () => {
    try {
      const { solana } = window.phantom || {};
      
      if (!solana?.isPhantom) {
        toast({
          title: "Phantom not found",
          description: "Please install Phantom wallet extension",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await solana.connect();
      setIsConnected(true);
      setPublicKey(response.publicKey.toString());
      
      toast({
        title: "Phantom Connected",
        description: "Successfully connected to Phantom wallet",
      });
    } catch (error) {
      console.error('Error connecting to Phantom:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to Phantom wallet",
        variant: "destructive",
      });
    }
  }, [toast]);

  const disconnectPhantom = useCallback(async () => {
    try {
      const { solana } = window.phantom || {};
      if (solana) {
        await solana.disconnect();
        setIsConnected(false);
        setPublicKey(null);
        
        toast({
          title: "Phantom Disconnected",
          description: "Successfully disconnected from Phantom wallet",
        });
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom:', error);
    }
  }, [toast]);

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-mono">{publicKey.slice(0, 6)}...{publicKey.slice(-4)}</span>
        </div>
        <Button size="sm" variant="outline" onClick={disconnectPhantom}>
          Disconnect Phantom
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectPhantom}
      className="bg-purple-600 hover:bg-purple-700"
    >
      Connect Phantom (Solana)
    </Button>
  );
};

export default PhantomWallet;
