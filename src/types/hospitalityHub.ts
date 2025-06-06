export interface HospitalityItem {
  id: string;
  title: string;
  description: string;
  location?: string;
  date?: string;
  image?: string;
  [key: string]: any;
}

export interface HospitalityCategory {
  id: string;
  title: string;
  description?: string;
  image?: string;
  optionalFields?: string[];
}
