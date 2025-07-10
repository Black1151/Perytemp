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
  latitude?: number;
  longitude?: number;
  siteIds?: number[];
  itemType:
    | "singleDayBookable"
    | "singleDayBookableWithStartEnd"
    | "multiDayBookable"
    | "registerInterest"
    | "info"
    | "info(tel)"
    | "info(code)"
    | "info(email)"
    | "info(link)";
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
  /** Distance from filter location in meters, if available */
  distance_from_m?: number;
  infoContent?: string;
}

export interface HospitalityCategory {
  id: string;
  name: string;
  description: string;
  customerId: string;
  catOwnerUserId: string;
  isActive: boolean;
  /** Image representing the category */
  coverImageUrl?: string;
  itemsCount?: number
}

export interface HospitalityBooking {
  userHospitalityItemId: number;
  info?: string;
  customerId: number;
  bookingType: string;
  /** Type of the item being booked */
  itemType?: string;
  /** ID of the user creating the booking */
  bookerUserId?: number;
  /** Owner of the item or its category */
  ownerUserId?: number;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
  startTime?: string; // Format: YYYY-MM-DD HH:mm:ss
  endTime?: string; // Format: YYYY-MM-DD HH:mm:ss
  numberOfPeople?: number;
  specialRequests?: string;
}
