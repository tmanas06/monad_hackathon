
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Clock, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rent-blue-600 via-rent-blue-700 to-rent-green-600 bg-clip-text text-transparent">
            Trusted Rentals,
            <br />
            Verified Tenants
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            RentRight uses Civic Auth for secure tenant verification, making the rental process faster, 
            safer, and more reliable for both landlords and tenants.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-rent-blue-600 to-rent-blue-700 hover:from-rent-blue-700 hover:to-rent-blue-800">
              <Shield className="h-5 w-5 mr-2" />
              Get Verified
            </Button>
            <Button size="lg" variant="outline" className="border-rent-blue-300 text-rent-blue-700 hover:bg-rent-blue-50">
              List Your Property
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-rent-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-rent-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Identity</h3>
              <p className="text-gray-600">Civic Auth ensures all tenants are verified with blockchain-based identity verification.</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-rent-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-rent-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Applications</h3>
              <p className="text-gray-600">Streamlined process reduces application time from days to minutes.</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-rent-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-rent-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Network</h3>
              <p className="text-gray-600">Build a community of verified landlords and tenants you can trust.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
