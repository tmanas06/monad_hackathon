import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Users, Shield, Award, ExternalLink, Sparkles, Zap } from 'lucide-react';

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-28 px-4 flex justify-center bg-transparent"
      style={{
        background: 'none',
      }}
    >
      <div className="w-full max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-[#19e68c]" />
            <span className="uppercase tracking-[0.15em] text-[#19e68c] font-semibold text-sm">About Us</span>
            <Sparkles className="h-6 w-6 text-[#19e68c]" />
          </div>
          <h2
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            style={{
              fontFamily: '"Cyber", sans-serif',
              letterSpacing: '-0.03em',
            }}
          >
            About <span className="bg-gradient-to-r from-green-950 via-[#19e68c] to-[#19e68c] bg-clip-text text-transparent">RentRight</span>
          </h2>
          <p className="text-xl text-black/80 max-w-3xl mx-auto font-light" style={{ fontFamily: '"Outfit", sans-serif' }}>
            We&apos;re revolutionizing the rental market by bringing <span className="font-semibold text-[#19e68c]">trust</span>, <span className="font-semibold text-[#19e68c]">transparency</span>, and <span className="font-semibold text-[#19e68c]">security</span> through blockchain technology and verified identities.
          </p>
        </div>

        {/* Mission & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-8" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>
              Our Mission
            </h3>
            <p className="text-black/80 mb-5 text-lg leading-relaxed font-light" style={{ fontFamily: '"Outfit", sans-serif' }}>
              RentRight was founded with a simple mission: to eliminate fraud and build trust in the rental market. By leveraging blockchain technology and Civic Auth verification, we ensure that every landlord is legitimate and every tenant is verified.
            </p>
            <p className="text-black/80 mb-10 text-lg leading-relaxed font-light" style={{ fontFamily: '"Outfit", sans-serif' }}>
              Our platform creates a secure ecosystem where both tenants and landlords can interact with confidence, knowing that everyone has been properly verified through our rigorous blockchain-based authentication system.
            </p>
            <Button className="bg-black hover:bg-neutral-900 text-white rounded-full px-8 py-4 font-semibold text-lg shadow-lg transition-all flex items-center gap-2 mx-auto md:mx-0">
              <ExternalLink className="h-5 w-5" />
              Learn More About Our Technology
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-8">
            <Card className="bg-white/90 border-0 rounded-2xl shadow-2xl flex flex-col items-center py-10 backdrop-blur-md">
              <CardHeader className="flex flex-col items-center">
                <Users className="h-10 w-10 mb-3 text-[#19e68c]" />
                <CardTitle className="text-3xl font-bold" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>10,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/60 font-medium">Verified Users</p>
              </CardContent>
            </Card>
            <Card className="bg-white/90 border-0 rounded-2xl shadow-2xl flex flex-col items-center py-10 backdrop-blur-md">
              <CardHeader className="flex flex-col items-center">
                <Home className="h-10 w-10 mb-3 text-[#19e68c]" />
                <CardTitle className="text-3xl font-bold" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>5,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/60 font-medium">Listed Properties</p>
              </CardContent>
            </Card>
            <Card className="bg-white/90 border-0 rounded-2xl shadow-2xl flex flex-col items-center py-10 backdrop-blur-md">
              <CardHeader className="flex flex-col items-center">
                <Shield className="h-10 w-10 mb-3 text-[#19e68c]" />
                <CardTitle className="text-3xl font-bold" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>99.9%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/60 font-medium">Security Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-white/90 border-0 rounded-2xl shadow-2xl flex flex-col items-center py-10 backdrop-blur-md">
              <CardHeader className="flex flex-col items-center">
                <Award className="h-10 w-10 mb-3 text-[#19e68c]" />
                <CardTitle className="text-3xl font-bold" style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}>4.9/5</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/60 font-medium">User Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-white/90 dark:bg-neutral-900/90 rounded-3xl px-8 py-14 shadow-2xl max-w-5xl mx-auto backdrop-blur-md border-0">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Zap className="h-6 w-6 text-[#19e68c]" />
            <h3 className="text-3xl font-bold text-black text-center" style={{ fontFamily: '"Cyber", sans-serif' }}>
              Why Choose RentRight?
            </h3>
            <Zap className="h-6 w-6 text-[#19e68c]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center flex flex-col items-center">
              <div className="bg-[#19e68c]/10 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                <Shield className="h-8 w-8 text-[#19e68c]" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black" style={{ fontFamily: '"Outfit", sans-serif' }}>Verified Trust</h4>
              <p className="text-black/70 font-light">
                Every user undergoes rigorous verification through Civic Auth and blockchain technology, ensuring legitimate interactions.
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="bg-[#19e68c]/10 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                <Home className="h-8 w-8 text-[#19e68c]" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black" style={{ fontFamily: '"Outfit", sans-serif' }}>Quality Properties</h4>
              <p className="text-black/70 font-light">
                All properties are listed by verified landlords with confirmed ownership, guaranteeing authentic listings.
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="bg-[#19e68c]/10 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                <Users className="h-8 w-8 text-[#19e68c]" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-black" style={{ fontFamily: '"Outfit", sans-serif' }}>Community Driven</h4>
              <p className="text-black/70 font-light">
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
