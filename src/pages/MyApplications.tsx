/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardHeader from "@/components/DashboardHeader";
import { useEffect, useState } from "react";
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Star,
  Phone,
  Mail,
  MessageSquare,
  XCircle
} from "lucide-react";
import ApplicationDialog from '../components/ApplicationDialog';

export default function MyApplications() {
  const userContext = useUser();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const [showApplicationDialog, setShowApplicationDialog] = useState(false);
const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const walletAddress = userHasWallet(userContext) ? userContext.ethereum.address : null;

 useEffect(() => {
  if (!walletAddress) return;
  const q = query(collection(db, "applications"), where("tenantWallet", "==", walletAddress));
  const unsubscribe = onSnapshot(q, async (snap) => {
    const apps = [];
    for (const docSnap of snap.docs) {
      const appData = docSnap.data();
      // Fetch property details
      const propSnap = await getDoc(doc(db, "properties", appData.propertyId));
      apps.push({
        id: docSnap.id,
        status: appData.status,
        appliedAt: appData.appliedAt?.toDate()?.toLocaleDateString() || "",
        property: propSnap.exists() ? propSnap.data() : null,
        propertyId: appData.propertyId,
        landlordContact: appData.landlordContact,
        rejectionReason: appData.rejectionReason
      });
    }
    setApplications(apps);
    setLoading(false);
  });
  return () => unsubscribe();
}, [walletAddress]);

const handleApplyAgain = async (applicationData: any) => {
  try {
    await addDoc(collection(db, "applications"), {
      ...applicationData,
      status: "Under Review",
      rejectionReason: null,
      desiredRent: applicationData.desiredRent,
      moveInDate: applicationData.moveInDate,
      applicationText: applicationData.applicationText,
      appliedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error resubmitting application:", error);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#fffdfa] to-[#ece7de] pb-16">
      <DashboardHeader title="My Applications" userRole="tenant" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-black hover:bg-black/10 rounded-full px-4 py-2 font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
          My Applications
        </h1>
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center text-black/60 text-lg">
            <Home className="mx-auto mb-4 h-10 w-10 text-black/20" />
            You haven't applied to any properties yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {applications.map(app => (
              <Card key={app.id} className="rounded-2xl border-0 shadow-xl bg-gradient-to-br from-white via-[#f8f6f1] to-[#ece7de]">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                        {app.property?.title || "Unknown Property"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-black/60 text-sm mb-2">
                      <span>Applied: {app.appliedAt}</span>
                      {app.property?.rent && (
                        <span>Rent: ₹{app.property.rent?.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-black/60 text-sm mb-3">
                      <Home className="h-4 w-4" />
                      <span>
                        {app.property?.address?.area && `${app.property.address.area}, `}
                        {app.property?.address?.city}
                        {app.property?.address?.pincode && `, ${app.property.address.pincode}`}
                      </span>
                    </div>

                    {/* Landlord Contact Section */}
                    {app.status === 'Approved' && app.landlordContact && (
                      <div className="mt-4 pt-4 border-t border-black/10">
                        <h3 className="text-sm font-semibold text-black mb-2">
                          Landlord Contact Details:
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-black/60" />
                            <span className="text-black/80">{app.landlordContact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-black/60" />
                            <span className="text-black/80">{app.landlordContact.email}</span>
                          </div>
                          {app.landlordContact.message && (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-black/60 mt-1" />
                              <span className="text-black/80">{app.landlordContact.message}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rejection Reason Section */}
                   {app.status === 'Rejected' && (
  <div className="mt-4 pt-4 border-t border-black/10">
    <div className="flex items-start gap-2 text-red-600">
      <XCircle className="h-4 w-4 mt-1" />
      <div>
        <h3 className="text-sm font-semibold mb-1">Rejection Reason:</h3>
        <p className="text-sm">{app.rejectionReason}</p>
      </div>
    </div>
    {/* ADD THESE NEW BUTTONS */}
    <div className="flex gap-4 mt-4">
      <Button
        onClick={() => navigate('/tenants')}
        className="bg-black hover:bg-neutral-900 text-white rounded-xl flex-1"
      >
        Browse Other Properties
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setSelectedApplication(app);
          setShowApplicationDialog(true);
        }}
        className="rounded-xl flex-1"
      >
        Apply Again
      </Button>
    </div>
  </div>
)}

                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Button
                      className="bg-black hover:bg-neutral-900 text-white rounded-xl font-semibold px-6 py-2"
                      onClick={() => navigate(`/properties/${app.propertyId}`)}
                    >
                      View Property
                    </Button>
                    <span className="text-xs text-black/40">Application ID: {app.id}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <ApplicationDialog
  open={showApplicationDialog}
  onOpenChange={setShowApplicationDialog}
  onSubmit={handleApplyAgain}
  defaultRent={selectedApplication?.property?.rent}
/>

      </div>
    </div>
    
  );
}
