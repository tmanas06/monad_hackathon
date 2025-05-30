
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useCallback } from 'react';
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

const WalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [phantomConnected, setPhantomConnected] = useState(false);
  const [phantomPublicKey, setPhantomPublicKey] = useState<string | null>(null);
  const { toast } = useToast();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const copyPhantomAddress = () => {
    if (phantomPublicKey) {
      navigator.clipboard.writeText(phantomPublicKey);
      toast({
        title: "Address copied!",
        description: "Phantom address copied to clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
      setPhantomConnected(true);
      setPhantomPublicKey(response.publicKey.toString());
      
      toast({
        title: "Phantom Connected",
        description: "Successfully connected to Phantom wallet",
      });
      setIsOpen(false);
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
        setPhantomConnected(false);
        setPhantomPublicKey(null);
        
        toast({
          title: "Phantom Disconnected",
          description: "Successfully disconnected from Phantom wallet",
        });
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom:', error);
    }
  }, [toast]);

  // If either wallet is connected, show the connected state
  if ((isConnected && address) || (phantomConnected && phantomPublicKey)) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {address ? formatAddress(address) : formatAddress(phantomPublicKey!)}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Wallet Connected
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {address && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Ethereum Wallet</p>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-mono text-sm">{formatAddress(address)}</span>
                  <Button size="sm" variant="ghost" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            {phantomPublicKey && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Solana Wallet (Phantom)</p>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-mono text-sm">{formatAddress(phantomPublicKey)}</span>
                  <Button size="sm" variant="ghost" onClick={copyPhantomAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {address && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Etherscan
                </Button>
              )}
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (address) disconnect();
                  if (phantomPublicKey) disconnectPhantom();
                  setIsOpen(false);
                }}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-rent-blue-600 to-rent-green-600 hover:from-rent-blue-700 hover:to-rent-green-700">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* Ethereum wallets from wagmi connectors */}
          {connectors.map((connector) => (
            <Card 
              key={connector.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => {
                connect({ connector });
                setIsOpen(false);
              }}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6" />
                  <span className="font-medium">{connector.name}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </CardContent>
            </Card>
          ))}
          
          {/* Phantom wallet for Solana */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={connectPhantom}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div>
                  <span className="font-medium">Phantom</span>
                  <p className="text-xs text-gray-500">Solana Wallet</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletButton;
