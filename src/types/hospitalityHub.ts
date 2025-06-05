export interface HospitalityItem {
  id: string;
  title: string;
  description: string;
  location?: string;
  date?: string;
  [key: string]: any;
}

export interface HospitalityCategory {
  key: string;
  displayName: string;
  image: string;
  optionalFields: Array<"location" | "date">;
}
