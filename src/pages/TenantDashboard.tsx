import '../fonts.css';
import { useUser } from '@civic/auth-web3/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, Calendar, FileText, Shield } from 'lucide-react';

const TenantDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      <DashboardHeader title="Tenant Dashboard" userRole="tenant" />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
          >
            Welcome back, {user.name || user.email}!
          </h2>
          <p
            className="text-lg text-neutral-600 max-w-2xl"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Find your perfect rental property with verified listings and secure applications.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-3">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle style={{ fontFamily: '"Outfit", sans-serif' }}>
                Search Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-neutral-600 mb-4">
                Browse verified rental properties in your area
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Start Searching
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-3">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle style={{ fontFamily: '"Outfit", sans-serif' }}>
                My Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-neutral-600 mb-4">
                Track your rental applications and status
              </p>
              <Button variant="outline" className="w-full">
                View Applications
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-3">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle style={{ fontFamily: '"Outfit", sans-serif' }}>
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center mb-4 text-green-600">
                <Shield className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Verified with Civic</span>
              </div>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: '"Outfit", sans-serif' }}>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Account created</p>
                  <p className="text-sm text-neutral-600">
                    Your tenant profile has been verified with Civic Auth
                  </p>
                </div>
                <span className="text-sm text-neutral-500">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TenantDashboard;
