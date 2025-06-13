import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Home, User, LogOut, Plus, Eye, MessageSquare, Wallet, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useUser } from '@civic/auth-web3/react';

interface DashboardProps {
  userRole: 'tenant' | 'landlord' | null;
  onLogout: () => void;
}

const Dashboard = ({ userRole, onLogout }: DashboardProps) => {
  const { address, isConnected } = useAccount();
  const { user } = useUser();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleLogout = () => {
    try {
      // Clear any stored user data
      if (user?.id || user?.email) {
        localStorage.removeItem(`userRole_${user.id || user.email}`);
      }
      
      // Call the onLogout callback to handle local state cleanup
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      onLogout(); // Ensure local state is cleared even if there's an error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rent-blue-50 to-rent-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-rent-blue-600 to-rent-green-600 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rent-blue-600 to-rent-green-600 bg-clip-text text-transparent">
                MonadRent
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-rent-green-500 hover:bg-rent-green-600">
                <Shield className="h-3 w-3 mr-1" />
                Verified {userRole}
              </Badge>
              {isConnected && address && (
                <Badge variant="outline" className="font-mono">
                  <Wallet className="h-3 w-3 mr-1" />
                  {formatAddress(address)}
                </Badge>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome to your {userRole} dashboard
          </h2>
          <p className="text-gray-600">
            Your Civic Auth verification is complete and secured on the blockchain. You can now access all platform features.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userRole === 'tenant' ? 'Applications Sent' : 'Properties Listed'}
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userRole === 'tenant' ? '3' : '2'}
              </div>
              <p className="text-xs text-muted-foreground">
                {userRole === 'tenant' ? '+2 from last month' : '+1 from last month'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userRole === 'tenant' ? 'Properties Viewed' : 'Applications Received'}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userRole === 'tenant' ? '12' : '8'}
              </div>
              <p className="text-xs text-muted-foreground">
                {userRole === 'tenant' ? '+5 this week' : '+3 this week'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 unread</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Verification Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userRole === 'tenant' ? (
                <>
                  <Button className="w-full justify-start bg-gradient-to-r from-rent-blue-600 to-rent-green-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Properties
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View My Applications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full justify-start bg-gradient-to-r from-rent-blue-600 to-rent-green-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="h-4 w-4 mr-2" />
                    Manage Properties
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Review Applications
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wallet Connection</span>
                  <Badge className={isConnected ? "bg-rent-green-500" : "bg-gray-500"}>
                    <Wallet className="h-3 w-3 mr-1" />
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                {isConnected && address && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wallet Address</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{formatAddress(address)}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identity Verification</span>
                  <Badge className="bg-rent-green-500">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Civic Auth Status</span>
                  <Badge className="bg-rent-green-500">
                    <Shield className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                {userRole === 'landlord' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Property Ownership</span>
                    <Badge className="bg-rent-green-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Blockchain Verified
                    </Badge>
                  </div>
                )}
                <div className="mt-4 p-3 bg-rent-green-50 rounded-lg border border-rent-green-200">
                  <p className="text-sm text-rent-green-800">
                    🎉 Your verification is complete and secured on the blockchain! You have full access to all RentRight features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
