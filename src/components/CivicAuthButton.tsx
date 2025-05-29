
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, CheckCircle, User, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CivicAuthButtonProps {
  onAuthSuccess: (role: 'tenant' | 'landlord') => void;
}

const CivicAuthButton = ({ onAuthSuccess }: CivicAuthButtonProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleCivicAuth = async (role: 'tenant' | 'landlord') => {
    setIsVerifying(true);
    
    // Simulate Civic Auth verification process
    // In real implementation, this would integrate with @civic/auth-web3
    try {
      console.log('Initiating Civic Auth verification for role:', role);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification
      console.log('Civic Auth verification successful');
      onAuthSuccess(role);
    } catch (error) {
      console.error('Civic Auth verification failed:', error);
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
          <p className="text-center text-gray-600 mb-6">
            Select your role to start the Civic Auth verification process
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-rent-blue-300"
              onClick={() => handleCivicAuth('tenant')}
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
                  Identity Verification
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-rent-green-300"
              onClick={() => handleCivicAuth('landlord')}
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
                  Property Verification
                </div>
              </CardContent>
            </Card>
          </div>

          {isVerifying && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rent-blue-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Verifying with Civic Auth...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CivicAuthButton;
