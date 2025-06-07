
import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PropertyListings from '@/components/PropertyListings';
import CivicAuthButton from '@/components/CivicAuthButton';
import Dashboard from '@/components/Dashboard';
import AboutSection from '@/components/AboutSection';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'tenant' | 'landlord' | null>(null);

  const handleAuthSuccess = (role: 'tenant' | 'landlord') => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  if (isAuthenticated) {
    return <Dashboard userRole={userRole} onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rent-blue-50 to-rent-green-50">
      <Header />
      <Hero />
      <AboutSection />
      <div className="fixed bottom-8 right-8 z-50">
      </div>
    </div>
  );
};

export default Index;
