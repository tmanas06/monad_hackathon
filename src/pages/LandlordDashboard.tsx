/* eslint-disable @typescript-eslint/no-explicit-any */
import '../fonts.css';
import { useUser } from '@civic/auth-web3/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Building, Users, FileText, Shield, Lock, CheckCircle, Home, X, Sparkles } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { userHasWallet } from '@civic/auth-web3';
import PropertyCard from '@/components/PropertyCard';
import { uploadFileToIPFS } from "@/utils/pinata";
import { convertIPFSURL } from "@/utils/ipfs";
import SimpleEditor from 'react-simple-wysiwyg'; // Add this import at the top

const TAG_OPTIONS = [
  "family_friendly", "bachelor_friendly", "student_friendly", "work_drive_friendly"
];

const LandlordDashboard = () => {
  const userContext = useUser();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAddPropertyDialog, setShowAddPropertyDialog] = useState(false);

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

  const walletAddress = userHasWallet(userContext) ? userContext.ethereum.address : null;

  useEffect(() => {
    if (!userContext.user) {
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
    initializeUser();
  }, [userContext, walletAddress, navigate]);

  useEffect(() => {
    if (isVerified && walletAddress) {
      const fetchProperties = async () => {
        const q = query(collection(db, "properties"), where("landlordWallet", "==", walletAddress));
        const snap = await getDocs(q);
        setProperties(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      const fetchActiveTenants = async () => {
        const q = query(
          collection(db, "applications"),
          where("landlordWallet", "==", walletAddress),
          where("status", "==", "approved")
        );
        const snap = await getDocs(q);
        setActiveTenants(snap.size);
      };
      fetchProperties();
      fetchActiveTenants();
    }
  }, [isVerified, walletAddress]);

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
    if (!propertyTitle || !propertyRent || !propertyCity || !propertyPincode || !walletAddress) return;
    try {
      const docRef = await addDoc(collection(db, "properties"), {
        landlordWallet: walletAddress,
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
      const landlordRef = doc(db, "landlords", walletAddress);
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
    if (!walletAddress || aadharNumber.length !== 12) return;
    setIsVerifying(true);
    try {
      const hashHex = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(aadharNumber)
      ).then(hash => Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0')).join(''));
      await setDoc(doc(db, "users", walletAddress), {
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

  if (!userContext.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#fffdfa] to-[#ece7de]">
      <DashboardHeader title="Landlord Dashboard" userRole="landlord" />
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
                    Current Verification Method
                  </h3>
                  <Button
                    size="lg"
                    onClick={() => setShowVerificationDialog(true)}
                    className="px-12 py-4 text-lg font-semibold rounded-2xl bg-black hover:bg-neutral-900 text-white transition-all duration-300 hover:shadow-lg"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    <Shield className="h-6 w-6 mr-3" />
                    Verify with Aadhar
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
              <Card className="rounded-2xl border-0 shadow bg-gradient-to-br from-[#fffdfa] to-[#ece7de]">
                <CardContent className="p-7">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-black/60">Active Tenants</p>
                      <p className="text-2xl font-bold text-black">{activeTenants}</p>
                    </div>
                    <Users className="h-8 w-8 text-black/60" />
                  </div>
                </CardContent>
              </Card>
              {/* Add more stat cards as needed */}
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
                      rating={property.rating}
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
              <Input placeholder="Property Title" value={propertyTitle} onChange={e => setPropertyTitle(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium"
          required/>
              <Input type="number" placeholder="Monthly Rent (₹)" value={propertyRent} onChange={e => setPropertyRent(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium"
          required/>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="City" value={propertyCity} onChange={e => setPropertyCity(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium"
          required/>
                <Input placeholder="Pincode" value={propertyPincode} onChange={e => setPropertyPincode(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium"
          required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="number" placeholder="Bedrooms" value={propertyBedrooms} onChange={e => setPropertyBedrooms(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium"/>
                <Input type="number" placeholder="Bathrooms" value={propertyBathrooms} onChange={e => setPropertyBathrooms(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium"/>
              </div>
              
              <Input type="number" placeholder="Area (sqft)" value={propertyAreaSqft} onChange={e => setPropertyAreaSqft(e.target.value)} className="bg-black/5 rounded-xl px-4 py-3 text-lg font-medium"/>
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
          <DialogContent className="max-w-lg rounded-2xl bg-gradient-to-br from-[#fffdfa] to-[#ece7de] border-0">
            <DialogHeader>
              <DialogTitle className="text-2xl" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
                Edit Property
              </DialogTitle>
            </DialogHeader>
            {editingProperty && (
              <div className="space-y-4">
                <Input placeholder="Property Title" value={editingProperty.title} onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })} />
                <Input type="number" placeholder="Monthly Rent (₹)" value={editingProperty.rent} onChange={e => setEditingProperty({ ...editingProperty, rent: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" value={editingProperty.address?.city || ""} onChange={e => setEditingProperty({ ...editingProperty, address: { ...editingProperty.address, city: e.target.value } })} />
                  <Input placeholder="Pincode" value={editingProperty.address?.pincode || ""} onChange={e => setEditingProperty({ ...editingProperty, address: { ...editingProperty.address, pincode: e.target.value } })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" placeholder="Bedrooms" value={editingProperty.bedrooms} onChange={e => setEditingProperty({ ...editingProperty, bedrooms: e.target.value })} />
                  <Input type="number" placeholder="Bathrooms" value={editingProperty.bathrooms} onChange={e => setEditingProperty({ ...editingProperty, bathrooms: e.target.value })} />
                </div>
                <Input type="number" placeholder="Area (sqft)" value={editingProperty.areaSqft} onChange={e => setEditingProperty({ ...editingProperty, areaSqft: e.target.value })} />
                <Input type="number" placeholder="Rating (1-5)" value={editingProperty.rating} onChange={e => setEditingProperty({ ...editingProperty, rating: e.target.value })} min={1} max={5} step={0.1} />
                <div>
                  <div className="font-medium mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map(tag => (
                      <label key={tag} className="flex items-center gap-1 text-xs bg-black/5 px-2 py-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProperty.tags?.includes(tag)}
                          onChange={e => {
                            if (e.target.checked) setEditingProperty({ ...editingProperty, tags: [...(editingProperty.tags || []), tag] });
                            else setEditingProperty({ ...editingProperty, tags: editingProperty.tags.filter((t: string) => t !== tag) });
                          }}
                        />
                        {tag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Photos</div>
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
                    <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-black/10 rounded cursor-pointer hover:border-black/30 transition">
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
                  <div className="font-medium mb-2">Description</div>
                  <textarea
                    className="w-full border border-black/10 rounded p-2"
                    value={editingProperty.description || ""}
                    onChange={e => setEditingProperty({ ...editingProperty, description: e.target.value })}
                    rows={4}
                    placeholder="Describe your property, highlights, etc."
                  />
                </div>
                <Button className="bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-2" onClick={handleEditProperty}>Save Changes</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Verification Dialog */}
        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="max-w-md rounded-2xl bg-gradient-to-br from-[#fffdfa] to-[#ece7de] border-0">
            <DialogHeader>
              <DialogTitle className="text-2xl" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
                Verify with Aadhar
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="12-digit Aadhar Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
              />
              <Button
                className="bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-2"
                onClick={handleAadharVerification}
                disabled={isVerifying || aadharNumber.length !== 12}
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
