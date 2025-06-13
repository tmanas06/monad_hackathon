import '../fonts.css';
import WalletConnect from './WalletConnect';
const Hero = () => {
  return (
    <section
      className="relative flex items-center justify-center min-h-screen w-full px-6 md:px-12 text-center"
      style={{
        background: `url('/herobg.jpg') center/cover no-repeat`,
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 pt-20">
        {/* Small brand text */}
        <div className="uppercase text-sm tracking-[0.15em] text-neutral-400 mb-2">RentRight</div>

        {/* Thin accent line */}
        <div className="h-[2px] w-16 bg-green-300 mb-4"></div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-serif leading-tight tracking-wide text-white"
          style={{ fontFamily: '"Cyber"' }}
        >
          Trusted Rentals, <span className="italic text-green-300">Verified</span> Tenants
        </h1>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl text-neutral-200 max-w-xl mt-4"
          style={{ fontFamily: '"Outfit", sans-serif', lineHeight: '1.7' }}
        >
          RentRight uses Civic Auth for secure tenant verification, making the rental process faster, safer, and more reliable for both landlords and tenants.
        </p>

        {/* Button */}
        <div className="mt-8">
          <WalletConnect/>
        </div>
      </div>
    </section>
  );
};

export default Hero;
