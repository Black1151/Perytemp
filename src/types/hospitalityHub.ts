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
  itemType: string;
  logoImageUrl: string;
  coverImageUrl: string;
  additionalImageUrlList: string[] | null;
  handlerEmail?: string;
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
  handlerEmail?: string;
}
