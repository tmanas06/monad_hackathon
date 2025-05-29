
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, CheckCircle, User, Building, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';

interface CivicAuthButtonProps {
  onAuthSuccess: (role: 'tenant' | 'landlord') => void;
}

const CivicAuthButton = ({ onAuthSuccess }: CivicAuthButtonProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { isConnected, address } = useAccount();
  const { toast } = useToast();

  const handleCivicAuth = async (role: 'tenant' | 'landlord') => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first to verify with Civic Auth",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      console.log('Initiating Civic Auth verification for role:', role);
      console.log('Connected wallet address:', address);
      
      // Simulate blockchain verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Civic Auth verification successful');
      toast({
        title: "Verification successful!",
        description: `You've been verified as a ${role} using blockchain technology`,
      });
      onAuthSuccess(role);
    } catch (error) {
      console.error('Civic Auth verification failed:', error);
      toast({
        title: "Verification failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setShowRoleSelection(false);
    }
  };

  return (
    <Dialog open={showRoleSelection} onOpenChange={setShowRoleSelection}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-rent-blue-600 to-rent-green-600 hover:from-rent-blue-700 hover:to-rent-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Shield className="h-5 w-5 mr-2" />
          Get Verified with Civic
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Choose Your Role
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          {!isConnected && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Connect your wallet first to proceed with verification</span>
              </div>
            </div>
          )}
          
          <p className="text-center text-gray-600 mb-6">
            Select your role to start the Civic Auth verification process
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <Card 
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-rent-blue-300 ${!isConnected ? 'opacity-50' : ''}`}
              onClick={() => isConnected && handleCivicAuth('tenant')}
            >
              <CardHeader className="text-center pb-3">
                <div className="bg-rent-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-rent-blue-600" />
                </div>
                <CardTitle className="text-lg">I'm a Tenant</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm text-gray-600">
                  Looking for a place to rent
                </p>
                <div className="flex items-center justify-center mt-3 text-sm text-rent-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Blockchain Identity Verification
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-rent-green-300 ${!isConnected ? 'opacity-50' : ''}`}
              onClick={() => isConnected && handleCivicAuth('landlord')}
            >
              <CardHeader className="text-center pb-3">
                <div className="bg-rent-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="h-8 w-8 text-rent-green-600" />
                </div>
                <CardTitle className="text-lg">I'm a Landlord</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm text-gray-600">
                  I have properties to rent
                </p>
                <div className="flex items-center justify-center mt-3 text-sm text-rent-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Property & Identity Verification
                </div>
              </CardContent>
            </Card>
          </div>

          {isVerifying && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rent-blue-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Verifying with Civic Auth and blockchain...</p>
              {address && (
                <p className="text-xs text-gray-500 mt-2">
                  Wallet: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CivicAuthButton;
