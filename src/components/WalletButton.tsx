
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const WalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
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

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {formatAddress(address)}
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-mono text-sm">{formatAddress(address)}</span>
              <Button size="sm" variant="ghost" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Etherscan
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  disconnect();
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletButton;
