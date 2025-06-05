/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardHeader from "@/components/DashboardHeader";
import { useEffect, useState } from "react";
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Star } from "lucide-react";

export default function MyApplications() {
  const userContext = useUser();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const walletAddress = userHasWallet(userContext) ? userContext.ethereum.address : null;

  useEffect(() => {
    if (!walletAddress) return;
    const fetchApplications = async () => {
      const q = query(collection(db, "applications"), where("tenantWallet", "==", walletAddress));
      const snap = await getDocs(q);
      const apps = [];
      for (const docSnap of snap.docs) {
        const appData = docSnap.data();
        // Fetch property details
        const propSnap = await getDoc(doc(db, "properties", appData.propertyId));
        apps.push({
          id: docSnap.id,
          status: appData.status,
          appliedAt: appData.appliedAt?.toDate().toLocaleDateString() || "",
          property: propSnap.exists() ? propSnap.data() : null,
          propertyId: appData.propertyId,
        });
      }
      setApplications(apps);
      setLoading(false);
    };
    fetchApplications();
  }, [walletAddress]);

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
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                        {app.property?.title || "Unknown Property"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/10 text-black text-xs font-semibold ml-2">
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-black/60 text-sm mb-2">
                      <span>
                        Applied: {app.appliedAt}
                      </span>
                      {app.property?.rent && (
                        <span>Rent: ₹{app.property.rent?.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-black/60 text-sm">
                      <Home className="h-4 w-4" />
                      <span>
                        {app.property?.address?.area && `${app.property.address.area}, `}
                        {app.property?.address?.city}
                        {app.property?.address?.pincode && `, ${app.property.address.pincode}`}
                      </span>
                    </div>
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
      </div>
    </div>
  );
}
