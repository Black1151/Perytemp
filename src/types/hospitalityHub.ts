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
  endDate: string;
  location: string;
  itemType: string;
  logoImageUrl: string;
  coverImageUrl: string;
  additionalImageUrlList: string[];
}

export interface HospitalityCategory {
  id: string;
  name: string;
  description: string;
  customerId: string;
  catOwnerUserId: string;
}
