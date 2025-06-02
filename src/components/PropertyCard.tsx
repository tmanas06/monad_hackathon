// PropertyCard.tsx
import { useState } from 'react';
import { Star, MapPin, BedDouble, Bath, Ruler, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';

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
      className="rounded-2xl shadow bg-white border border-slate-200 overflow-hidden max-w-xl mx-auto hover:shadow-lg transition cursor-pointer relative"
      onClick={onViewDetails}
    >
      {/* Edit button */}
      {showEdit && (
        <button
          className="absolute top-3 left-3 z-10 bg-slate-100 hover:bg-slate-200 p-2 rounded-full"
          onClick={e => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <Pencil className="h-4 w-4 text-slate-700" />
        </button>
      )}
      {/* Image Section */}
      <div className="relative h-56 bg-slate-100 flex items-center justify-center">
        {photos && photos.length > 0 ? (
          <>
            <img src={photos[photoIdx]} alt={title} className="object-cover w-full h-full" />
            {photos.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                  onClick={handlePrev}
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                  onClick={handleNext}
                  aria-label="Next Photo"
                >
                  <ChevronRight className="h-5 w-5 text-slate-700" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
            <svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="7" y="9" width="10" height="7" rx="2" fill="#e2e8f0" />
              <circle cx="10" cy="12" r="1" fill="#94a3b8" />
            </svg>
            <span className="font-medium">No Photo</span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          {isAvailable && (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
              Verified
            </span>
          )}
        </div>
      </div>
      {/* Details Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <div className="text-2xl font-bold text-green-600">
            ₹{rent?.toLocaleString()}/month
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <MapPin className="h-4 w-4" />
          <span>
            {address?.area}{address?.area ? ', ' : ''}
            {address?.city}{address?.pincode ? ', ' + address.pincode : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-yellow-500 mb-3">
          <Star className="h-4 w-4" />
          <span className="font-semibold">{rating ?? 'N/A'}</span>
        </div>
        <div className="flex gap-6 mb-4 text-slate-600">
          {bedrooms !== undefined && <div className="flex items-center gap-2"><BedDouble className="h-4 w-4" />{bedrooms} bed</div>}
          {bathrooms !== undefined && <div className="flex items-center gap-2"><Bath className="h-4 w-4" />{bathrooms} bath</div>}
          {areaSqft !== undefined && <div className="flex items-center gap-2"><Ruler className="h-4 w-4" />{areaSqft} sqft</div>}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags?.map(tag => (
            <span key={tag} className="px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700">{tagLabels[tag] || tag}</span>
          ))}
        </div>
        {/* Optionally, you can add a View Details button here */}
      </div>
    </div>
  );
}
