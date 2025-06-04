/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Property {
  id: string;
  landlordWallet: string;
  title: string;
  rent: number;
  address: {
    area?: string;
    city: string;
    pincode: string;
    street?: string;
    landmark?: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  rating: number;
  tags: string[];
  photos: string[];
  description?: string;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

export interface User {
  walletAddress: string;
  name: string;
  email: string;
  aadharHash?: string;
  isVerified: boolean;
  roles: string[];
  contact?: {
    phone?: string;
    altPhone?: string;
  };
  createdAt: any;
  updatedAt: any;
}
