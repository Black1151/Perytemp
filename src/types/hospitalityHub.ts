export interface HospitalityItem {
  id: string;
  name: string;
  description: string;
  howToDetails?: string;
  extraDetails?: string;
  customerId: string;
  itemOwnerUserId: string;
  hospitalityCatId: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string | null;
  location?: string;
  siteIds?: number[];
  itemType:
    | "singleDayBookable"
    | "singleDayBookableWithStartEnd"
    | "multiDayBookable"
    | "registerInterest"
    | "info";
  logoImageUrl?: string;
  coverImageUrl: string;
  additionalImageUrlList?: string[] | null;
  fullAddress?: string | null;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  /** Owner of the category this item belongs to */
  catOwnerUserId?: string;
}

export interface HospitalityCategory {
  id: string;
  name: string;
  description: string;
  customerId: string;
  catOwnerUserId: string;
  isActive: boolean;
  imageUrl?: string;
}

export interface HospitalityBooking {
  userHospitalityItemId: number;
  info?: string;
  customerId: number;
  bookingType: string;
  /** Type of the item being booked */
  itemType?: string;
  /** ID of the user creating the booking */
  bookerId?: number;
  /** Owner of the item or its category */
  ownerId?: number;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
  startTime?: string; // Format: YYYY-MM-DD HH:mm:ss
  endTime?: string; // Format: YYYY-MM-DD HH:mm:ss
  numberOfPeople?: number;
  specialRequests?: string;
}
