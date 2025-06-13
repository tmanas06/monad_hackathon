/* eslint-disable @typescript-eslint/no-explicit-any */
import '../fonts.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Building, Users, FileText, Shield, Lock, CheckCircle, Home, X, Sparkles, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import PropertyCard from '@/components/PropertyCard';
import { uploadFileToIPFS } from "@/utils/pinata";
import { convertIPFSURL } from "@/utils/ipfs";
import SimpleEditor from 'react-simple-wysiwyg';
import { useWallet } from '../contexts/WalletContext';
import { useUser } from '@civic/auth-web3/react';

const TAG_OPTIONS = [
  "family_friendly", "bachelor_friendly", "student_friendly", "work_drive_friendly"
];

const LandlordDashboard = () => {
  const { publicKey } = useWallet();
  const { user } = useUser();
  const { disconnect } = useWallet();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAddPropertyDialog, setShowAddPropertyDialog] = useState(false);
  const [kycData, setKycData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idProof: null as File | null,
    selfie: null as File | null,
    idProofUrl: '',
    selfieUrl: ''
  });
  const [kycUploading, setKycUploading] = useState(false);
  // Add property form state
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyRent, setPropertyRent] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyPincode, setPropertyPincode] = useState('');
  const [propertyBedrooms, setPropertyBedrooms] = useState('');
  const [propertyBathrooms, setPropertyBathrooms] = useState('');
  const [propertyAreaSqft, setPropertyAreaSqft] = useState('');
  const [propertyRating, setPropertyRating] = useState('');
  const [propertyTags, setPropertyTags] = useState<string[]>([]);
  const [propertyPhotos, setPropertyPhotos] = useState<string[]>([]);
  const [propertyDescription, setPropertyDescription] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);

  // Edit property state
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Data
  const [properties, setProperties] = useState<any[]>([]);
  const [activeTenants, setActiveTenants] = useState<number>(0);
  const [pendingApplications, setPendingApplications] = useState<number>(0);

  useEffect(() => {
    if (!publicKey) {
      navigate('/');
      return;
    }
    
    const initializeUser = async () => {
      try {
        const userRef = doc(db, "users", publicKey);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            walletAddress: publicKey,
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
    
    initializeUser();
  }, [publicKey, navigate]);

  useEffect(() => {
    if (isVerified && publicKey) {
      const fetchProperties = async () => {
        const q = query(collection(db, "properties"), where("landlordWallet", "==", publicKey));
        const snap = await getDocs(q);
        setProperties(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      
      const fetchActiveTenants = async () => {
        const q = query(
          collection(db, "applications"),
          where("landlordWallet", "==", publicKey),
          where("status", "==", "approved")
        );
        const snap = await getDocs(q);
        setActiveTenants(snap.size);
      };
      
      fetchProperties();
      fetchActiveTenants();
    }

    const fetchPendingApplications = async () => {
      const q = query(
        collection(db, "applications"),
        where("landlordWallet", "==", publicKey),
        where("status", "==", "Under Review")
      );
      const snap = await getDocs(q);
      setPendingApplications(snap.size);
    };
    
    fetchPendingApplications();
  }, [isVerified, publicKey]);

  const resetAddForm = () => {
    setPropertyTitle('');
    setPropertyRent('');
    setPropertyCity('');
    setPropertyPincode('');
    setPropertyBedrooms('');
    setPropertyBathrooms('');
    setPropertyAreaSqft('');
    setPropertyRating('');
    setPropertyTags([]);
    setPropertyPhotos([]);
    setPropertyDescription('');
  };

  const handleAddProperty = async () => {
    if (!propertyTitle || !propertyRent || !propertyCity || !propertyPincode || !publicKey) return;
    try {
      const docRef = await addDoc(collection(db, "properties"), {
        landlordWallet: publicKey,
        title: propertyTitle,
        rent: Number(propertyRent),
        address: { city: propertyCity, pincode: propertyPincode },
        bedrooms: Number(propertyBedrooms),
        bathrooms: Number(propertyBathrooms),
        areaSqft: Number(propertyAreaSqft),
        rating: Number(propertyRating),
        tags: propertyTags,
        photos: propertyPhotos,
        description: propertyDescription,
        isAvailable: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      const landlordRef = doc(db, "landlords", publicKey);
      await setDoc(landlordRef, {
        properties: [docRef.id],
        updatedAt: serverTimestamp()
      }, { merge: true });
      setProperties(prev => [...prev, {
        id: docRef.id,
        title: propertyTitle,
        rent: Number(propertyRent),
        address: { city: propertyCity, pincode: propertyPincode },
        bedrooms: Number(propertyBedrooms),
        bathrooms: Number(propertyBathrooms),
        areaSqft: Number(propertyAreaSqft),
        rating: Number(propertyRating),
        tags: propertyTags,
        photos: propertyPhotos,
        description: propertyDescription,
        isAvailable: true
      }]);
      setShowAddPropertyDialog(false);
      resetAddForm();
    } catch (error) {
      alert("Failed to add property");
    }
  };

  const handleEditProperty = async () => {
    if (!editingProperty) return;
    try {
      await updateDoc(doc(db, "properties", editingProperty.id), {
        ...editingProperty,
        rent: Number(editingProperty.rent),
        bedrooms: Number(editingProperty.bedrooms),
        bathrooms: Number(editingProperty.bathrooms),
        areaSqft: Number(editingProperty.areaSqft),
        rating: Number(editingProperty.rating),
        updatedAt: serverTimestamp()
      });
      setProperties(prev =>
        prev.map(p => p.id === editingProperty.id ? editingProperty : p)
      );
      setShowEditDialog(false);
      setEditingProperty(null);
    } catch (error) {
      alert("Failed to update property");
    }
  };

   const handleAadharVerification = async () => {
    if (!publicKey || aadharNumber.length !== 12) return;
    setIsVerifying(true);
    try {
      const hashHex = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(aadharNumber)
      ).then(hash => Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0')).join(''));
      
      await setDoc(doc(db, "users", publicKey), {
        aadharHash: hashHex,
        isVerified: true,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setIsVerified(true);
      setShowVerificationDialog(false);
    } catch (error) {
      alert("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };
 // Modified verification handler
 const handleKYCSubmission = async () => {
  if (!publicKey || !kycData.fullName || !kycData.email) return;
  if (!kycData.idProof || !kycData.selfie) {
    alert('Please upload both ID proof and selfie');
    return;
  }

  setKycUploading(true);
  try {
    // Upload files to IPFS
    const idProofCID = await uploadFileToIPFS(kycData.idProof);
    const selfieCID = await uploadFileToIPFS(kycData.selfie);

    // Create payload WITHOUT File objects
    const kycPayload = {
      fullName: kycData.fullName,
      email: kycData.email,
      phone: kycData.phone,
      address: kycData.address,
      idProofUrl: convertIPFSURL(idProofCID),
      selfieUrl: convertIPFSURL(selfieCID),
      verifiedAt: serverTimestamp()
    };

    // Save to Firestore
    await setDoc(doc(db, "users", publicKey), {
      kyc: kycPayload, // <-- Now contains only strings/numbers
      isVerified: true,
      updatedAt: serverTimestamp()
    }, { merge: true });

    setIsVerified(true);
    setShowVerificationDialog(false);
  } catch (error) {
    console.error("KYC verification failed:", error);
    alert("Verification failed. Please try again.");
  } finally {
    setKycUploading(false);
  }
};

  const handleLogout = async () => {
    try {
      // Clear any stored user data
      if (user?.id || user?.email) {
        localStorage.removeItem(`userRole_${user.id || user.email}`);
      }
      
      // Disconnect wallet
      await disconnect();
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure we still navigate to home even if there's an error
      navigate('/');
    }
  };

  if (!publicKey) return null;
const renderVerificationDialog = () => (
    <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
      <DialogContent className="max-w-2xl rounded-3xl bg-gradient-to-br from-[#fffdfa] to-[#ece7de] border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
            Complete KYC Verification
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Full Legal Name"
              value={kycData.fullName}
              onChange={e => setKycData({...kycData, fullName: e.target.value})}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={kycData.email}
              onChange={e => setKycData({...kycData, email: e.target.value})}
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={kycData.phone}
              onChange={e => setKycData({...kycData, phone: e.target.value})}
              required
            />
            <Input
              placeholder="Physical Address"
              value={kycData.address}
              onChange={e => setKycData({...kycData, address: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Government ID Proof</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setKycData({...kycData, idProof: file});
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black/10 file:text-black hover:file:bg-black/20"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Selfie with ID</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setKycData({...kycData, selfie: file});
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black/10 file:text-black hover:file:bg-black/20"
              />
            </div>
          </div>

          <Button
            className="w-full py-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-medium transition-all duration-300 shadow-lg"
            onClick={handleKYCSubmission}
            disabled={kycUploading || !kycData.idProof || !kycData.selfie}
          >
            {kycUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Submit KYC Documentation'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#fffdfa] to-[#ece7de]">
      <DashboardHeader 
        title="Landlord Dashboard" 
        userRole="landlord" 
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
              Landlord Dashboard
            </h1>
            <p className="text-lg text-black/70" style={{ fontFamily: '"Outfit", sans-serif' }}>
              {isVerified ? "Manage properties and connect with tenants" : "Complete verification to unlock features"}
            </p>
          </div>
        </div>
        {/* Verification Status Banner */}
        {isVerified && (
          <div className="bg-gradient-to-r from-[#e6e1d9] via-[#f8f6f1] to-[#ece7de] border border-black/10 rounded-2xl p-6 mb-10 shadow">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-7 w-7 text-green-600" />
              <div>
                <p className="font-semibold text-black" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  Identity Verified
                </p>
                <p className="text-sm text-black/60">
                  All landlord features are now unlocked
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        {isVerified === false ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-3xl w-full p-16 rounded-3xl border border-black/10 bg-gradient-to-br from-[#f8f6f1] to-[#ece7de] shadow-xl">
              <div className="text-center">
                <div className="mb-12">
                  <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-black flex items-center justify-center shadow-lg">
                    <Lock className="h-16 w-16 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold mb-6 text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                    Verify to Start Listing
                  </h2>
                  <p className="text-xl text-black/60 leading-relaxed mb-12 max-w-2xl mx-auto" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    To keep tenants safe, we require landlord verification. Complete this one-time process to unlock all features.
                  </p>
                </div>
                {/* Current verification method */}
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-black mb-4" style={{ fontFamily: '"Outfit", sans-serif' }}>
  Complete KYC Verification
</h3>

                  <Button
  size="lg"
  onClick={() => setShowVerificationDialog(true)}
  className="px-12 py-4 text-lg font-semibold rounded-2xl bg-black hover:bg-neutral-900 text-white transition-all duration-300 hover:shadow-lg"
  style={{ fontFamily: '"Outfit", sans-serif' }}
>
  <Shield className="h-6 w-6 mr-3" />
  Start KYC Verification
</Button>

                </div>
                {/* Future Civic Pass emphasis */}
                <div className="p-8 rounded-2xl border-2 border-dashed border-black/10 bg-gradient-to-br from-[#fffdfa] to-[#ece7de]">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-black/60" />
                    <h3 className="text-2xl font-bold text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                      Coming Soon: Civic Pass
                    </h3>
                  </div>
                  <p className="text-lg text-black/60 leading-relaxed" style={{ fontFamily: '"Outfit", sans-serif' }}>
                    Enhanced verification with video selfie, government ID validation, and blockchain-based identity credentials for maximum security and trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isVerified === true ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <Card className="rounded-2xl border-0 shadow bg-gradient-to-br from-[#fffdfa] to-[#ece7de]">
                <CardContent className="p-7">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-black/60">Properties</p>
                      <p className="text-2xl font-bold text-black">{properties.length}</p>
                    </div>
                    <Building className="h-8 w-8 text-black/60" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Add more stat cards as needed */}
              {/* Applications Section */}
<div className="mb-12">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold mr-7" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
      Received Applications
    </h2>
    <Button
      onClick={() => navigate('/landlord/applications')}
      className="bg-black hover:bg-neutral-900 text-white rounded-xl px-6 py-2 font-semibold"
    >
      <FileText className="h-4 w-4 mr-2" />
      View All Applications
    </Button>
  </div>
  
  {/* Applications Preview Card */}
  <Card className="rounded-2xl border-0 shadow bg-gradient-to-br from-[#fffdfa] to-[#ece7de]">
    <CardContent className="p-7">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-black/60">Pending Applications</p>
          <p className="text-2xl font-bold text-black">{pendingApplications}</p>
        </div>
        <FileText className="h-8 w-8 text-black/60" />
      </div>
    </CardContent>
  </Card>
</div>

            </div>
            {/* Property Management Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
                  Your Properties
                </h2>
                <Button
                  onClick={() => setShowAddPropertyDialog(true)}
                  className="bg-black hover:bg-neutral-900 text-white rounded-xl px-6 py-2 font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
              {/* Properties List */}
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {properties.map(property => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      address={property.address}
                      rent={property.rent}
  ratings={property.ratings}
                      bedrooms={property.bedrooms}
                      bathrooms={property.bathrooms}
                      areaSqft={property.areaSqft}
                      tags={property.tags}
                      photos={property.photos}
                      isAvailable={property.isAvailable}
                      showEdit={true}
                      onViewDetails={() => navigate(`/properties/${property.id}`)}
                      onEdit={() => {
                        setEditingProperty({ ...property }); // clone to avoid direct mutation
                        setShowEditDialog(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-black/50">No properties listed yet</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
          </div>
        )}
        {/* Add Property Dialog */}
        <Dialog open={showAddPropertyDialog} onOpenChange={setShowAddPropertyDialog}>
<DialogContent
  className="w-full max-w-3xl rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-[#fffdfa] to-[#ece7de]"
  style={{
    maxHeight: '90vh',
    margin: '0 auto',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    // DO NOT set alignItems: 'center'
  }}
  >            <DialogHeader className="flex-shrink-0 pt-6 px-6">
    <DialogTitle
      className="text-3xl mb-6 text-center"
      style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
    >
      Add New Property
    </DialogTitle>
            </DialogHeader>
            <form
      className="w-full flex flex-col gap-6"
      style={{
        maxWidth: 700,
        margin: '0 auto',
      }}
      onSubmit={e => {
        e.preventDefault();
        handleAddProperty();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Property Title" value={propertyTitle} onChange={e => setPropertyTitle(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
          required/>
              <Input type="number" placeholder="Monthly Rent (₹)" value={propertyRent} onChange={e => setPropertyRent(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
          required/>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="City" value={propertyCity} onChange={e => setPropertyCity(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
          required/>
                <Input placeholder="Pincode" value={propertyPincode} onChange={e => setPropertyPincode(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
          required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="number" placeholder="Bedrooms" value={propertyBedrooms} onChange={e => setPropertyBedrooms(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"/>
                <Input type="number" placeholder="Bathrooms" value={propertyBathrooms} onChange={e => setPropertyBathrooms(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"/>
              </div>
              
              <Input type="number" placeholder="Area (sqft)" value={propertyAreaSqft} onChange={e => setPropertyAreaSqft(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"/>
               <div>
        <div className="font-medium mb-2 text-black">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => (
 <label
              key={tag}
              className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full cursor-pointer
                ${propertyTags.includes(tag)
                  ? "bg-black text-white"
                  : "bg-black/10 text-black"}
              `}
              style={{ fontFamily: '"Outfit", sans-serif' }}
            >
                        <input
                        type="checkbox"
                        checked={propertyTags.includes(tag)}
                        onChange={e => {
                          if (e.target.checked) setPropertyTags([...propertyTags, tag]);
                          else setPropertyTags(propertyTags.filter(t => t !== tag));
                        }}
                        className="accent-black"
                      />
                      {tag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2 text-black">Photos</div>
                <div className="flex flex-wrap gap-3 mb-2">
                  {propertyPhotos.map((url, idx) => (
                    <div key={url} className="relative w-20 h-20 rounded overflow-hidden border border-black/10">
                      <img src={url} alt={`Property photo ${idx + 1}`} className="object-cover w-full h-full" />
                      <button
                        className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1"
                        onClick={() => setPropertyPhotos(propertyPhotos.filter((_, i) => i !== idx))}
                        type="button"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
<label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-black/10 rounded-xl cursor-pointer hover:border-black/30 transition">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={photoUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setPhotoUploading(true);
                        try {
                          const cid = await uploadFileToIPFS(file);
                          const url = convertIPFSURL(cid);
                          setPropertyPhotos((prev) => [...prev, url]);
                        } catch (error) {
                          // Optionally show toast here
                        } finally {
                          setPhotoUploading(false);
                          e.target.value = "";
                        }
                      }}
                    />
                    {photoUploading ? (
<span className="text-xs text-black/60">Uploading...</span>                    ) : (
              <span className="text-2xl text-black/30">+</span>
                    )}
                  </label>
                </div>
                <div className="text-xs text-black/50">You can upload multiple photos. Click × to remove any.</div>
      </div>
            {/* Description (Rich Text) */}
              <div>
        <div className="font-medium mb-2 text-black">Description</div>
                 <div className="bg-black/5 rounded-xl p-2">
          <SimpleEditor
            value={propertyDescription}
            onChange={e => setPropertyDescription(e.target.value)}
            placeholder="Describe your property, highlights, etc."
            style={{
              minHeight: 120,
              fontFamily: '"Outfit", sans-serif',
              fontSize: 16,
              background: "transparent",
              border: "none",
              color: "#181818",
            }}
          />
              </div>
              </div>
<Button
        type="submit"
        className="bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-3 text-lg shadow-lg transition-all"
        style={{ fontFamily: '"Outfit", sans-serif' }}
      >
        Add Property
      </Button>
             </form>
          </DialogContent>
        </Dialog>
        {/* Edit Property Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent
  className="w-full max-w-3xl rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-[#fffdfa] to-[#ece7de]"
  style={{
    maxHeight: '90vh',
    margin: '0 auto',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    // DO NOT set alignItems: 'center'
  }}
  >            <DialogHeader className="flex-shrink-0 pt-6 px-6">
    <DialogTitle
      className="text-3xl mb-6 text-center"
      style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
    >
                Edit Property
              </DialogTitle>
            </DialogHeader>
            {editingProperty && (
  <form
    className="w-full flex flex-col gap-6"
    style={{
      maxWidth: 700,
      margin: '0 auto',
    }}
    onSubmit={e => {
      e.preventDefault();
      handleEditProperty();
    }}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        placeholder="Property Title"
        value={editingProperty.title}
        onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })}
        className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
        required
      />
      <Input
        type="number"
        placeholder="Monthly Rent (₹)"
        value={editingProperty.rent}
        onChange={e => setEditingProperty({ ...editingProperty, rent: e.target.value })}
        className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
        required
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        placeholder="City"
        value={editingProperty.address?.city || ""}
        onChange={e => setEditingProperty({ ...editingProperty, address: { ...editingProperty.address, city: e.target.value } })}
        className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
        required
      />
      <Input
        placeholder="Pincode"
        value={editingProperty.address?.pincode || ""}
        onChange={e => setEditingProperty({ ...editingProperty, address: { ...editingProperty.address, pincode: e.target.value } })}
        className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
        required
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        type="number"
        placeholder="Bedrooms"
        value={editingProperty.bedrooms}
        onChange={e => setEditingProperty({ ...editingProperty, bedrooms: e.target.value })}
        className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
      />
      <Input
        type="number"
        placeholder="Bathrooms"
        value={editingProperty.bathrooms}
        onChange={e => setEditingProperty({ ...editingProperty, bathrooms: e.target.value })}
        className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
      />
    </div>
    <Input
      type="number"
      placeholder="Area (sqft)"
      value={editingProperty.areaSqft}
      onChange={e => setEditingProperty({ ...editingProperty, areaSqft: e.target.value })}
      className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium text-black"
    />
    <div>
      <div className="font-medium mb-2 text-black">Tags</div>
      <div className="flex flex-wrap gap-2">
        {TAG_OPTIONS.map(tag => (
          <label
            key={tag}
            className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full cursor-pointer
              ${editingProperty.tags?.includes(tag)
                ? "bg-black text-white"
                : "bg-black/10 text-black"}
            `}
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            <input
              type="checkbox"
              checked={editingProperty.tags?.includes(tag)}
              onChange={e => {
                if (e.target.checked)
                  setEditingProperty({ ...editingProperty, tags: [...(editingProperty.tags || []), tag] });
                else
                  setEditingProperty({ ...editingProperty, tags: editingProperty.tags.filter((t: string) => t !== tag) });
              }}
              className="accent-black"
            />
            {tag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
        ))}
      </div>
    </div>
    <div>
      <div className="font-medium mb-2 text-black">Photos</div>
      <div className="flex flex-wrap gap-3 mb-2">
        {editingProperty.photos?.map((url: string, idx: number) => (
          <div key={url} className="relative w-20 h-20 rounded overflow-hidden border border-black/10">
            <img src={url} alt={`Property photo ${idx + 1}`} className="object-cover w-full h-full" />
            <button
              className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1"
              onClick={() => setEditingProperty({
                ...editingProperty,
                photos: editingProperty.photos.filter((_: string, i: number) => i !== idx)
              })}
              type="button"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ))}
        <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-black/10 rounded-xl cursor-pointer hover:border-black/30 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={photoUploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPhotoUploading(true);
              try {
                const cid = await uploadFileToIPFS(file);
                const url = convertIPFSURL(cid);
                setEditingProperty((prev: any) => ({
                  ...prev,
                  photos: [...(prev.photos || []), url]
                }));
              } catch (error) {
                // Optionally show toast here
              } finally {
                setPhotoUploading(false);
                e.target.value = "";
              }
            }}
          />
          {photoUploading ? (
            <span className="text-xs text-black/60">Uploading...</span>
          ) : (
            <span className="text-2xl text-black/30">+</span>
          )}
        </label>
      </div>
      <div className="text-xs text-black/50">You can upload multiple photos. Click × to remove any.</div>
    </div>
    <div>
      <div className="font-medium mb-2 text-black">Description</div>
      <div className="bg-black/5 rounded-xl p-2">
        <SimpleEditor
          value={editingProperty.description || ""}
          onChange={e => setEditingProperty({ ...editingProperty, description: e.target.value })}
          placeholder="Describe your property, highlights, etc."
          style={{
            minHeight: 120,
            fontFamily: '"Outfit", sans-serif',
            fontSize: 16,
            background: "transparent",
            border: "none",
            color: "#181818",
          }}
        />
      </div>
    </div>
    <Button
      type="submit"
      className="bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-3 text-lg shadow-lg transition-all"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      Save Changes
    </Button>
  </form>
)}
          </DialogContent>
        </Dialog>
        {/* Verification Dialog */}
        {renderVerificationDialog()}
      </main>
    </div>
  );
};

export default LandlordDashboard;
