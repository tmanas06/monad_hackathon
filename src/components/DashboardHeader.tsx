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
      navigate('/my-applications');
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
    <button
      className="flex items-center gap-3 rounded-full bg-black px-6 py-2 shadow-lg focus:outline-none transition hover:scale-[1.03]"
      style={{
        fontFamily: '"Outfit", sans-serif',
        minHeight: '48px',
        minWidth: '220px',
      }}
    >
      <div className="bg-gradient-to-br from-[#e6e1d9] to-[#f8f6f1] w-9 h-9 rounded-full flex items-center justify-center shadow">
        <User className="h-5 w-5 text-black/80" />
      </div>
      <span className="text-white font-semibold text-base truncate" style={{fontFamily: '"Outfit", sans-serif'}}>
        {user?.name || user?.email || 'User'}
      </span>
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    align="end"
    className="w-72 bg-black text-white rounded-2xl shadow-2xl p-0 border-0"
    style={{fontFamily: '"Outfit", sans-serif'}}
  >
    <div className="flex flex-col space-y-1 px-6 pt-5 pb-2">
      <p className="text-lg font-bold truncate">{user?.name || user?.email}</p>
      <p className="text-xs text-[#e6e1d9] capitalize">
        {userRole} Account
      </p>
    </div>
    <DropdownMenuSeparator className="bg-[#232323]" />
    <DropdownMenuItem
      onClick={handleSwitchDashboard}
      className="flex items-center gap-3 px-6 py-3 text-base hover:bg-[#232323] transition"
    >
      <Building className="h-5 w-5 text-white" />
      Switch to {userRole === 'tenant' ? 'Landlord' : 'Tenant'} Dashboard
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={handleMyApplications}
      className="flex items-center gap-3 px-6 py-3 text-base hover:bg-[#232323] transition"
    >
      <FileText className="h-5 w-5 text-white" />
      My Applications
    </DropdownMenuItem>
    <DropdownMenuSeparator className="bg-[#232323]" />
    <DropdownMenuItem
      onClick={handleSettings}
      className="flex items-center gap-3 px-6 py-3 text-base hover:bg-[#232323] transition"
    >
      <Settings className="h-5 w-5 text-white" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator className="bg-[#232323]" />
    <DropdownMenuItem
      onClick={signOut}
      className="flex items-center gap-3 px-6 py-3 text-base text-red-500 hover:bg-[#232323] transition"
    >
      <LogOut className="h-5 w-5 text-red-500" />
      Sign Out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

      </div>
    </header>
  );
};

export default DashboardHeader;
