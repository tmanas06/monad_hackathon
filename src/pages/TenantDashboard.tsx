import '../fonts.css';
import { useUser } from '@civic/auth-web3/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, FileText, Shield, Lock, CheckCircle, Home, Building } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { userHasWallet } from '@civic/auth-web3';

const TenantDashboard = () => {
  const userContext = useUser();
  const { user } = userContext;
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const walletAddress = userHasWallet(userContext) ? userContext.ethereum.address : null;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const initializeUser = async () => {
      try {
        if (!walletAddress) return;

        const userRef = doc(db, "users", walletAddress);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            walletAddress,
            name: user?.name || "",
            email: user?.email || "",
            isVerified: false,
            roles: ["tenant"],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          setIsVerified(false);
        } else {
          setIsVerified(userSnap.data()?.isVerified ?? false);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setIsVerified(false);
      }
    };

    initializeUser();
  }, [user, walletAddress, navigate]);

  const handleAadharVerification = async () => {
    if (!walletAddress || aadharNumber.length !== 12) return;
    
    setIsVerifying(true);
    try {
      const hashHex = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(aadharNumber)
      ).then(hash => {
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });

      const userRef = doc(db, "users", walletAddress);
      await setDoc(userRef, {
        aadharHash: hashHex,
        isVerified: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setIsVerified(true);
      setShowVerificationDialog(false);
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const switchToLandlordDashboard = () => {
    if (isVerified) {
      navigate('/landlords');
    } else {
      alert("Verify your identity first to access landlord features");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      <DashboardHeader title="Tenant Dashboard" userRole="tenant" />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
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
              {isVerified === true 
                ? "Find your perfect rental property with verified listings."
                : "Browse properties now, verify to apply."}
            </p>
          </div>

          <Card className="w-64">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Switch Dashboard
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-orange-50 border-orange-300"
                  disabled
                >
                  <Home className="h-4 w-4 mr-2" />
                  Tenant (Current)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={switchToLandlordDashboard}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Landlord Dashboard
                  {isVerified && <CheckCircle className="h-4 w-4 ml-auto text-green-600" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {isVerified === false ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-2xl w-full border-2 border-orange-200 shadow-xl bg-white">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ background: '#FF6A2B' }}
                  >
                    <Lock className="h-12 w-12 text-white" />
                  </div>
                  <h3
                    className="text-3xl font-bold mb-4"
                    style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
                  >
                    🔒 Verify to Apply for Rentals
                  </h3>
                  <p
                    className="text-lg text-neutral-600 mb-6 leading-relaxed"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Verify with Aadhar to submit rental applications and contact landlords.
                  </p>
                </div>
                
                <Button
                  size="lg"
                  onClick={() => setShowVerificationDialog(true)}
                  className="w-full max-w-md mx-auto rounded-full px-8 py-4 text-lg font-semibold"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    background: '#FF6A2B'
                  }}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Verify with Aadhar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : isVerified === true ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    ✅ Identity Verified
                  </p>
                  <p className="text-sm text-green-600">
                    You can now apply for properties and contact landlords.
                  </p>
                </div>
              </div>
            </div>

            {/* Tenant-specific content */}
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
                    Browse verified rental properties
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
                    Track your rental applications
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
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-neutral-600" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Loading verification status...
              </p>
            </div>
          </div>
        )}

        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center" style={{ fontFamily: '"Cyber", sans-serif' }}>
                Verify with Aadhar
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  Aadhar Number
                </label>
                <Input
                  type="text"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="Enter 12-digit Aadhar number"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Securely hashed and stored. We never store the actual number.
                </p>
              </div>
              <Button
                onClick={handleAadharVerification}
                disabled={aadharNumber.length !== 12 || isVerifying}
                className="w-full"
                style={{ 
                  background: '#FF6A2B',
                  fontFamily: '"Outfit", sans-serif'
                }}
              >
                {isVerifying ? 'Verifying...' : 'Verify Identity'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TenantDashboard;
