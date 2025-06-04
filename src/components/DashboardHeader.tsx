import '../fonts.css';
import { Button } from '@/components/ui/button';
import { Home, LogOut, User, Settings, Building, FileText, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@civic/auth-web3/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  title: string;
  userRole: 'tenant' | 'landlord';
  isVerified?: boolean; // pass this from dashboard if you want to show a verified badge
}

const DashboardHeader = ({ title, userRole, isVerified }: DashboardHeaderProps) => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate(`/${userRole}/settings`);
  };

  // Dropdown: Switch Dashboard
  const handleSwitchDashboard = () => {
    if (userRole === 'tenant') {
      navigate('/landlords');
    } else {
      navigate('/tenants');
    }
  };

  // Dropdown: My Applications
  const handleMyApplications = () => {
    if (userRole === 'tenant') {
      navigate('/tenants/applications');
    } else {
      navigate('/landlords/applications');
    }
  };

  return (
    <header className="bg-[#FAF6F2]/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-black rounded-full p-2 flex items-center justify-center transition group-hover:scale-105">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
          >
            RentRight
          </span>
        </Link>

        {/* Dashboard Title */}
        <h1
          className="text-xl font-semibold text-neutral-800 flex items-center gap-2"
          style={{ fontFamily: '"Outfit", sans-serif' }}
        >
          {title}
          {isVerified && (
            <CheckCircle className="h-5 w-5 text-green-600" aria-label="Verified" />
          )}
        </h1>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full border-neutral-300 hover:bg-neutral-100"
              style={{ fontFamily: '"Outfit", sans-serif' }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden md:block font-medium">
                {user?.name || user?.email || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {userRole} Account
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSwitchDashboard}>
              <Building className="mr-2 h-4 w-4" />
              Switch to {userRole === 'tenant' ? 'Landlord' : 'Tenant'} Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMyApplications}>
              <FileText className="mr-2 h-4 w-4" />
              My Applications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
