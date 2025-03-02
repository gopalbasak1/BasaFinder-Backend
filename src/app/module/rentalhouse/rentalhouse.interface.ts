/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Schema } from 'mongoose';

export type TDivisions =
  | 'Dhaka'
  | 'Mymensingh'
  | 'Chattogram'
  | 'Rajshahi'
  | 'Rangpur'
  | 'Khulna'
  | 'Barishal'
  | 'Sylhet';

export type TDistricts =
  | 'Bagerhat'
  | 'Bandarban'
  | 'Barguna'
  | 'Barishal'
  | 'Bhola'
  | 'Bogra'
  | 'Brahmanbaria'
  | 'Chandpur'
  | 'Chattogram'
  | 'Chuadanga'
  | 'Comilla'
  | "Cox's Bazar"
  | 'Dhaka'
  | 'Dinajpur'
  | 'Faridpur'
  | 'Feni'
  | 'Gaibandha'
  | 'Gazipur'
  | 'Gopalganj'
  | 'Habiganj'
  | 'Jashore'
  | 'Jhalokati'
  | 'Jhenaidah'
  | 'Joypurhat'
  | 'Khagrachhari'
  | 'Khulna'
  | 'Kishoreganj'
  | 'Kurigram'
  | 'Kushtia'
  | 'Lakshmipur'
  | 'Lalmonirhat'
  | 'Madaripur'
  | 'Magura'
  | 'Manikganj'
  | 'Meherpur'
  | 'Moulvibazar'
  | 'Munshiganj'
  | 'Mymensingh'
  | 'Naogaon'
  | 'Narail'
  | 'Narayanganj'
  | 'Narsingdi'
  | 'Natore'
  | 'Netrakona'
  | 'Noakhali'
  | 'Nawabganj'
  | 'Pabna'
  | 'Panchagarh'
  | 'Patuakhali'
  | 'Pirojpur'
  | 'Rajbari'
  | 'Rajshahi'
  | 'Rangamati'
  | 'Rangpur'
  | 'Satkhira'
  | 'Shariatpur'
  | 'Sherpur'
  | 'Sirajganj'
  | 'Sunamganj'
  | 'Sylhet'
  | 'Tangail'
  | 'Thakurgaon';

export interface IRentalListing extends Document {
  landlordId: Schema.Types.ObjectId; // Reference to User model (Landlord)
  holding: string;
  address: string;
  district: TDistricts;
  postalCode?: string;
  upazila?: string;
  unitNumber: string;
  citycorporation?: string;
  division: TDivisions;
  country: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  images: string[]; // Array of image URLs
  availableFrom: Date;
  isAvailable?: boolean;
  category: 'family' | 'bachelor';
  createdAt: Date;
  reviews: Schema.Types.ObjectId; // Array of reviews for this rental house
  ratingCount?: number; // Total number of reviews
  averageRating?: number; // Average rating from reviews
  specification: Record<string, any>;
  keyFeatures: string[];
}
