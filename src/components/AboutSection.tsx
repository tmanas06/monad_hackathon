
import React from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-white">About MonadRent</h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Revolutionizing property rentals through blockchain technology, ensuring transparency, 
            security, and trust for both landlords and tenants.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-200 text-lg leading-relaxed">
              To create a decentralized, secure, and transparent platform for property rentals 
              that eliminates intermediaries, reduces costs, and builds trust through blockchain 
              technology and NFT verification.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🏠 NFT Property Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                Every property is backed by an NFT stored on IPFS via Pinata, 
                ensuring authentic ownership verification and preventing fraud.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                ⚡ Monad Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                Built on Monad's high-performance blockchain for lightning-fast 
                transactions and low fees.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🔒 Secure KYC Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                Comprehensive KYC verification with documents securely stored 
                on IPFS for privacy and compliance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                💎 Smart Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                Automated rental agreements and payments through smart contracts, 
                ensuring trustless transactions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Why Choose MonadRent?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">0%</div>
                <div className="text-purple-200">Hidden Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">24/7</div>
                <div className="text-purple-200">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <div className="text-purple-200">Transparent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Get In Touch</CardTitle>
            <CardDescription className="text-purple-200">
              Have questions? We're here to help you navigate the future of property rentals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-purple-200">
              <p>📧 Email: support@monadrent.com</p>
              <p>🐦 Twitter: @MonadRent</p>
              <p>💬 Discord: MonadRent Community</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;