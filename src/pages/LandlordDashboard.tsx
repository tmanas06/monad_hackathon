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
import { Plus, Building, Users, DollarSign, FileText, Shield, Lock, CheckCircle, Home, X } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { userHasWallet } from '@civic/auth-web3';
import PropertyCard from '@/components/PropertyCard';
import { uploadFileToIPFS } from "@/utils/pinata";
import { convertIPFSURL } from "@/utils/ipfs";

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
    <div className="min-h-screen bg-[#FAF6F2]">
      <DashboardHeader title="Landlord Dashboard" userRole="landlord" />
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: '"Cyber", sans-serif' }}>
              Landlord Dashboard
            </h1>
            <p className="text-lg text-slate-600" style={{ fontFamily: '"Outfit", sans-serif' }}>
              {isVerified ? "Manage properties and connect with tenants" : "Complete verification to unlock features"}
            </p>
          </div>
          {/* Role Switcher */}
          <Card className="w-64 bg-white/90 backdrop-blur-sm border border-slate-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Switch Dashboard
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-orange-50 border-orange-200"
                  disabled
                >
                  <Building className="h-4 w-4 mr-2" />
                  Landlord
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/tenants')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Tenant
                  {isVerified && <CheckCircle className="h-4 w-4 ml-auto text-green-500" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Verification Status Banner */}
        {isVerified && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800" style={{ fontFamily: '"Outfit", sans-serif' }}>
                  Identity Verified
                </p>
                <p className="text-sm text-green-600">
                  All landlord features are now unlocked
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        {isVerified === false ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-2xl w-full border-2 border-orange-200">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <Lock className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: '"Cyber", sans-serif' }}>
                    Verify to Access Features
                  </h2>
                  <Button
                    onClick={() => setShowVerificationDialog(true)}
                    className="px-8 py-4 text-lg rounded-full bg-orange-500 hover:bg-orange-600"
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    Verify with Aadhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : isVerified === true ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-600">Properties</p>
                      <p className="text-2xl font-bold">{properties.length}</p>
                    </div>
                    <Building className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-600">Active Tenants</p>
                      <p className="text-2xl font-bold">{activeTenants}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              {/* Add more stat cards as needed */}
            </div>
            {/* Property Management Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ fontFamily: '"Cyber", sans-serif' }}>
                  Your Properties
                </h2>
                <Button onClick={() => setShowAddPropertyDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
              {/* Properties List */}
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-slate-500">No properties listed yet</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}
        {/* Add Property Dialog */}
        <Dialog open={showAddPropertyDialog} onOpenChange={setShowAddPropertyDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl" style={{ fontFamily: '"Cyber", sans-serif' }}>
                Add New Property
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Property Title" value={propertyTitle} onChange={e => setPropertyTitle(e.target.value)} />
              <Input type="number" placeholder="Monthly Rent (₹)" value={propertyRent} onChange={e => setPropertyRent(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" value={propertyCity} onChange={e => setPropertyCity(e.target.value)} />
                <Input placeholder="Pincode" value={propertyPincode} onChange={e => setPropertyPincode(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Bedrooms" value={propertyBedrooms} onChange={e => setPropertyBedrooms(e.target.value)} />
                <Input type="number" placeholder="Bathrooms" value={propertyBathrooms} onChange={e => setPropertyBathrooms(e.target.value)} />
              </div>
              <Input type="number" placeholder="Area (sqft)" value={propertyAreaSqft} onChange={e => setPropertyAreaSqft(e.target.value)} />
              <Input type="number" placeholder="Rating (1-5)" value={propertyRating} onChange={e => setPropertyRating(e.target.value)} min={1} max={5} step={0.1} />
              <div>
                <div className="font-medium mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map(tag => (
                    <label key={tag} className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={propertyTags.includes(tag)}
                        onChange={e => {
                          if (e.target.checked) setPropertyTags([...propertyTags, tag]);
                          else setPropertyTags(propertyTags.filter(t => t !== tag));
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
                  {propertyPhotos.map((url, idx) => (
                    <div key={url} className="relative w-20 h-20 rounded overflow-hidden border border-slate-200">
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
                  <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-slate-300 rounded cursor-pointer hover:border-blue-400 transition">
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
                          e.target.value = ""; // Reset input
                        }
                      }}
                    />
                    {photoUploading ? (
                      <span className="text-xs text-slate-500">Uploading...</span>
                    ) : (
                      <span className="text-2xl text-slate-400">+</span>
                    )}
                  </label>
                </div>
                <div className="text-xs text-slate-500">You can upload multiple photos. Click × to remove any.</div>
              </div>
              <div>
                <div className="font-medium mb-2">Description</div>
                <textarea
                  className="w-full border border-slate-300 rounded p-2"
                  value={propertyDescription}
                  onChange={e => setPropertyDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your property, highlights, etc."
                />
              </div>
              <Button onClick={handleAddProperty}>Add Property</Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Edit Property Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Property</DialogTitle>
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
                      <label key={tag} className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded cursor-pointer">
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
                      <div key={url} className="relative w-20 h-20 rounded overflow-hidden border border-slate-200">
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
                    <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-slate-300 rounded cursor-pointer hover:border-blue-400 transition">
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
                        <span className="text-xs text-slate-500">Uploading...</span>
                      ) : (
                        <span className="text-2xl text-slate-400">+</span>
                      )}
                    </label>
                  </div>
                  <div className="text-xs text-slate-500">You can upload multiple photos. Click × to remove any.</div>
                </div>
                <div>
                  <div className="font-medium mb-2">Description</div>
                  <textarea
                    className="w-full border border-slate-300 rounded p-2"
                    value={editingProperty.description || ""}
                    onChange={e => setEditingProperty({ ...editingProperty, description: e.target.value })}
                    rows={4}
                    placeholder="Describe your property, highlights, etc."
                  />
                </div>
                <Button onClick={handleEditProperty}>Save Changes</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Verification Dialog */}
        <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl" style={{ fontFamily: '"Cyber", sans-serif' }}>
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
