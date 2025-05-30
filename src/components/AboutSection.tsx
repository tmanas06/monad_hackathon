
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Users, Shield, Award, ExternalLink } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rent-blue-600 to-rent-green-600 bg-clip-text text-transparent">
            About RentRight
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the rental market by bringing trust, transparency, and security through blockchain technology and verified identities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              RentRight was founded with a simple mission: to eliminate fraud and build trust in the rental market. By leveraging blockchain technology and Civic Auth verification, we ensure that every landlord is legitimate and every tenant is verified.
            </p>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Our platform creates a secure ecosystem where both tenants and landlords can interact with confidence, knowing that everyone has been properly verified through our rigorous blockchain-based authentication system.
            </p>
            <Button className="bg-gradient-to-r from-rent-blue-600 to-rent-green-600 hover:from-rent-blue-700 hover:to-rent-green-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn More About Our Technology
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-rent-blue-600 mx-auto mb-2" />
                <CardTitle className="text-2xl">10,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Verified Users</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Home className="h-12 w-12 text-rent-green-600 mx-auto mb-2" />
                <CardTitle className="text-2xl">5,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Listed Properties</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-2xl">99.9%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Security Rate</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                <CardTitle className="text-2xl">4.9/5</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-8">Why Choose RentRight?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-rent-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-rent-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Verified Trust</h4>
              <p className="text-gray-600">
                Every user undergoes rigorous verification through Civic Auth and blockchain technology, ensuring legitimate interactions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-rent-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-rent-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Quality Properties</h4>
              <p className="text-gray-600">
                All properties are listed by verified landlords with confirmed ownership, guaranteeing authentic listings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Community Driven</h4>
              <p className="text-gray-600">
                Join a community of verified renters and landlords working together to create a better rental experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
