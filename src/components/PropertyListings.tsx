
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Car, Shield } from 'lucide-react';

const PropertyListings = () => {
  const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "Downtown, San Francisco",
      price: "$3,200/month",
      beds: 2,
      baths: 2,
      parking: 1,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      verified: true,
      landlordVerified: true
    },
    {
      id: 2,
      title: "Cozy Studio Near Tech Hub",
      location: "SOMA, San Francisco",
      price: "$2,800/month",
      beds: 1,
      baths: 1,
      parking: 0,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      verified: true,
      landlordVerified: true
    },
    {
      id: 3,
      title: "Family Home with Garden",
      location: "Mission District, SF",
      price: "$4,500/month",
      beds: 3,
      baths: 2,
      parking: 2,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      verified: true,
      landlordVerified: false
    }
  ];

  return (
    <section id="properties" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Featured Properties</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse verified properties from trusted landlords. All listings include Civic Auth verification status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.verified && (
                    <Badge className="bg-rent-green-500 hover:bg-rent-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {property.landlordVerified && (
                    <Badge variant="secondary" className="bg-rent-blue-500 text-white hover:bg-rent-blue-600">
                      Trusted Landlord
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <h4 className="text-lg font-semibold">{property.title}</h4>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-rent-blue-600">{property.price}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.beds} bed{property.beds > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.baths} bath{property.baths > 1 ? 's' : ''}
                  </div>
                  {property.parking > 0 && (
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      {property.parking} parking
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-rent-blue-600 to-rent-green-600 hover:from-rent-blue-700 hover:to-rent-green-700">
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyListings;
