import '../fonts.css';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import CivicAuthButton from '@/components/CivicAuthButton';


const Hero = () => {
  return (
    <section className="relative bg-[#FAF6F2] min-h-[90vh] flex items-center px-6 md:px-0">
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
        {/* Left: Headline and Text */}
        <div className="flex-1 pt-12 md:pt-0">
          <h1
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            style={{ fontFamily: '"Cyber", sans-serif', color: "#181818" }}
          >
            Trusted Rentals,<br />Verified Tenants
          </h1>
          <p
            className="text-lg md:text-xl text-neutral-600 mb-10 max-w-lg"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            RentRight uses Civic Auth for secure tenant verification, making the rental process faster, safer, and more reliable for both landlords and tenants.
          </p>
          <CivicAuthButton />
        </div>

        {/* Right: Graphic and Image */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Large orange circle accent */}
          <div className="absolute -z-10 w-72 h-72 md:w-96 md:h-96 bg-orange-400 rounded-full right-0 top-10 md:top-0 md:right-10 opacity-90"></div>
          {/* Placeholder for user image */}
          <div className="relative z-10 w-60 h-60 md:w-80 md:h-80 rounded-full overflow-hidden flex items-center justify-center border-8 border-white shadow-lg">
            {/* Replace with your own image */}
            <img
              src="/keyhand.jpg"
              alt="Tenant"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Optional: geometric accent (SVG or CSS) */}
          <svg
            className="absolute left-0 top-0 md:left-10 md:top-10 w-24 h-24 text-black opacity-20"
            fill="none"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
