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
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { 
  ArrowLeft, 
  User, 
  Home, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useCallback } from 'react';

import { userHasWallet } from '@civic/auth-web3';
interface Application {
  applicationText: any;
  moveInDate: any;
  desiredRent: any;
  id: string;
  landlordWallet: string;
  tenantWallet: string;
  propertyId: string;
  status: string;
  appliedAt: any;
  shortMessage: string;
  property?: any;
  tenant?: any;
}

const ApplicationsPage = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    phone: '',
    email: '',
    message: ''
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
const [rejectionReason, setRejectionReason] = useState('');

  // const publicKey = userHasWallet(userContext) ? userContext.ethereum.address : null;


const fetchApplications = useCallback(async () => {
  if (!publicKey) return;

  setLoading(true);
  try {
    const q = query(
      collection(db, "applications"),
      where("landlordWallet", "==", publicKey)
    );
    const snap = await getDocs(q);

    const applicationsData = await Promise.all(
      snap.docs.map(async (applicationDoc) => {
        // Use type assertion here
        const applicationData = { id: applicationDoc.id, ...applicationDoc.data() } as Application;

        // Fetch property details
        const propertyDoc = await getDoc(doc(db, "properties", applicationData.propertyId));
        const propertyData = propertyDoc.exists() ? propertyDoc.data() : null;

        // Fetch tenant details
        const tenantDoc = await getDoc(doc(db, "users", applicationData.tenantWallet));
        const tenantData = tenantDoc.exists() ? tenantDoc.data() : null;

        return {
          ...applicationData,
          property: propertyData,
          tenant: tenantData
        } as Application;
      })
    );

    setApplications(applicationsData);
  } catch (error) {
    console.error("Error fetching applications:", error);
  } finally {
    setLoading(false);
  }
}, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      navigate('/');
      return;
    }
    fetchApplications();
  }, [publicKey, navigate, fetchApplications]);


  const handleApprove = (application: Application) => {
    setSelectedApplication(application);
    setShowContactDialog(true);
  };

 const handleReject = async (applicationId: string) => {
  try {
    await updateDoc(doc(db, "applications", applicationId), {
      status: "Rejected",
      rejectionReason: rejectionReason, // Add rejection reason to Firestore
      updatedAt: serverTimestamp()
    });
    
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: "Rejected", rejectionReason }
          : app
      )
    );
    setRejectionReason(''); // Reset reason
    setShowRejectDialog(false);
  } catch (error) {
    console.error("Error rejecting application:", error);
    alert("Failed to reject application");
  }
};

  const handleApproveWithContact = async () => {
    if (!selectedApplication || !contactDetails.phone || !contactDetails.email) {
      alert("Please fill in all contact details");
      return;
    }

    try {
      await updateDoc(doc(db, "applications", selectedApplication.id), {
        status: "Approved",
        landlordContact: contactDetails,
        updatedAt: serverTimestamp()
      });
      
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id 
            ? { ...app, status: "Approved" }
            : app
        )
      );
      
      setShowContactDialog(false);
      setSelectedApplication(null);
      setContactDetails({ phone: '', email: '', message: '' });
      
      alert("Application approved! Contact details shared with tenant.");
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#fffdfa] to-[#ece7de] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#fffdfa] to-[#ece7de]">
      <DashboardHeader title="Applications Management" userRole="landlord" />
      
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/landlords')}
              variant="outline"
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
                Received Applications
              </h1>
              <p className="text-lg text-black/70" style={{ fontFamily: '"Outfit", sans-serif' }}>
                Manage rental applications from potential tenants
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { key: 'all', label: 'All Applications', count: applications.length },
            { key: 'Under Review', label: 'Pending', count: applications.filter(app => app.status === 'Under Review').length },
            { key: 'Approved', label: 'Approved', count: applications.filter(app => app.status === 'Approved').length },
            { key: 'Rejected', label: 'Rejected', count: applications.filter(app => app.status === 'Rejected').length }
          ].map(filter => (
            <Button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              variant={statusFilter === filter.key ? "default" : "outline"}
              className={`rounded-xl ${statusFilter === filter.key ? 'bg-black text-white' : ''}`}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="grid gap-6">
            {filteredApplications.map(application => (
              <Card key={application.id} className="rounded-2xl border-0 shadow bg-gradient-to-br from-[#fffdfa] to-[#ece7de]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-black/60" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black" style={{ fontFamily: '"Cyber", sans-serif' }}>
                          {application.tenant?.name || 'Unknown Tenant'}
                        </h3>
                        <p className="text-black/60">{application.tenant?.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>

                  {/* Property Details */}
                  <div className="bg-black/5 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="h-4 w-4 text-black/60" />
                      <span className="font-semibold text-black">Property: {application.property?.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-black/60">
                      <MapPin className="h-4 w-4" />
                      <span>{application.property?.address?.city}, {application.property?.address?.pincode}</span>
                    </div>
                    <div className="mt-2 text-black/80">
                      Rent: ₹{application.property?.rent?.toLocaleString()}/month
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-black/60" />
                      <span className="text-sm text-black/60">
                        Applied on: {application.appliedAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                      </span>
                    </div>
                    {application.shortMessage && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-black/60 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-black mb-1">Tenant's Message:</p>
                          <p className="text-black/80 bg-white/50 p-3 rounded-lg">{application.shortMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
  {application.desiredRent && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Tenant Negotiation Terms</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-blue-600">Desired Rent:</p>
                          <p className="font-medium">₹{application.desiredRent?.toLocaleString()}</p>
                        </div>
                        {application.moveInDate && (
                          <div>
                            <p className="text-xs text-blue-600">Move-in Date:</p>
                            <p className="font-medium">
                              {new Date(application.moveInDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {application.applicationText && (
                          <div className="col-span-2">
                            <p className="text-xs text-blue-600">Additional Notes:</p>
                            <p className="whitespace-pre-wrap text-sm mt-1">
                              {application.applicationText}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Action Buttons */}
                  {application.status === 'Under Review' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(application)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Application
                      </Button>
                      <Button
  onClick={() => {
    setSelectedApplication(application);
    setShowRejectDialog(true);
  }}
  variant="outline"
  className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl"
>
  <XCircle className="h-4 w-4 mr-2" />
  Reject
</Button>

                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-black/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black/60 mb-2">
              {statusFilter === 'all' ? 'No applications received yet' : `No ${statusFilter.toLowerCase()} applications`}
            </h3>
            <p className="text-black/50">
              Applications from potential tenants will appear here
            </p>
          </div>
        )}

        {/* Contact Details Dialog */}
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent className="max-w-md rounded-2xl bg-gradient-to-br from-[#fffdfa] to-[#ece7de] border-0">
            <DialogHeader>
              <DialogTitle className="text-2xl" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
                Share Your Contact Details
              </DialogTitle>
              <p className="text-black/60">
                Provide your contact information to connect with the approved tenant
              </p>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Phone Number</label>
                <Input
                  placeholder="Your phone number"
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                  className="bg-black/5 rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Email Address</label>
                <Input
                  placeholder="Your email address"
                  type="email"
                  value={contactDetails.email}
                  onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                  className="bg-black/5 rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-black mb-2 block">Additional Message (Optional)</label>
                <Input
                  placeholder="Any additional information for the tenant"
                  value={contactDetails.message}
                  onChange={(e) => setContactDetails({...contactDetails, message: e.target.value})}
                  className="bg-black/5 rounded-xl"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleApproveWithContact}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1"
                  disabled={!contactDetails.phone || !contactDetails.email}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Share Contact
                </Button>
                <Button
                  onClick={() => setShowContactDialog(false)}
                  variant="outline"
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
<Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
  <DialogContent className="max-w-md rounded-2xl bg-gradient-to-br from-[#fffdfa] to-[#ece7de] border-0">
    <DialogHeader>
      <DialogTitle className="text-2xl" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
        Provide Rejection Reason
      </DialogTitle>
      <p className="text-black/60">
        Please let the tenant know why their application was rejected
      </p>
    </DialogHeader>
    
    <div className="space-y-4">
      <Input
        placeholder="Reason for rejection (e.g., incomplete documents, references)"
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        className="bg-black/5 rounded-xl"
      />
      
      <div className="flex gap-3 pt-4">
        <Button
          onClick={() => handleReject(selectedApplication!.id)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1"
          disabled={!rejectionReason}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Confirm Rejection
        </Button>
        <Button
          onClick={() => setShowRejectDialog(false)}
          variant="outline"
          className="rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
      </main>
    </div>
  );
};

export default ApplicationsPage;
