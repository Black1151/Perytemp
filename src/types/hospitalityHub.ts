export interface HospitalityItem {
  id: string;
  title: string;
  description: string;
  location?: string;
  date?: string;
  image?: string;
  [key: string]: any;
}
/// above needs updateing to actual structure

export interface HospitalityCategory {
  id: string;
  name: string;
  description: string;
  customerId: string;
  catOwnerUserId: string;
}
