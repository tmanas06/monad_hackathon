/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardHeader from "@/components/DashboardHeader";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc, query, where, getDocs } from "firebase/firestore";
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Phone, Mail, Shield, Star, MapPin, BedDouble, Bath, Ruler, CheckCircle, ChevronLeft, ChevronRight
} from "lucide-react";
import { Property, User } from "@/types/property";

const tagLabels: Record<string, string> = {
  family_friendly: "Family Friendly",
  bachelor_friendly: "Bachelor Friendly",
  student_friendly: "Student Friendly",
  work_drive_friendly: "Work Drive Friendly",
};

function StarButton({ filled, onClick, disabled }: { filled: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`transition ${disabled ? "cursor-not-allowed opacity-50" : "hover:scale-110"}`}
      aria-label={filled ? "Filled Star" : "Empty Star"}
      style={{ background: "none", border: "none", outline: "none" }}
    >
      <svg width={28} height={28} viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth={2}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </button>
  );
}

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userContext = useUser();
  const { user } = userContext;
  const [property, setProperty] = useState<Property | null>(null);
  const [landlord, setLandlord] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const walletAddress = userHasWallet(userContext) ? userContext.ethereum.address : null;

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const ref = doc(db, "properties", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const propertyData = { id, ...snap.data() } as Property;
          setProperty(propertyData);

          if (propertyData.landlordWallet) {
            const landlordSnap = await getDoc(doc(db, "users", propertyData.landlordWallet));
            if (landlordSnap.exists()) setLandlord(landlordSnap.data() as User);
          }

          if (snap.data().ratings && Array.isArray(snap.data().ratings)) {
            const ratings = snap.data().ratings;
            const sum = ratings.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
            setAvgRating(ratings.length ? (sum / ratings.length) : null);
            if (walletAddress) {
              const ur = ratings.find((r: any) => r.user === walletAddress);
              setUserRating(ur ? ur.rating : 0);
            }
          } else if (typeof snap.data().rating === "number") {
            setAvgRating(snap.data().rating);
          }
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, walletAddress]);

  useEffect(() => {
    if (!user || !walletAddress) return;
    const fetchVerificationStatus = async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", walletAddress));
        setIsVerified(userSnap.data()?.isVerified ?? false);
      } catch (error) {
        setIsVerified(false);
      }
    };
    fetchVerificationStatus();
  }, [user, walletAddress]);

  // Check if tenant has already applied for this property
  useEffect(() => {
    if (!user || !walletAddress || !property?.id) return;
    const checkApplication = async () => {
      try {
        const q = query(
          collection(db, "applications"),
          where("propertyId", "==", property.id),
          where("tenantWallet", "==", walletAddress)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setApplied(true);
          setApplicationId(snap.docs[0].id);
        }
      } catch (error) {
        console.error("Error checking application:", error);
      }
    };
    checkApplication();
  }, [user, walletAddress, property?.id]);

  const handleApply = async () => {
    if (!user || !property || !walletAddress) return;
    setApplying(true);
    try {
      const docRef = await addDoc(collection(db, "applications"), {
        propertyId: property.id,
        tenantWallet: walletAddress,
        landlordWallet: property.landlordWallet,
        status: "Under Review",
        appliedAt: serverTimestamp()
      });
      setApplied(true);
      setApplicationId(docRef.id);
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (!isVerified || !property || !walletAddress) return;
    setRatingSubmitting(true);
    try {
      const ratings = Array.isArray((property as any).ratings) ? (property as any).ratings : [];
      const filtered = ratings.filter((r: any) => r.user !== walletAddress);
      const newRatings = [...filtered, { user: walletAddress, rating }];
      const avg = newRatings.reduce((acc: number, r: any) => acc + r.rating, 0) / newRatings.length;
      await updateDoc(doc(db, "properties", property.id), {
        ratings: newRatings,
        rating: avg,
      });
      setUserRating(rating);
      setAvgRating(avg);
      setProperty({ ...property, rating: avg });
    } catch (err) {
      alert("Failed to submit rating.");
    } finally {
      setRatingSubmitting(false);
    }
  };

  // Carousel controls
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!property?.photos) return;
    setPhotoIdx(idx => (idx === 0 ? property.photos.length - 1 : idx - 1));
  };
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!property?.photos) return;
    setPhotoIdx(idx => (idx === property.photos.length - 1 ? 0 : idx + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-400" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f8f6f1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Cyber", sans-serif' }}>Property not found</h1>
          <Button onClick={() => navigate('/tenants')} className="bg-black text-white rounded-full px-6 py-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#f3f1ea] to-[#ece7de] pb-16">
      <DashboardHeader title="Discover Properties" userRole="tenant" isVerified={isVerified} />
      <div className="w-full px-0 py-0">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto mt-8 mb-4 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-black hover:bg-black/10 rounded-full px-4 py-2 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        {/* Cream/white gradient card with carousel */}
        <div className="w-full max-w-6xl mx-auto rounded-3xl shadow-2xl overflow-hidden mb-12" style={{
          background: "linear-gradient(120deg, #f8f6f1 60%, #ece7de 100%)"
        }}>
          <div className="relative h-80 flex items-stretch">
            {/* Photo carousel */}
            {property.photos && property.photos.length > 0 ? (
              <>
                <img
                  src={property.photos[photoIdx]}
                  alt={property.title}
                  className="w-full h-full object-cover object-center transition-opacity duration-500"
                  style={{ minHeight: '100%', minWidth: '100%' }}
                />
                {property.photos.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 rounded-full p-2 shadow"
                      onClick={handlePrev}
                      aria-label="Previous Photo"
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 rounded-full p-2 shadow"
                      onClick={handleNext}
                      aria-label="Next Photo"
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </button>
                  </>
                )}
                {/* Geometric carousel indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-3 w-3 rounded-full border-2 border-black transition-all duration-300 ${
                        photoIdx === idx ? 'bg-black' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#f8f6f1] to-[#ece7de] flex items-center justify-center">
                <span className="text-2xl text-black/40">No photos available</span>
              </div>
            )}
            {/* Verified badge */}
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full shadow">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-xs font-semibold text-black">Verified</span>
            </div>
          </div>
          {/* Property Info Overlay */}
          <div className="p-8 pb-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-black drop-shadow" style={{ fontFamily: '"Cyber", sans-serif' }}>
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-black/80 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>
                  {property.address?.area && `${property.address.area}, `}
                  {property.address?.city}
                  {property.address?.pincode && `, ${property.address.pincode}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>{avgRating?.toFixed(1) || 'N/A'}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                <span>{property.areaSqft} sqft</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {property.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-black/10 text-black text-sm font-medium">
                  {tagLabels[tag] || tag}
                </span>
              ))}
            </div>
            <div className="text-3xl font-bold text-black drop-shadow">
              ₹{property.rent?.toLocaleString()}/month
            </div>
          </div>
        </div>
        {/* Main content grid */}
        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Description and Features */}
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-2xl border-0 shadow-xl bg-gradient-to-br from-white via-[#f8f6f1] to-[#ece7de]">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                  Property Description
                </h2>
                <p className="text-black/80 leading-relaxed text-lg mb-6">
                  {property.description || "No description available for this property."}
                </p>
                <h3 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                  Property Features
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-black/5 rounded-lg">
                    <BedDouble className="h-5 w-5 text-black" />
                    <span className="font-medium text-black">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-black/5 rounded-lg">
                    <Bath className="h-5 w-5 text-black" />
                    <span className="font-medium text-black">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-black/5 rounded-lg">
                    <Ruler className="h-5 w-5 text-black" />
                    <span className="font-medium text-black">{property.areaSqft} sq ft</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-black/5 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium text-black">Rating: {avgRating?.toFixed(1) || "N/A"}/5</span>
                  </div>
                </div>
                {/* Rating Section */}
                <h3 className="text-lg font-bold mb-3 text-black" style={{ fontFamily: '"Cyber", sans-serif'}}>Your Rating</h3>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <StarButton
                      key={star}
                      filled={userRating >= star}
                      onClick={() => isVerified && !ratingSubmitting ? handleRate(star) : undefined}
                      disabled={!isVerified || ratingSubmitting}
                    />
                  ))}
                  {!isVerified && (
                    <span className="ml-2 text-sm text-gray-500 italic">Verify to rate</span>
                  )}
                </div>
                {userRating > 0 && (
                  <p className="text-sm text-gray-600">You rated this property {userRating} star{userRating > 1 ? "s" : ""}.</p>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white via-[#f8f6f1] to-[#ece7de]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                  Owner Information
                </h3>
                {landlord ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Name</p>
                      <p className="font-medium text-black">{landlord.name || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-black/80">{landlord.email || "Not provided"}</p>
                      </div>
                    </div>
                    {landlord.contact?.phone && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-black/80">{landlord.contact.phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Verified Landlord</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading owner information...</p>
                )}
              </CardContent>
            </Card>
            {/* Apply Section */}
            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white via-[#f8f6f1] to-[#ece7de]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                  Apply for this Property
                </h3>
                {user ? (
                  isVerified ? (
                    <div>
                      <p className="text-black/80 mb-4">
                        {applied ? "You have already applied for this property." : "Submit your application to get in touch with the landlord."}
                      </p>
                      {applied ? (
                        <Button
                          className="w-full bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-3 transition-all duration-200"
                          onClick={() => navigate(`/my-applications`)}
                        >
                          View My Applications
                        </Button>
                      ) : (
                        <Button
                          disabled={applying}
                          onClick={handleApply}
                          className="w-full bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-3 transition-all duration-200"
                        >
                          {applying ? "Submitting..." : "Apply Now"}
                        </Button>
                      )}
                      {applied && (
                        <div className="flex items-center gap-2 text-green-600 mt-3 p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Your application status: Under Review</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-black/5 border border-black/10 rounded-xl">
                      <Shield className="h-8 w-8 text-black mx-auto mb-3" />
                      <h4 className="font-bold mb-2 text-black">Verification Required</h4>
                      <p className="text-black/80 mb-4 text-sm">
                        You must verify your identity with Aadhar to apply for rentals.
                      </p>
                      <Button
                        className="w-full bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-2"
                        onClick={() => navigate('/tenants')}
                      >
                        Verify with Aadhar
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center">
                    <p className="text-black/80 mb-4 text-sm">
                      Please sign in to apply for this property.
                    </p>
                    <Button
                      className="w-full bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold py-2"
                      onClick={() => navigate('/')}
                    >
                      Sign In with Civic
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
