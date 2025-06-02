import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TenantSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF6F2] p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: '"Cyber", sans-serif' }}>
            Tenant Settings
          </h1>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
              <p className="text-sm text-gray-600">Update your personal information and preferences.</p>
            </div>
            
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
              <p className="text-sm text-gray-600">Manage how you receive notifications.</p>
            </div>
            
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">Privacy Settings</h2>
              <p className="text-sm text-gray-600">Control your privacy preferences.</p>
            </div>
            
            <div className="pt-4">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
