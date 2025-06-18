export interface HospitalityItem {
  id: string;
  name: string;
  description: string;
  howToDetails: string;
  extraDetails: string;
  customerId: string;
  itemOwnerUserId: string;
  hospitalityCatId: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  location: string;
  itemType:
    | "singleDayBookable"
    | "singleDayBookableWithStartEnd"
    | "multiDayBookable"
    | "registerInterest"
    | "info";
  logoImageUrl: string;
  coverImageUrl: string;
  additionalImageUrlList: string[] | null;
  // handlerEmail?: string; - REMOVE
  fullAddress?: string | null;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface HospitalityCategory {
  id: string;
  name: string;
  description: string;
  customerId: string;
  catOwnerUserId: string;
  isActive: boolean;
  imageUrl?: string;
  // handlerEmail?: string; - REMOVE
}

export interface HospitalityBooking {
  userHospitalityItemId: number;
  info?: string;
  customerId: number;
  bookingType: string;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
  startTime?: string; // Format: YYYY-MM-DD HH:mm:ss
  endTime?: string; // Format: YYYY-MM-DD HH:mm:ss
  numberOfPeople?: number;
  specialRequests?: string;
}
