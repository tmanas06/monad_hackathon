
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Shield } from 'lucide-react';

const PropertyListings = () => {
  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      price: "$2,500/month",
      location: "Downtown, San Francisco",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      image: "/placeholder.svg",
      verified: true,
      landlordVerified: true
    },
    {
      id: 2,
      title: "Cozy Studio in Mission",
      price: "$1,800/month",
      location: "Mission District, San Francisco",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      image: "/placeholder.svg",
      verified: true,
      landlordVerified: true
    },
    {
      id: 3,
      title: "Spacious Family Home",
      price: "$4,200/month",
      location: "Sunset District, San Francisco",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      image: "/placeholder.svg",
      verified: true,
      landlordVerified: true
    }
  ];

  return (
    <section id="properties" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rent-blue-600 to-rent-green-600 bg-clip-text text-transparent">
            Verified Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All properties and landlords are verified through Civic Auth and blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {property.verified && (
                    <Badge className="bg-rent-green-500 hover:bg-rent-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {property.landlordVerified && (
                    <Badge className="bg-rent-blue-500 hover:bg-rent-blue-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Landlord Verified
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <span className="text-2xl font-bold text-rent-green-600">{property.price}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms} bed
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms} bath
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.sqft} sqft
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-rent-blue-600 to-rent-green-600 hover:from-rent-blue-700 hover:to-rent-green-700">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyListings;
