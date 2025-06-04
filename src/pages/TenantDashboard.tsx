/* eslint-disable @typescript-eslint/no-explicit-any */
import '../fonts.css';
import { useUser } from '@civic/auth-web3/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Shield, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { userHasWallet } from '@civic/auth-web3';
import PropertyCard from '@/components/PropertyCard';

const TenantDashboard = () => {
  const userContext = useUser();
  const { user } = userContext;
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setIsVerified(false);
      }
    };
    initializeUser();
  }, [user, walletAddress, navigate]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const snap = await getDocs(collection(db, "properties"));
        setProperties(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

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

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8f6f1 0%, #f3efe7 100%)' }}>
      <DashboardHeader title="Discover Properties" userRole="tenant" isVerified={isVerified} />

      <main className="max-w-7xl mx-auto px-0 py-0">
        {/* Centered Hero Section with Wallpaper */}
        <section
  className="relative w-full rounded-3xl overflow-hidden shadow-2xl my-12"
  style={{
    minHeight: 420,
    background: "url('/tdash.jpg') center/cover no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>

          {/* Soft black overlay for readability */}
          <div className="absolute inset-0 bg-[#191919]/70" />
          <div className="relative z-10 w-full flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-[#f5f1ed]" />
              <span className="text-base uppercase tracking-widest text-[#e6e1d9] font-semibold">Luxury Rentals</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
              style={{
                fontFamily: '"Cyber", serif',
                color: "#fff",
                textShadow: "0 4px 24px rgba(0,0,0,0.18)"
              }}
            >
              Find your perfect <span className="italic font-light text-[#f5f1ed]">Sanctuary</span>
            </h1>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <span className="px-3 py-1 rounded-full bg-[#232323]/80 text-[#f5f1ed] text-xs font-medium">Mountain Retreat</span>
              <span className="px-3 py-1 rounded-full bg-[#232323]/80 text-[#f5f1ed] text-xs font-medium">Cozy Cottage</span>
              <span className="px-3 py-1 rounded-full bg-[#232323]/80 text-[#f5f1ed] text-xs font-medium">Urban Luxe</span>
              <span className="px-3 py-1 rounded-full bg-[#232323]/80 text-[#f5f1ed] text-xs font-medium">Nature Escape</span>
            </div>
            <p className="text-lg text-[#f5f1ed] font-light max-w-2xl mx-auto mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>
              Curated homes, panoramic views, and seamless application—find your next sanctuary.
            </p>
            <Button
              className="bg-[#181818] hover:bg-[#222] text-[#f5f1ed] px-8 py-3 rounded-full font-semibold shadow-lg transition text-lg"
              style={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '0.03em' }}
              onClick={() => {
                const el = document.getElementById("featured-properties");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Browse Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Elegant Verification Status */}
        {isVerified !== null && (
          <section className="mb-16">
            <div className="max-w-2xl mx-auto">
              {isVerified ? (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f5f1ed] to-[#e6e1d9] border border-neutral-200/70 p-8 shadow-xl backdrop-blur-sm">
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#181818] flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                        Identity Verified
                      </h3>
                      <p className="text-neutral-700">You can apply for any property instantly.</p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f5f1ed] to-[#e6e1d9] border border-neutral-200/70 p-8 shadow-xl backdrop-blur-sm">
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#181818] flex items-center justify-center shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                        Unlock Full Access
                      </h3>
                      <p className="text-neutral-700 mb-2">
                        Verify your identity to apply for properties and contact landlords.
                      </p>
                      <Button
                        onClick={() => setShowVerificationDialog(true)}
                        className="bg-[#181818] hover:bg-[#222] text-[#f5f1ed] px-6 py-2 rounded-full font-medium shadow transition"
                        style={{ fontFamily: '"Outfit", sans-serif' }}
                      >
                        Verify Identity
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Properties Section */}
        <section id="featured-properties">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: '"Cyber", sans-serif', color: '#1a1a1a' }}
              >
                Featured Properties
              </h2>
              <p className="text-neutral-600" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Handpicked residences for exceptional living experiences
              </p>
            </div>
            <div className="text-sm text-neutral-500">
              {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Available
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neutral-200 to-neutral-300 animate-pulse"></div>
                <p className="text-neutral-500" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  Loading exceptional properties...
                </p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                <Shield className="h-12 w-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2" style={{ fontFamily: '"Cyber", sans-serif' }}>
                No Properties Available
              </h3>
              <p className="text-neutral-500" style={{ fontFamily: '"Outfit", sans-serif' }}>
                New properties will be listed soon. Check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.map(property => (
                <div key={property.id} className="group">
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    address={property.address}
                    rent={property.rent}
                    rating={property.rating}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    areaSqft={property.areaSqft}
                    tags={property.tags}
                    photos={property.photos}
                    isAvailable={property.isAvailable}
                    onViewDetails={() => navigate(`/properties/${property.id}`)}
                    showEdit={false}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Verification Dialog */}
        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="max-w-md rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl mb-2" style={{ fontFamily: '"Cyber", sans-serif' }}>
                Identity Verification
              </DialogTitle>
              <p className="text-center text-neutral-600 text-sm" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Secure verification with Aadhar authentication
              </p>
            </DialogHeader>
            <div className="space-y-6 p-6">
              <div>
                <label className="text-sm font-medium mb-3 block text-neutral-700" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  Aadhar Number
                </label>
                <Input
                  type="text"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="Enter 12-digit Aadhar number"
                  className="w-full rounded-xl border-neutral-200 py-3 px-4 text-base"
                />
                <p className="text-xs text-neutral-500 mt-2" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  Your information is encrypted and securely stored. We never store your actual Aadhar number.
                </p>
              </div>
              <Button
                onClick={handleAadharVerification}
                disabled={aadharNumber.length !== 12 || isVerifying}
                className="w-full py-3 rounded-xl bg-[#181818] hover:bg-[#222] text-[#f5f1ed] font-medium transition-all duration-300 shadow-lg"
                style={{ fontFamily: '"Outfit", sans-serif' }}
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Identity
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TenantDashboard;
