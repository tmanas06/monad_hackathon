import { useState } from 'react';
import { Star, MapPin, BedDouble, Bath, Ruler, ChevronLeft, ChevronRight, Pencil, CheckCircle } from 'lucide-react';

const tagLabels: Record<string, string> = {
  family_friendly: "Family Friendly",
  bachelor_friendly: "Bachelor Friendly",
  student_friendly: "Student Friendly",
  work_drive_friendly: "Work Drive Friendly",
};

export default function PropertyCard({
  id,
  title,
  address,
  rent,
  rating,
  bedrooms,
  bathrooms,
  areaSqft,
  tags = [],
  photos = [],
  isAvailable = true,
  onViewDetails,
  onEdit,
  showEdit,
}: {
  id: string;
  title: string;
  address: { area?: string; city?: string; pincode?: string };
  rent: number;
  rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  tags?: string[];
  photos?: string[];
  isAvailable?: boolean;
  onViewDetails?: () => void;
  onEdit?: () => void;
  showEdit?: boolean;
}) {
  const [photoIdx, setPhotoIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIdx((idx) => (idx === 0 ? (photos.length - 1) : idx - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIdx((idx) => (idx === photos.length - 1 ? 0 : idx + 1));
  };

  return (
    <div
      className="rounded-3xl shadow-xl border-0 overflow-hidden max-w-xl mx-auto transition cursor-pointer relative mb-12"
      style={{
        background: 'linear-gradient(135deg, #f8f6f1 60%, #ece7de 100%)',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px 0 rgba(24,24,24,0.08)',
      }}
      onClick={onViewDetails}
    >
      {/* Edit button */}
      {showEdit && (
        <button
          className="absolute top-4 left-4 z-10 bg-black/5 hover:bg-black/20 p-2 rounded-full shadow"
          onClick={e => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <Pencil className="h-4 w-4 text-black/70" />
        </button>
      )}
      {/* Image Section */}
      <div className="relative h-56 bg-[#ece7de] flex items-center justify-center">
        {photos && photos.length > 0 ? (
          <>
            <img
              src={photos[photoIdx]}
              alt={title}
              className="object-cover w-full h-full"
              style={{ borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}
            />
            {photos.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/30 rounded-full p-2 shadow"
                  onClick={handlePrev}
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="h-5 w-5 text-black/80" />
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/30 rounded-full p-2 shadow"
                  onClick={handleNext}
                  aria-label="Next Photo"
                >
                  <ChevronRight className="h-5 w-5 text-black/80" />
                </button>
              </>
            )}
            {/* Geometric indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 w-2.5 rounded-full border-2 border-black/30 transition-all duration-300 ${
                    photoIdx === idx ? 'bg-black' : 'bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-[#bcb8b1]">
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e6e1d9" strokeWidth="2" />
              <rect x="7" y="9" width="10" height="7" rx="2" fill="#e6e1d9" />
              <circle cx="10" cy="12" r="1" fill="#bcb8b1" />
            </svg>
            <span className="font-medium">No Photo</span>
          </div>
        )}
        {/* Verified Badge */}
        {isAvailable && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full shadow">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-semibold text-black">Verified</span>
          </div>
        )}
      </div>
      {/* Details Section */}
      <div className="p-7 pb-5" style={{ background: 'linear-gradient(135deg, #fffdfa 90%, #f8f6f1 160%)' }}>
        <div className="flex justify-between items-center mb-2">
          <h2
            className="text-2xl font-bold"
            style={{
              fontFamily: '"Cyber", sans-serif',
              color: "#181818",
              letterSpacing: '0.01em'
            }}
          >
            {title}
          </h2>
          <div className="text-2xl font-bold text-white bg-black px-4 py-1 rounded-full shadow"
            style={{ fontFamily: '"Outfit", sans-serif' }}>
            ₹{rent?.toLocaleString()}/month
          </div>
        </div>
        <div className="flex items-center gap-2 text-black/60 mb-2 text-base">
          <MapPin className="h-4 w-4" />
          <span>
            {address?.area}{address?.area ? ', ' : ''}
            {address?.city}{address?.pincode ? ', ' + address.pincode : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-yellow-500 mb-4 text-base">
          <Star className="h-4 w-4" />
          <span className="font-semibold">{rating ?? 'N/A'}</span>
        </div>
        <div className="flex gap-6 mb-4 text-black/80 text-base">
          {bedrooms !== undefined && <div className="flex items-center gap-2"><BedDouble className="h-4 w-4" />{bedrooms} bed</div>}
          {bathrooms !== undefined && <div className="flex items-center gap-2"><Bath className="h-4 w-4" />{bathrooms} bath</div>}
          {areaSqft !== undefined && <div className="flex items-center gap-2"><Ruler className="h-4 w-4" />{areaSqft} sqft</div>}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags?.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-black/10 text-black text-xs font-semibold tracking-wide"
              style={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '0.03em' }}
            >
              {tagLabels[tag] || tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
