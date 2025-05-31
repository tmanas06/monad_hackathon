import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Shield, User, Building, Loader2,Home } from 'lucide-react';
import { useUser } from '@civic/auth-web3/react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const ACCENT = "#FF6A2B"; // Orange accent

const CivicAuthButton = () => {
  const [userRole, setUserRole] = useState<'tenant' | 'landlord' | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord' | null>(null);
  const { user, signIn, signOut } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Load saved role and redirect if necessary
  useEffect(() => {
    if (user) {
      const savedRole = localStorage.getItem(`userRole_${user.id || user.email}`);
      if (savedRole) {
        setUserRole(savedRole as 'tenant' | 'landlord');
        if (location.pathname === '/') {
          setIsRedirecting(true);
          setTimeout(() => {
            if (savedRole === 'tenant') {
              navigate('/tenants');
            } else {
              navigate('/landlords');
            }
          }, 1000);
        }
      } else {
        setShowRoleDialog(true);
      }
    }
  }, [user, location.pathname, navigate]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (error) {
      console.log('Sign-in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRoleSelection = (role: 'tenant' | 'landlord') => {
    setSelectedRole(role);
    setUserRole(role);
    setShowRoleDialog(false);
    setIsRedirecting(true);

    if (user) {
      localStorage.setItem(`userRole_${user.id || user.email}`, role);
    }

    toast({
      title: "Role selected!",
      description: `You're now verified as a ${role} with Civic Auth`,
    });

    setTimeout(() => {
      if (role === 'tenant') {
        navigate('/tenants');
      } else {
        navigate('/landlords');
      }
    }, 1300);
  };

  const handleSignOut = () => {
    if (user) {
      localStorage.removeItem(`userRole_${user.id || user.email}`);
    }
    setUserRole(null);
    setIsRedirecting(false);
    setSelectedRole(null);
    signOut();
    navigate('/');
  };

  // Show redirecting state when user has role and is being redirected
  if (isRedirecting && userRole) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span 
            className="text-lg font-medium text-neutral-700"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Redirecting to your {selectedRole || userRole} dashboard...
          </span>
        </div>
        <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full" style={{
            background: `linear-gradient(90deg, ${ACCENT} 0%, #181818 100%)`
          }}></div>
        </div>
      </div>
    );
  }

  // User not signed in
  if (!user) {
    return (
      <Button
        size="lg"
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="rounded-full px-8 py-4 bg-black text-white hover:bg-neutral-800 transition disabled:opacity-70"
        style={{ fontFamily: '"Outfit", sans-serif' }}
      >
        {isSigningIn ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Signing in with Civic...
          </>
        ) : (
          <>
            <Shield className="h-5 w-5 mr-2" />
            Get Verified with Civic
          </>
        )}
      </Button>
    );
  }

  // --- THEMED ROLE SELECTION DIALOG ---
  if (user && !userRole) {
    return (
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
       <DialogContent className="rounded-3xl border-[5px] border-black shadow-2xl bg-[#FAF6F2] max-w-lg p-0">
  <div className="flex flex-col md:flex-row items-stretch">
    {/* Left: Black circle with white house icon and RentRight name */}
    <div className="hidden md:flex flex-col items-center justify-center p-8 relative">
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          background: 'black',
          width: 100,
          height: 100,
        }}
      >
        {/* RentRight house icon (SVG, matches your logo) */}
         <div className="bg-black rounded-full p-2 flex items-center justify-center transition group-hover:scale-105">
            <Home className="h-11 w-11 text-white" />
          </div>
      </div>
      <span
        className="mt-4 text-2xl font-bold tracking-tight text-black"
        style={{ fontFamily: '"Cyber", sans-serif', letterSpacing: '0.03em' }}
      >
        RentRight
      </span>
    </div>
    {/* Right: Content */}
    <div className="flex-1 p-8">
      <h2
        className="text-3xl font-bold mb-2 flex items-center gap-3"
        style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
      >
        {/* Inline house icon for mobile */}
        <span className="inline-block md:hidden align-middle mr-2">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="black"/>
            <rect x="17" y="26" width="14" height="8" rx="2" fill="white"/>
            <path d="M12 27L24 16L36 27" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
          </svg>
        </span>
        Select Your Role
      </h2>
      <p className="text-base text-gray-600 mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>
        Choose how you want to use RentRight. This helps us personalize your experience.
      </p>
      <div className="flex flex-col gap-6">
        <button
          onClick={() => handleRoleSelection('tenant')}
          disabled={selectedRole === 'tenant'}
          className={`
            group flex items-center gap-4 rounded-2xl px-6 py-5 border-2 transition
            ${selectedRole === 'tenant'
              ? 'border-[#FF6A2B] bg-orange-50 shadow-xl'
              : 'border-transparent bg-white hover:border-[#FF6A2B] hover:bg-orange-50 shadow'}
          `}
          style={{ fontFamily: '"Outfit", sans-serif' }}
        >
          <span
            className="rounded-full flex items-center justify-center"
            style={{
              background: '#FF6A2B',
              width: 44,
              height: 44,
            }}
          >
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 16-4 16 0"/>
            </svg>
          </span>
          <span>
            <div className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: '"Cyber", sans-serif' }}>
              I'm a Tenant
            </div>
            <div className="text-sm text-gray-500">Looking for a place to rent</div>
          </span>
        </button>

        <button
          onClick={() => handleRoleSelection('landlord')}
          disabled={selectedRole === 'landlord'}
          className={`
            group flex items-center gap-4 rounded-2xl px-6 py-5 border-2 transition
            ${selectedRole === 'landlord'
              ? 'border-[#FF6A2B] bg-orange-50 shadow-xl'
              : 'border-transparent bg-white hover:border-[#FF6A2B] hover:bg-orange-50 shadow'}
          `}
          style={{ fontFamily: '"Outfit", sans-serif' }}
        >
          <span
            className="rounded-full flex items-center justify-center"
            style={{
              background: '#FF6A2B',
              width: 44,
              height: 44,
            }}
          >
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round">
              <rect x="6" y="10" width="12" height="8" rx="2"/>
              <path d="M6 14L12 8L18 14"/>
            </svg>
          </span>
          <span>
            <div className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: '"Cyber", sans-serif' }}>
              I'm a Landlord
            </div>
            <div className="text-sm text-gray-500">I have properties to rent</div>
          </span>
        </button>
      </div>
      {selectedRole && (
        <div className="flex items-center mt-8 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Preparing your {selectedRole} dashboard...
        </div>
      )}
    </div>
  </div>
</DialogContent>



      </Dialog>
    );
  }

  // User has role but shouldn't see this on homepage - they should be redirected
  return null;
};

export default CivicAuthButton;
