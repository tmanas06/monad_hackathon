import '../fonts.css';
import CivicAuthButton from '@/components/CivicAuthButton';

const Hero = () => {
  return (
    <section
      className="relative flex items-center justify-center min-h-[95vh] px-6 md:px-12 text-center bg-black rounded-[20px] overflow-hidden"
      style={{
        background: `url('/herobg.jpg') center/cover no-repeat`,
      }}
    >
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Logo or small brand text if needed */}
        {/* <div className="uppercase text-sm tracking-widest text-neutral-400 mb-2">Luxury Rentals</div> */}

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-serif leading-tight tracking-wide text-white"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Trusted Rentals,<br />Verified Tenants
        </h1>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl text-neutral-200 max-w-xl"
          style={{ fontFamily: '"Outfit", sans-serif', lineHeight: '1.7' }}
        >
          RentRight uses Civic Auth for secure tenant verification, making the rental process faster, safer, and more reliable for both landlords and tenants.
        </p>

        {/* Button */}
        <div className="mt-6">
          <CivicAuthButton />
        </div>
      </div>
    </section>
  );
};

export default Hero;
