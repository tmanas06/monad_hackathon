import '../fonts.css';
import { useUser } from '@civic/auth-web3/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Building, Users, DollarSign, FileText, Shield, Lock, CheckCircle, Home, Sparkles, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { userHasWallet } from '@civic/auth-web3';

const LandlordDashboard = () => {
  const userContext = useUser();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const walletAddress = userHasWallet(userContext) ? userContext.ethereum.address : null;

  useEffect(() => {
    if (!userContext.user) {
      navigate('/');
      return;
    }

    const initializeUser = async () => {
      try {
        if (!userHasWallet(userContext)) {
          await userContext.createWallet?.();
          return;
        }
        const userRef = doc(db, "users", walletAddress!);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            walletAddress,
            name: userContext.user?.name || "",
            email: userContext.user?.email || "",
            isVerified: false,
            roles: ["landlord"],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          setIsVerified(false);
        } else {
          setIsVerified(userSnap.data()?.isVerified ?? false);
        }
      } catch (error) {
        setIsVerified(false);
      }
    };

    if (walletAddress) {
      initializeUser();
    }
  }, [userContext, walletAddress, navigate]);

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
      alert("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const switchToTenantDashboard = () => {
    navigate('/tenants');
  };

  if (!userContext.user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f4' }}>
      <DashboardHeader title="Landlord Dashboard" userRole="landlord" />
      
      {/* Subtle floating elements */}
      <div className="absolute top-32 right-24 w-24 h-24 opacity-5 pointer-events-none">
        <div className="w-full h-full rounded-full bg-slate-400"></div>
      </div>
      <div className="absolute top-64 left-16 w-16 h-16 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-slate-400 rounded-2xl transform rotate-45"></div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-16 relative">
        <div className="mb-20 flex flex-col lg:flex-row lg:justify-between lg:items-start">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-600" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Property Management
              </span>
            </div>
            <h1 style={{
              fontFamily: '"Cyber", sans-serif',
              fontSize: '5rem',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#1e293b',
              marginBottom: '2rem',
              letterSpacing: '-0.02em'
            }}>
              Landlord<br />
              Dashboard
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>
              {isVerified === true
                ? "Manage your properties and connect with verified tenants."
                : "Complete verification to unlock all landlord features."}
            </p>
          </div>
          
          {/* Modern Role Switcher */}
          <div className="mt-12 lg:mt-0">
            <div className="p-8 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <h3 className="text-lg font-semibold mb-6 text-slate-800" style={{ fontFamily: '"Cyber", sans-serif' }}>
                Switch Dashboard
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5" />
                    <span className="font-medium">Landlord</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <button
                  onClick={switchToTenantDashboard}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Tenant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {isVerified === false ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-3xl w-full p-16 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-xl">
              <div className="text-center">
                <div className="mb-12">
                  <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-slate-900 flex items-center justify-center shadow-lg">
                    <Lock className="h-16 w-16 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold mb-6 text-slate-900" style={{ fontFamily: '"Cyber", sans-serif' }}>
                    Verify to Start Listing
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl mx-auto" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    To keep tenants safe, we require landlord verification. Complete this one-time process to unlock all features.
                  </p>
                </div>
                
                {/* Current verification method */}
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Current Verification Method
                  </h3>
                  <Button
                    size="lg"
                    onClick={() => setShowVerificationDialog(true)}
                    className="px-12 py-4 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 hover:shadow-lg"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    <Shield className="h-6 w-6 mr-3" />
                    Verify with Aadhar
                  </Button>
                </div>
                
                {/* Future Civic Pass emphasis */}
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-slate-600" />
                    <h3 className="text-2xl font-bold text-slate-800" style={{ fontFamily: '"Cyber", sans-serif' }}>
                      Coming Soon: Civic Pass
                    </h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Enhanced verification with video selfie, government ID validation, and blockchain-based identity credentials for maximum security and trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isVerified === true ? (
          <>
            {/* Verified Banner */}
            <div className="mb-16 p-8 rounded-2xl border border-green-200 bg-green-50/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <div>
                  <h3 className="text-xl font-semibold text-green-800" style={{ fontFamily: '"Cyber", sans-serif' }}>
                    Identity Verified
                  </h3>
                  <p className="text-green-700" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    All landlord features are now unlocked
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="p-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-2" style={{ fontFamily: '"Outfit", sans-serif' }}>Properties</p>
                    <p className="text-4xl font-bold text-slate-900">0</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-2" style={{ fontFamily: '"Outfit", sans-serif' }}>Active Tenants</p>
                    <p className="text-4xl font-bold text-slate-900">0</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-2" style={{ fontFamily: '"Outfit", sans-serif' }}>Revenue</p>
                    <p className="text-4xl font-bold text-slate-900">₹0</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-2" style={{ fontFamily: '"Outfit", sans-serif' }}>Applications</p>
                    <p className="text-4xl font-bold text-slate-900">0</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="group cursor-pointer">
                <div className="p-10 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                      <Plus className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-800" style={{ fontFamily: '"Cyber", sans-serif' }}>
                      List Property
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>
                      Add your first property and start connecting with verified tenants
                    </p>
                    <Button className="w-full rounded-2xl py-3 bg-slate-900 hover:bg-slate-800 text-white" style={{ fontFamily: '"Outfit", sans-serif' }}>
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="p-10 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-800" style={{ fontFamily: '"Cyber", sans-serif' }}>
                      Applications
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>
                      Review and manage tenant applications for your properties
                    </p>
                    <Button variant="outline" className="w-full rounded-2xl py-3 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                      View All
                    </Button>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="p-10 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-800" style={{ fontFamily: '"Cyber", sans-serif' }}>
                      Analytics
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>
                      Track property performance and revenue insights
                    </p>
                    <Button variant="outline" className="w-full rounded-2xl py-3 border-blue-300 text-blue-700 hover:bg-blue-50">
                      View Reports
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-900 animate-pulse"></div>
              <p className="text-slate-600 text-lg" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Loading verification status...
              </p>
            </div>
          </div>
        )}

        {/* Verification Dialog */}
        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="max-w-lg rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl mb-4" style={{ 
                fontFamily: '"Cyber", sans-serif',
                color: '#1e293b'
              }}>
                Verify with Aadhar
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 p-6">
              <div>
                <label className="text-base font-medium mb-3 block text-slate-700" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  Aadhar Number
                </label>
                <Input
                  type="text"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="Enter 12-digit Aadhar number"
                  className="w-full rounded-2xl border-slate-200 p-4 text-lg"
                />
                <p className="text-sm text-slate-500 mt-3">
                  Your Aadhar number will be securely hashed and stored. We never store the actual number.
                </p>
              </div>
              <Button
                onClick={handleAadharVerification}
                disabled={aadharNumber.length !== 12 || isVerifying}
                className="w-full rounded-2xl py-4 text-lg bg-slate-900 hover:bg-slate-800 text-white"
                style={{ fontFamily: '"Outfit", sans-serif' }}
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

export default LandlordDashboard;
